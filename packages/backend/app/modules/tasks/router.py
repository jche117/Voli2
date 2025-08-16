from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.modules.users.models import User
from app.core.security import get_current_user, RoleChecker
from . import schemas, services

router = APIRouter()

@router.post("/", response_model=schemas.Task, status_code=status.HTTP_201_CREATED)
def create_task(
    task: schemas.TaskBase, # Changed from TaskCreate to TaskBase
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Create a new task for the current user.
    """
    # Manually create a TaskCreate schema for the service layer
    task_create = schemas.TaskCreate(**task.model_dump(), owner_id=current_user.id)
    return services.create_task(db=db, task=task_create)

@router.get("/", response_model=List[schemas.Task])
def read_tasks(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Retrieve tasks for the current user.
    """
    tasks = services.get_tasks_by_user(db, user_id=current_user.id, skip=skip, limit=limit)
    return tasks

@router.get("/all", response_model=List[schemas.Task], dependencies=[Depends(RoleChecker(['administrator']))])
def read_all_tasks(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """
    Retrieve all tasks (admin only).
    """
    tasks = services.get_all_tasks(db, skip=skip, limit=limit)
    return tasks

@router.get("/{task_id}", response_model=schemas.Task)
def read_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Retrieve a specific task by ID.
    """
    db_task = services.get_task(db, task_id=task_id)
    if db_task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    if db_task.owner_id != current_user.id and "administrator" not in [role.name for role in current_user.roles]:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return db_task

@router.put("/{task_id}", response_model=schemas.Task)
def update_task(
    task_id: int,
    task: schemas.TaskUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Update a task.
    """
    db_task = services.get_task(db, task_id=task_id)
    if db_task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    if db_task.owner_id != current_user.id and "administrator" not in [role.name for role in current_user.roles]:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return services.update_task(db=db, task_id=task_id, task_update=task)

@router.delete("/{task_id}", response_model=schemas.Task)
def delete_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Delete a task.
    """
    db_task = services.get_task(db, task_id=task_id)
    if db_task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    if db_task.owner_id != current_user.id and "administrator" not in [role.name for role in current_user.roles]:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return services.delete_task(db=db, task_id=task_id)