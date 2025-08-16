from fastapi import Depends, FastAPI, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import timedelta

from app.modules.users import schemas as user_schemas
from app.core import security
from app.api.v1.router import api_router

from app.modules.users import models
from app.modules.contacts.models import Contact
from app.db.base import Base
from app.db.session import engine, get_db
from app.core.config import settings
from app.utils.email import send_email
from app.core.config import settings as app_settings
from contextlib import asynccontextmanager


Base.metadata.create_all(bind=engine)

def _seed_roles_session(db: Session):
    existing = {r.name for r in db.query(models.Role).all()}
    created = []
    if 'administrator' not in existing:
        db.add(models.Role(name='administrator', description='System administrator'))
        created.append('administrator')
    if 'user' not in existing:
        db.add(models.Role(name='user', description='Default application user'))
        created.append('user')
    if created:
        db.commit()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Seed baseline roles before serving requests
    db = next(get_db())
    try:
        _seed_roles_session(db)
    finally:
        db.close()
    yield

app = FastAPI(lifespan=lifespan)

origins = [
    "http://localhost:3000",  # For local development
    "https://voli2-web.vercel.app", # Your deployed frontend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v1")



@app.post("/api/v1/users/", response_model=user_schemas.User)
def create_user(user: user_schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = security.get_password_hash(user.password)
    db_user = models.User(email=user.email, hashed_password=hashed_password)
    
    # pydantic v2: use model_dump
    contact_data = user.contact.model_dump()
    db_contact = Contact(**contact_data)
    db_user.contact = db_contact

    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    # Ensure baseline 'user' role exists and assign to new user if not already present
    baseline_role_name = app_settings.BASELINE_ROLE
    user_role = db.query(models.Role).filter(models.Role.name == baseline_role_name).first()
    if not user_role:
        user_role = models.Role(name=baseline_role_name, description='Default application user')
        db.add(user_role)
        db.commit()
        db.refresh(user_role)
    if user_role not in db_user.roles:
        db_user.roles.append(user_role)
        db.add(db_user)
        db.commit()
        db.refresh(db_user)

    # Send a welcome email
    subject = "Welcome to Voli - Your Registration is Complete!"
    html_content = f"""
    <p>Dear {db_user.email},</p>
    <p>Thank you for registering with Voli! Your account has been successfully created.</p>
    <p>You can now log in to your account using the following link:</p>
    <p><a href="{settings.LOGIN_URL}">{settings.LOGIN_URL}</a></p>
    <p>We look forward to seeing you!</p>
    <p>Best regards,</p>
    <p>The Voli Team</p>
    """
    send_email(
        email_to=db_user.email,
        subject=subject,
        html_content=html_content,
    )
    return db_user


@app.post("/api/v1/token", response_model=user_schemas.Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not security.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=401,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    # Legacy is_admin flag removed; role-based elevation handled via migration.
    roles = [role.name for role in user.roles]
    access_token = security.create_access_token(
        data={"sub": user.email, "roles": roles}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}
