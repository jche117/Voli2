from pydantic import BaseModel, ConfigDict
from typing import Optional, Dict, Any
from datetime import datetime
from .models import TaskStatus

class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    due_date: Optional[datetime] = None
    status: TaskStatus = TaskStatus.PENDING

class TaskCreate(TaskBase):
    owner_id: int
    template_id: Optional[int] = None
    custom_data: Optional[Dict[str, Any]] = None

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    due_date: Optional[datetime] = None
    status: Optional[TaskStatus] = None
    custom_data: Optional[Dict[str, Any]] = None

class Task(TaskBase):
    id: int
    owner_id: int
    template_id: Optional[int] = None
    custom_data: Optional[Dict[str, Any]] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
