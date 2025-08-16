from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.modules.contacts import crud, schemas
from app.modules.users.models import User
from app.core.security import get_current_user

router = APIRouter()

@router.post("/", response_model=schemas.Contact)
def create_contact(
    contact: schemas.ContactCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return crud.create_contact(db=db, contact=contact, user_id=current_user.id)

@router.get("/", response_model=list[schemas.Contact])
def read_contacts(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Administrator role required
    if not any(r.name == "administrator" for r in current_user.roles):
        raise HTTPException(status_code=403, detail="Not enough permissions")
    contacts = crud.get_contacts(db, skip=skip, limit=limit)
    return contacts

@router.get("/{contact_id}", response_model=schemas.Contact)
def read_contact(
    contact_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    db_contact = crud.get_contact(db, contact_id=contact_id)
    if db_contact is None:
        raise HTTPException(status_code=404, detail="Contact not found")
    if db_contact.user_id != current_user.id and not any(r.name == "administrator" for r in current_user.roles):
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return db_contact

@router.put("/{contact_id}", response_model=schemas.Contact)
def update_contact(
    contact_id: int,
    contact: schemas.ContactUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    db_contact = crud.get_contact(db, contact_id=contact_id)
    if db_contact is None:
        raise HTTPException(status_code=404, detail="Contact not found")
    if db_contact.user_id != current_user.id and not any(r.name == "administrator" for r in current_user.roles):
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return crud.update_contact(db=db, contact_id=contact_id, contact=contact)

@router.delete("/{contact_id}", response_model=schemas.Contact)
def delete_contact(
    contact_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    db_contact = crud.get_contact(db, contact_id=contact_id)
    if db_contact is None:
        raise HTTPException(status_code=404, detail="Contact not found")
    if db_contact.user_id != current_user.id and not any(r.name == "administrator" for r in current_user.roles):
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return crud.delete_contact(db=db, contact_id=contact_id)
