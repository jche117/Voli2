from sqlalchemy.orm import Session
from . import models, schemas
from typing import List, Optional

def create_template(db: Session, template: schemas.TaskTemplateCreate) -> models.TaskTemplate:
    """Create a new task template."""
    db_template = models.TaskTemplate(**template.model_dump())
    db.add(db_template)
    db.commit()
    db.refresh(db_template)
    return db_template

def get_template(db: Session, template_id: int) -> Optional[models.TaskTemplate]:
    """Get a single task template by its ID."""
    return db.query(models.TaskTemplate).filter(models.TaskTemplate.id == template_id).first()

def get_all_templates(db: Session, skip: int = 0, limit: int = 100) -> List[models.TaskTemplate]:
    """Get all task templates."""
    return db.query(models.TaskTemplate).offset(skip).limit(limit).all()

def update_template(db: Session, template_id: int, template_update: schemas.TaskTemplateUpdate) -> Optional[models.TaskTemplate]:
    """Update a task template."""
    db_template = get_template(db, template_id)
    if db_template:
        update_data = template_update.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_template, key, value)
        db.commit()
        db.refresh(db_template)
    return db_template

def delete_template(db: Session, template_id: int) -> Optional[models.TaskTemplate]:
    """Delete a task template."""
    db_template = get_template(db, template_id)
    if db_template:
        db.delete(db_template)
        db.commit()
    return db_template
