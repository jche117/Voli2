from pydantic import BaseModel
from typing import List, Optional, Union
from app.modules.tasks.schemas import Task
from app.modules.contacts.schemas import Contact, ContactCreate
# Role Schemas
class RoleBase(BaseModel):
    name: str
# User Schemas
class UserBase(BaseModel):
    email: str

class UserCreate(BaseModel):
    email: str
    password: str
    contact: ContactCreate

class User(UserBase):
    id: int
    organization_id: Union[int, None] = None
    contact: Contact | None = None
    tasks: List[Task] = []
    roles: List[Role] = []

