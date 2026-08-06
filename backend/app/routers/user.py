from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database.database import get_db

from app.schemas.user import UserResponse
from app.services.user_service import get_all_users
from app.services.user_service import (
  get_all_users,
  create_user,
  delete_user,
  change_password,
)

from app.schemas.user import (
    CreateUserRequest,
    UserResponse,
)
from fastapi import HTTPException
from app.services.auth.auth_dependency import get_current_admin
from app.services.auth.auth_dependency import (
    get_current_admin,
    get_current_user,
)
from app.schemas.password import ChangePasswordRequest


router = APIRouter(
    prefix="/users",
    tags=["Users"],
)


@router.get(
    "",
    response_model=list[UserResponse],
)
def list_users(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_admin),
):
    return get_all_users(db)

@router.post(
    "",
    response_model=UserResponse,
)
def add_user(
    request: CreateUserRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_admin),
):
    try:
        return create_user(db, request)

    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )

@router.delete("/{user_id}")
def remove_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_admin),
):
    try:
        return delete_user(
            db,
            user_id,
            current_user,
        )

    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        ) 

@router.put("/change-password")
def update_password(
    request: ChangePasswordRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    try:
        return change_password(
            db,
            current_user,
            request,
        )

    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )       