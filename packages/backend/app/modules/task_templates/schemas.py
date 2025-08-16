from pydantic import BaseModel, ConfigDict
from typing import Optional, List, Any, Dict

class FieldSchema(BaseModel):
    name: str
    label: str
    type: str
    required: bool = False
    options: Optional[List[str]] = None

class TaskTemplateBase(BaseModel):
    name: str
    description: Optional[str] = None
    fields_schema: List[FieldSchema] = []

class TaskTemplateCreate(TaskTemplateBase):
    pass

class TaskTemplateUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    fields_schema: Optional[List[FieldSchema]] = None

class TaskTemplate(TaskTemplateBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
