
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.core.security import RoleChecker
from . import schemas, services

router = APIRouter()

# All routes in this module will require administrator privileges
admin_dependency = Depends(RoleChecker(['administrator']))

@router.post("/", response_model=schemas.Asset, status_code=status.HTTP_201_CREATED, dependencies=[admin_dependency])
def create_asset(
    asset: schemas.AssetCreate,
    db: Session = Depends(get_db)
):
    """
    Create a new asset (admin only).
    """
    return services.create_asset(db=db, asset=asset)

@router.get("/", response_model=List[schemas.Asset], dependencies=[admin_dependency])
def read_assets(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """
    Retrieve all assets (admin only).
    """
    assets = services.get_all_assets(db, skip=skip, limit=limit)
    return assets

@router.get("/{asset_id}", response_model=schemas.Asset, dependencies=[admin_dependency])
def read_asset(
    asset_id: int,
    db: Session = Depends(get_db)
):
    """
    Retrieve a specific asset by ID (admin only).
    """
    db_asset = services.get_asset(db, asset_id=asset_id)
    if db_asset is None:
        raise HTTPException(status_code=404, detail="Asset not found")
    return db_asset

@router.put("/{asset_id}", response_model=schemas.Asset, dependencies=[admin_dependency])
def update_asset(
    asset_id: int,
    asset: schemas.AssetUpdate,
    db: Session = Depends(get_db)
):
    """
    Update an asset (admin only).
    """
    db_asset = services.get_asset(db, asset_id=asset_id)
    if db_asset is None:
        raise HTTPException(status_code=404, detail="Asset not found")
    return services.update_asset(db=db, asset_id=asset_id, asset_update=asset)

@router.delete("/{asset_id}", response_model=schemas.Asset, dependencies=[admin_dependency])
def delete_asset(
    asset_id: int,
    db: Session = Depends(get_db)
):
    """
    Delete an asset (admin only).
    """
    db_asset = services.get_asset(db, asset_id=asset_id)
    if db_asset is None:
        raise HTTPException(status_code=404, detail="Asset not found")
    return services.delete_asset(db=db, asset_id=asset_id)

@router.post("/{asset_id}/assign/{user_id}", response_model=schemas.Asset, dependencies=[admin_dependency])
def assign_asset(
    asset_id: int,
    user_id: int,
    db: Session = Depends(get_db)
):
    """
    Assign an asset to a user (admin only).
    """
    db_asset = services.assign_asset_to_user(db=db, asset_id=asset_id, user_id=user_id)
    if db_asset is None:
        raise HTTPException(status_code=404, detail="Asset not found")
    return db_asset
