from sqlalchemy.orm import Session

from models.User import User
from app.services.auth.security_service import (
    hash_password,
)

from app.services.auth.security_service import (
    verify_password,
    create_access_token,
)


def register_user(
    db: Session,
    name: str,
    email: str,
    password: str,
    role: str = "employee",
):
    # Check if email already exists
    existing_user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )

    if existing_user:
        raise Exception("Email already registered.")

    user = User(
        name=name,
        email=email,
        password_hash=hash_password(password),
        role=role,
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user

def login_user(
    db: Session,
    email: str,
    password: str,
):
    user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )

    if not user:
        raise Exception("Invalid email or password.")

    if not verify_password(
        password,
        user.password_hash,
    ):
        raise Exception("Invalid email or password.")

    token = create_access_token(
        {
            "user_id": user.id,
            "email": user.email,
            "role": user.role,
        }
    )

    return {
        "access_token": token,
        "token_type": "bearer",
    }

def get_user_profile(user: User):
    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "role": user.role,
    }