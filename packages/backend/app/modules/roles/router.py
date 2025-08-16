from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.modules.users import models as user_models
from app.modules.users import schemas as user_schemas
from app.core.security import RoleChecker
from . import services

router = APIRouter()

@router.post("/", response_model=user_schemas.Role, status_code=201, dependencies=[Depends(RoleChecker(["administrator"]))])
def create_role(role: user_schemas.RoleCreate, db: Session = Depends(get_db)):
    """
    Create a new role (admin only).
    """
    return services.create_role(db=db, role=role)

@router.get("/", response_model=List[user_schemas.Role], dependencies=[Depends(RoleChecker(["administrator"]))])
def read_roles(db: Session = Depends(get_db)):
    """
    Retrieve all roles (admin only).
    """
    return services.get_roles(db=db)

@router.post("/users/{user_id}/assign/{role_id}", response_model=user_schemas.User, dependencies=[Depends(RoleChecker(["administrator"]))])
def assign_role_to_user(user_id: int, role_id: int, db: Session = Depends(get_db)):
    """
    Assign a role to a user (admin only).
    """
    db_user = services.assign_role(db=db, user_id=user_id, role_id=role_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User or Role not found")
    return db_user

@router.delete("/users/{user_id}/revoke/{role_id}", response_model=user_schemas.User, dependencies=[Depends(RoleChecker(["administrator"]))])
def revoke_role_from_user(user_id: int, role_id: int, db: Session = Depends(get_db)):
    """
    Revoke a role from a user (admin only).
    """
    db_user = services.revoke_role(db=db, user_id=user_id, role_id=role_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User or Role not found")
    return db_user
