from sqlalchemy import Column, Integer, String, ForeignKey, Table, Boolean
from sqlalchemy.orm import relationship, Mapped
from app.db.base import Base

# Association Table for User and Role
user_roles = Table(
    "user_roles",
    Base.metadata,
    Column("user_id", ForeignKey("users.id"), primary_key=True),
    Column("role_id", ForeignKey("roles.id"), primary_key=True),
)

class Role(Base):
    __tablename__ = "roles"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    description = Column(String)
    users = relationship("User", secondary=user_roles, back_populates="roles")

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    # Active flag retained for account enable/disable; admin flag removed in favor of role-based access
    is_active = Column(Boolean, default=True)

    contact = relationship("Contact", back_populates="user", uselist=False)
    tasks = relationship("Task", back_populates="owner")
    roles = relationship("Role", secondary=user_roles, back_populates="users")
    assets = relationship("Asset", back_populates="assignee")