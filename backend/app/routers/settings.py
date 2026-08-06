from fastapi import APIRouter, Depends

from models.User import User
from app.services.auth.auth_dependency import get_current_user

router = APIRouter(
    prefix="/settings",
    tags=["Settings"],
)


@router.get("/profile")
def get_profile(
    current_user: User = Depends(get_current_user),
):
    return {
        "name": current_user.name,
        "email": current_user.email,
        "role": current_user.role,
    }