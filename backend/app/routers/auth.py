from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database.database import get_db

from app.schemas.auth import RegisterRequest
from app.schemas.auth import (
    RegisterRequest,
    LoginRequest,
)
from app.services.auth.auth_service import (
    register_user,
    login_user,
)

from app.services.auth.auth_dependency import get_current_user
from models.User import User

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


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