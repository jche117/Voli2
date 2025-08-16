from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.modules.users import models, schemas
from app.core.config import settings

BASELINE_ROLE = settings.BASELINE_ROLE

def get_roles(db: Session):
    return db.query(models.Role).all()

def create_role(db: Session, role: schemas.RoleCreate):
    db_role = models.Role(name=role.name, description=role.description)
    db.add(db_role)
    db.commit()
    db.refresh(db_role)
    return db_role

def assign_role(db: Session, user_id: int, role_id: int):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    role = db.query(models.Role).filter(models.Role.id == role_id).first()
    if user and role:
        if role not in user.roles:
            user.roles.append(role)
            db.commit()
            db.refresh(user)
        return user
    return None

def revoke_role(db: Session, user_id: int, role_id: int):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    role = db.query(models.Role).filter(models.Role.id == role_id).first()
    if user and role and role in user.roles:
        # Prevent revoking baseline role to ensure every user retains minimal role
        if role.name == BASELINE_ROLE:
            raise HTTPException(status_code=400, detail=f"Cannot revoke the baseline role: '{BASELINE_ROLE}'")
        user.roles.remove(role)
        db.commit()
        db.refresh(user)
        return user
    return None


def get_role_by_name(db: Session, name: str):
    return db.query(models.Role).filter(models.Role.name == name).first()

