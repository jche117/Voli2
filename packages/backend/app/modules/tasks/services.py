from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from . import models, schemas
from app.modules.task_templates.services import get_template
from typing import List, Optional

def validate_custom_data(custom_data: dict, fields_schema: list):
    # Basic validation: ensure all required fields are present
    required_fields = {field['name'] for field in fields_schema if field.get('required', False)}
    provided_fields = set(custom_data.keys())
    if not required_fields.issubset(provided_fields):
        missing_fields = required_fields - provided_fields
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Missing required custom fields: {list(missing_fields)}"
        )
    # TODO: Add more specific type validation based on schema (e.g., datetime, int)
    return True

def create_task(db: Session, task: schemas.TaskCreate) -> models.Task:
    """
    Create a new task.
    """
    if task.template_id:
        template = get_template(db, task.template_id)
        if not template:
            raise HTTPException(status_code=404, detail="Task template not found")
        if task.custom_data:
            validate_custom_data(task.custom_data, template.fields_schema)

    db_task = models.Task(**task.model_dump())
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

def get_task(db: Session, task_id: int) -> Optional[models.Task]:
    """
    Get a single task by its ID.
    """
    return db.query(models.Task).filter(models.Task.id == task_id).first()

def get_tasks_by_user(db: Session, user_id: int, skip: int = 0, limit: int = 100) -> List[models.Task]:
    """
    Get all tasks for a specific user.
    """
    return db.query(models.Task).filter(models.Task.owner_id == user_id).offset(skip).limit(limit).all()

def get_all_tasks(db: Session, skip: int = 0, limit: int = 100) -> List[models.Task]:
    """
    Get all tasks (for admins).
    """
    return db.query(models.Task).offset(skip).limit(limit).all()

def update_task(db: Session, task_id: int, task_update: schemas.TaskUpdate) -> Optional[models.Task]:
    """
    Update a task.
    """
    db_task = get_task(db, task_id)
    if db_task:
        if task_update.custom_data and db_task.template_id:
            template = get_template(db, db_task.template_id)
            if template:
                validate_custom_data(task_update.custom_data, template.fields_schema)

        update_data = task_update.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_task, key, value)
        db.commit()
        db.refresh(db_task)
    return db_task

def delete_task(db: Session, task_id: int) -> Optional[models.Task]:
    """
    Delete a task.
    """
    db_task = get_task(db, task_id)
    if db_task:
        db.delete(db_task)
        db.commit()
    return db_task