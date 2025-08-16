import os
import sys
from sqlalchemy.orm import sessionmaker
from app.db.session import engine
from app.modules.users.models import User
from app.modules.contacts.models import Contact
from app.modules.tasks.models import Task

# Add the project root to the Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '.')))

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def check_admin_status(email: str):
    """
    Checks the admin status for a user with the given email.
    """
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == email).first()
        if user:
            print(f"Status for user '{email}':")
            print(f"  roles: {[r.name for r in user.roles]}")
        else:
            print(f"Error: User with email '{email}' not found.")
    finally:
        db.close()

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python check_admin_status.py <email>")
        sys.exit(1)
    
    email_to_check = sys.argv[1]
    check_admin_status(email_to_check)
