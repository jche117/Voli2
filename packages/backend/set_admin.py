import os
import sys
from sqlalchemy.orm import sessionmaker
from app.db.session import engine
from app.modules.users.models import User, Role
from app.modules.contacts.models import Contact
from app.modules.tasks.models import Task

# Add the project root to the Python path
# This is necessary for the script to find the 'app' module
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '.')))

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def set_admin_by_email(email: str):
    """Assign the 'administrator' role to the user with the given email."""
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == email).first()
        if not user:
            print(f"Error: User with email '{email}' not found.")
            return
        role = db.query(Role).filter(Role.name == "administrator").first()
        if not role:
            role = Role(name="administrator", description="System administrator")
            db.add(role)
            db.commit()
            db.refresh(role)
        if role in user.roles:
            print(f"User '{email}' already has administrator role.")
            return
        user.roles.append(role)
        db.add(user)
        db.commit()
        print(f"User '{email}' has been granted administrator role.")
    finally:
        db.close()

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python set_admin.py <email>")
        sys.exit(1)
    
    email_to_set = sys.argv[1]
    set_admin_by_email(email_to_set)
