# app/models/identity.py
# todo: build this out. an identity can be a user or a credential
# from sqlalchemy import Column, ForeignKey, Integer, String, Table
# from sqlalchemy.orm import relationship

# from app.db.base_class import Base

# identity_organization = Table(
#     "identity_organization",
#     Base.metadata,
#     Column("identity_id", Integer, ForeignKey("identities.id")),
#     Column("organization_id", Integer, ForeignKey("organizations.id")),
# )


# class Identity(Base):
#     __tablename__ = "identities"
#     id = Column(Integer, primary_key=True, index=True)
#     email = Column(String, unique=True, index=True)
#     google_id = Column(String, unique=True, index=True)
#     organization_id = Column(Integer, ForeignKey("organizations.id"))
#     organizations = relationship(
#         "Organization", secondary=identity_organization, back_populates="identities"
#     )
#     api_tokens = relationship("APIToken", back_populates="identity")
