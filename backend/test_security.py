from app.services.auth.security_service import (
    hash_password,
    verify_password,
)

password = "admin123"

hashed = hash_password(password)

print("Original Password:", password)
print("Hashed Password:", hashed)

print("Correct Password:", verify_password("admin123", hashed))
print("Wrong Password:", verify_password("wrongpassword", hashed))