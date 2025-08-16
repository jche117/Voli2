
from sqlalchemy import Column, Integer, String, Text, JSON
from app.db.base import Base

class TaskTemplate(Base):
    __tablename__ = "task_templates"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False, unique=True)
    description = Column(Text, nullable=True)
    # This will store the schema for the custom fields
    fields_schema = Column(JSON, nullable=False, default=[])
