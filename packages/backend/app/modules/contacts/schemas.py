from pydantic import BaseModel, EmailStr, ConfigDict
from datetime import date
from typing import Optional

class ContactBase(BaseModel):
    email: EmailStr # The primary email for the contact
    first_name: str
    last_name: str
    middle_name: Optional[str] = None
    preferred_name: Optional[str] = None
    personal_email: Optional[EmailStr] = None
    phone_number: Optional[str] = None
    secondary_phone_number: Optional[str] = None
    date_of_birth: Optional[date] = None
    gender: Optional[str] = None
    postal_address: Optional[str] = None
    membership_id: Optional[str] = None
    organizational_unit: Optional[str] = None
    region: Optional[str] = None
    usi_number: Optional[str] = None
    preferred_contact_method: Optional[str] = None
    blue_card_number: Optional[str] = None
    license_number: Optional[str] = None

class ContactCreate(ContactBase):
    pass

class ContactUpdate(ContactBase):
    email: Optional[EmailStr] = None # Make email optional for updates
    first_name: Optional[str] = None # All fields are optional for updates
    last_name: Optional[str] = None

class Contact(ContactBase):
    id: int
    user_id: Optional[int] = None

    model_config = ConfigDict(from_attributes=True)
