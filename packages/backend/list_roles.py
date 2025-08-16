import os
import sys
from sqlalchemy.orm import sessionmaker
from app.db.session import engine
from app.modules.users.models import Role, User
from app.modules.contacts.models import Contact
from app.modules.tasks.models import Task

# Add the project root to the Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '.')))

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def list_roles():
    """
    Lists all roles available in the database.
    """
    db = SessionLocal()
    try:
        roles = db.query(Role).all()
        if roles:
            print("Available roles:")
            for role in roles:
                print(f"  - {role.name}")
        else:
            print("No roles found in the database.")
    finally:
        db.close()

if __name__ == "__main__":
    list_roles()
