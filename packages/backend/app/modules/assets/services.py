
from sqlalchemy.orm import Session
from . import models, schemas
from typing import List, Optional

def create_asset(db: Session, asset: schemas.AssetCreate) -> models.Asset:
    """Create a new asset."""
    db_asset = models.Asset(**asset.model_dump())
    db.add(db_asset)
    db.commit()
    db.refresh(db_asset)
    return db_asset

def get_asset(db: Session, asset_id: int) -> Optional[models.Asset]:
    """Get a single asset by its ID."""
    return db.query(models.Asset).filter(models.Asset.id == asset_id).first()

def get_all_assets(db: Session, skip: int = 0, limit: int = 100) -> List[models.Asset]:
    """Get all assets."""
    return db.query(models.Asset).offset(skip).limit(limit).all()

def update_asset(db: Session, asset_id: int, asset_update: schemas.AssetUpdate) -> Optional[models.Asset]:
    """Update an asset."""
    db_asset = get_asset(db, asset_id)
    if db_asset:
        update_data = asset_update.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_asset, key, value)
        db.commit()
        db.refresh(db_asset)
    return db_asset

def delete_asset(db: Session, asset_id: int) -> Optional[models.Asset]:
    """Delete an asset."""
    db_asset = get_asset(db, asset_id)
    if db_asset:
        db.delete(db_asset)
        db.commit()
    return db_asset

def assign_asset_to_user(db: Session, asset_id: int, user_id: int) -> Optional[models.Asset]:
    """Assign an asset to a user."""
    db_asset = get_asset(db, asset_id)
    if db_asset:
        db_asset.assignee_id = user_id
        db_asset.status = models.AssetStatus.ASSIGNED
        db.commit()
        db.refresh(db_asset)
    return db_asset
