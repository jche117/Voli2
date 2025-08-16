from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.modules.users import schemas
from app.modules.users import models
from app.modules.contacts import schemas as contacts_schemas
from app.db.session import get_db
from app.core import security

router = APIRouter()

async def get_current_admin_user(current_user: models.User = Depends(security.RoleChecker(["administrator"]))):
    return current_user

@router.get("/me", response_model=schemas.User)
async def read_users_me(current_user: models.User = Depends(security.get_current_user)):
    """
    Get current user.
    """
    return current_user


@router.get("/me/contact", response_model=contacts_schemas.Contact)
async def read_user_me_contact(
    current_user: models.User = Depends(security.get_current_user),
):
    """
    Get current user's contact info.
    """
    if not current_user.contact:
        raise HTTPException(status_code=404, detail="Contact not found for current user")
    return current_user.contact

@router.get("/", response_model=List[schemas.User])
async def read_users(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(security.RoleChecker(["administrator"])),
):
    users = db.query(models.User).all()
    # Safety: backfill None is_active values at runtime (should be handled by migrations, but prevents 500s)
    dirty = False
    for u in users:
        if getattr(u, 'is_active', True) is None:
            u.is_active = True
            db.add(u)
            dirty = True
    if dirty:
        db.commit()
    return users

@router.delete("/users/")
async def delete_users(
    user_ids: List[int],
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_admin_user),
):
    deleted_count = 0
    for user_id in user_ids:
        user = db.query(models.User).filter(models.User.id == user_id).first()
        if user:
            db.delete(user)
            db.commit()
            deleted_count += 1
    
    if deleted_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No users found with the provided IDs")

    return {"message": f"Successfully deleted {deleted_count} user(s)"}

@router.post("/users/assign_admin/", summary="Assign the 'administrator' role to given users")
async def assign_admin(
    user_ids: List[int],
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_admin_user),
):
    from app.modules.users.models import Role
    admin_role = db.query(Role).filter(Role.name == "administrator").first()
    if not admin_role:
        admin_role = Role(name="administrator", description="System administrator")
        db.add(admin_role)
        db.commit()
        db.refresh(admin_role)
    updated_count = 0
    for user_id in user_ids:
        user = db.query(models.User).filter(models.User.id == user_id).first()
        if user and admin_role not in user.roles:
            user.roles.append(admin_role)
            db.add(user)
            db.commit()
            db.refresh(user)
            updated_count += 1
    if updated_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No users updated (they may already be admins)")
    return {"message": f"Successfully assigned administrator role to {updated_count} user(s)"}
