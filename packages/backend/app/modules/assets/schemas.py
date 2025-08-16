
from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime
from .models import AssetStatus

class AssetBase(BaseModel):
    name: str
    description: Optional[str] = None
    serial_number: Optional[str] = None
    purchase_date: Optional[datetime] = None
    status: AssetStatus = AssetStatus.AVAILABLE

class AssetCreate(AssetBase):
    pass

class AssetUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    serial_number: Optional[str] = None
    purchase_date: Optional[datetime] = None
    status: Optional[AssetStatus] = None
    assignee_id: Optional[int] = None

class Asset(AssetBase):
    id: int
    assignee_id: Optional[int] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
