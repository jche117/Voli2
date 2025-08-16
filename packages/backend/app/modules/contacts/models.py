from sqlalchemy import Column, Integer, String, Date, ForeignKey, Text
from sqlalchemy.orm import relationship

from app.db.base import Base


class Contact(Base):
    __tablename__ = "contacts"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String, index=True, nullable=False)
    middle_name = Column(String, nullable=True)
    last_name = Column(String, index=True, nullable=False)
    preferred_name = Column(String, nullable=True)
    email = Column(String, unique=True, index=True, nullable=False)
    personal_email = Column(String, unique=True, index=True, nullable=True)
    phone_number = Column(String, nullable=True)
    secondary_phone_number = Column(String, nullable=True)
    address = Column(String, nullable=True)
    postal_address = Column(String, nullable=True)
    city = Column(String, nullable=True)
    state = Column(String, nullable=True)
    zip_code = Column(String, nullable=True)
    country = Column(String, nullable=True)
    gender = Column(String, nullable=True)
    date_of_birth = Column(Date, nullable=True)
    membership_id = Column(String, nullable=True)
    organizational_unit = Column(String, nullable=True)
    region = Column(String, nullable=True)
    usi_number = Column(String, nullable=True)
    preferred_contact_method = Column(String, nullable=True)
    blue_card_number = Column(String, nullable=True)
    license_number = Column(String, nullable=True)
    notes = Column(Text, nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)

    user = relationship("User", back_populates="contact")
