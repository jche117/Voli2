from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.core.security import RoleChecker
from . import schemas, services

router = APIRouter()

# All routes in this module will require administrator privileges
admin_dependency = Depends(RoleChecker(['administrator']))

@router.post("/", response_model=schemas.TaskTemplate, status_code=status.HTTP_201_CREATED, dependencies=[admin_dependency])
def create_template(
    template: schemas.TaskTemplateCreate,
    db: Session = Depends(get_db)
):
    """
    Create a new task template (admin only).
    """
    return services.create_template(db=db, template=template)

@router.get("/", response_model=List[schemas.TaskTemplate], dependencies=[admin_dependency])
def read_templates(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """
    Retrieve all task templates (admin only).
    """
    templates = services.get_all_templates(db, skip=skip, limit=limit)
    return templates

@router.get("/{template_id}", response_model=schemas.TaskTemplate, dependencies=[admin_dependency])
def read_template(
    template_id: int,
    db: Session = Depends(get_db)
):
    """
    Retrieve a specific task template by ID (admin only).
    """
    db_template = services.get_template(db, template_id=template_id)
    if db_template is None:
        raise HTTPException(status_code=404, detail="Task template not found")
    return db_template

@router.put("/{template_id}", response_model=schemas.TaskTemplate, dependencies=[admin_dependency])
def update_template(
    template_id: int,
    template: schemas.TaskTemplateUpdate,
    db: Session = Depends(get_db)
):
    """
    Update a task template (admin only).
    """
    db_template = services.get_template(db, template_id=template_id)
    if db_template is None:
        raise HTTPException(status_code=404, detail="Task template not found")
    return services.update_template(db=db, template_id=template_id, template_update=template)

@router.delete("/{template_id}", response_model=schemas.TaskTemplate, dependencies=[admin_dependency])
def delete_template(
    template_id: int,
    db: Session = Depends(get_db)
):
    """
    Delete a task template (admin only).
    """
    db_template = services.get_template(db, template_id=template_id)
    if db_template is None:
        raise HTTPException(status_code=404, detail="Task template not found")
    return services.delete_template(db=db, template_id=template_id)
