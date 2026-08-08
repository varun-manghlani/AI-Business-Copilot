from database.database import Base, engine

# Import all models
from models.User import User
from models.conversation import Conversation
from models.message import Message
from models.CompanyDocument import CompanyDocument
from models.CompanySettings import CompanySettings
from models.AIUsage import AIUsage
from models.PasswordResetToken import PasswordResetToken

Base.metadata.create_all(bind=engine)

print("✅ Database created successfully!")