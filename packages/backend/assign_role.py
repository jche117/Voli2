import os
import sys
from sqlalchemy.orm import sessionmaker
from app.db.session import engine
from app.modules.users.models import User, Role
from app.modules.contacts.models import Contact
from app.modules.tasks.models import Task

# Add the project root to the Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '.')))

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def assign_role_to_user(email: str, role_name: str):
    """
    Assigns a specific role to a user.
    """
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == email).first()
        if not user:
            print(f"Error: User with email '{email}' not found.")
            return

        role = db.query(Role).filter(Role.name == role_name).first()
        if not role:
            print(f"Error: Role '{role_name}' not found.")
            return

        if role in user.roles:
            print(f"User '{email}' already has the '{role_name}' role.")
        else:
            user.roles.append(role)
            db.commit()
            print(f"Successfully assigned role '{role_name}' to user '{email}'.")

    finally:
        db.close()

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python assign_role.py <email> <role_name>")
        sys.exit(1)
    
    email_to_assign = sys.argv[1]
    role_to_assign = sys.argv[2]
    assign_role_to_user(email_to_assign, role_to_assign)
