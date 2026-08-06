from sqlalchemy.orm import Session

from models.User import User
from app.services.auth.security_service import (
    verify_password,
    hash_password,
)


def get_all_users(db: Session):
    return (
        db.query(User)
        .order_by(User.name)
        .all()
    )

def create_user(db: Session, user_data):
    existing_user = (
        db.query(User)
        .filter(User.email == user_data.email)
        .first()
    )

    if existing_user:
        raise Exception("Email already exists.")

    user = User(
        name=user_data.name,
        email=user_data.email,
        password_hash=hash_password(user_data.password),
        role=user_data.role,
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user

def delete_user(db: Session, user_id: int, current_user: User):
    user = db.query(User).filter(User.id == user_id).first()

    if user is None:
        raise Exception("User not found.")

    # Prevent deleting yourself
    if user.id == current_user.id:
        raise Exception("You cannot delete your own account.")

    # Prevent deleting the last admin
    if user.role == "admin":
        admin_count = (
            db.query(User)
            .filter(User.role == "admin")
            .count()
        )

        if admin_count <= 1:
            raise Exception("Cannot delete the last administrator.")

    db.delete(user)
    db.commit()

    return {"message": "User deleted successfully."}

def change_password(
    db: Session,
    current_user: User,
    password_data,
):
    if not verify_password(
        password_data.current_password,
        current_user.password_hash,
    ):
        raise Exception("Current password is incorrect.")

    current_user.password_hash = hash_password(
        password_data.new_password
    )

    db.commit()

    return {
        "message": "Password changed successfully."
    }