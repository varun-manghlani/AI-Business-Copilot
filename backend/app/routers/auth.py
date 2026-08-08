from datetime import datetime, timedelta
import hashlib
import secrets

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database.database import get_db

from app.schemas.auth import (
    RegisterRequest,
    LoginRequest,
)

from app.schemas.password_reset import (
    ForgotPasswordRequest,
    ResetPasswordRequest,
)

from app.services.auth.auth_service import (
    register_user,
    login_user,
)

from app.services.auth.auth_dependency import get_current_user
from app.services.auth.security_service import hash_password

from models.User import User
from models.PasswordResetToken import PasswordResetToken


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


# ============================================================
# REGISTER
# ============================================================

@router.post("/register")
def register(
    request: RegisterRequest,
    db: Session = Depends(get_db),
):
    try:
        user = register_user(
            db=db,
            name=request.name,
            email=request.email,
            password=request.password,
            role=request.role,
        )

        return {
            "message": "User registered successfully.",
            "user": {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "role": user.role,
            },
        }

    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )


# ============================================================
# LOGIN
# ============================================================

@router.post("/login")
def login(
    request: LoginRequest,
    db: Session = Depends(get_db),
):
    try:
        return login_user(
            db=db,
            email=request.email,
            password=request.password,
        )

    except Exception as e:
        raise HTTPException(
            status_code=401,
            detail=str(e),
        )


# ============================================================
# CURRENT USER
# ============================================================

@router.get("/me")
def get_me(
    current_user: User = Depends(get_current_user),
):
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "role": current_user.role,
    }


# ============================================================
# FORGOT PASSWORD
# ============================================================

@router.post("/forgot-password")
def forgot_password(
    request: ForgotPasswordRequest,
    db: Session = Depends(get_db),
):
    user = (
        db.query(User)
        .filter(User.email == request.email)
        .first()
    )

    # Do not reveal whether an email exists.
    if not user:
        return {
            "message": (
                "If an account exists for this email, "
                "a password reset link will be sent."
            )
        }

    # Remove previous unused tokens for this user.
    existing_tokens = (
        db.query(PasswordResetToken)
        .filter(
            PasswordResetToken.user_id == user.id,
            PasswordResetToken.used_at.is_(None),
        )
        .all()
    )

    for old_token in existing_tokens:
        old_token.used_at = datetime.utcnow()

    # Generate a cryptographically secure token.
    raw_token = secrets.token_urlsafe(48)

    # Store only the hash of the token.
    token_hash = hashlib.sha256(
        raw_token.encode("utf-8")
    ).hexdigest()

    reset_token = PasswordResetToken(
        user_id=user.id,
        token_hash=token_hash,
        expires_at=datetime.utcnow() + timedelta(minutes=30),
    )

    db.add(reset_token)
    db.commit()

    # --------------------------------------------------------
    # DEVELOPMENT ONLY
    # --------------------------------------------------------
    #
    # We are not connecting an email provider yet.
    # This lets us test the complete reset flow locally.
    #
    # Later we will send this through your email service.
    #
    print("\n========================================")
    print("PASSWORD RESET TOKEN")
    print("========================================")
    print(raw_token)
    print("========================================\n")

    return {
        "message": (
            "If an account exists for this email, "
            "a password reset link will be sent."
        ),

        # Development only.
        # Remove this before production.
        "development_token": raw_token,
    }


# ============================================================
# RESET PASSWORD
# ============================================================

@router.post("/reset-password")
def reset_password(
    request: ResetPasswordRequest,
    db: Session = Depends(get_db),
):
    token_hash = hashlib.sha256(
        request.token.encode("utf-8")
    ).hexdigest()

    reset_token = (
        db.query(PasswordResetToken)
        .filter(
            PasswordResetToken.token_hash == token_hash,
            PasswordResetToken.used_at.is_(None),
        )
        .first()
    )

    if not reset_token:
        raise HTTPException(
            status_code=400,
            detail="Invalid or expired reset token.",
        )

    if reset_token.expires_at < datetime.utcnow():
        raise HTTPException(
            status_code=400,
            detail="Invalid or expired reset token.",
        )

    user = (
        db.query(User)
        .filter(User.id == reset_token.user_id)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=400,
            detail="Invalid or expired reset token.",
        )

    # Hash the new password using the SAME hashing
    # mechanism already used during registration.
    user.password_hash = hash_password(
        request.new_password
    )

    # Make token one-time-use.
    reset_token.used_at = datetime.utcnow()

    db.commit()

    return {
        "message": "Password reset successfully."
    }