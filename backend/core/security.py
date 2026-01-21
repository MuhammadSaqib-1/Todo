from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from core.config import settings

# Password hashing context - using bcrypt with more compatible settings
# We'll handle bcrypt initialization issues in the functions themselves
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_pbkdf2_password(plain_password: str, stored_hash: str) -> bool:
    """Verify a password against a pbkdf2 hash stored in format 'pbkdf2$salt$hash'."""
    try:
        parts = stored_hash.split('$')
        if len(parts) != 3 or parts[0] != 'pbkdf2':
            return False

        salt = parts[1]
        stored_pwdhash = parts[2]

        import hashlib
        pwdhash = hashlib.pbkdf2_hmac('sha256', plain_password.encode('utf-8'), salt.encode('utf-8'), 100000)
        pwdhash_hex = pwdhash.hex()

        return pwdhash_hex == stored_pwdhash
    except Exception:
        return False


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain password against a hashed password, supporting both bcrypt and pbkdf2."""
    # If it looks like a pbkdf2 hash, verify it as such
    if hashed_password.startswith('pbkdf2$'):
        return verify_pbkdf2_password(plain_password, hashed_password)

    # Otherwise, try bcrypt
    try:
        return pwd_context.verify(plain_password, hashed_password)
    except Exception:
        return False


def get_password_hash(password: str) -> str:
    """Hash a plain password using bcrypt with fallback to pbkdf2."""
    # Ensure password is not longer than 72 bytes for bcrypt compatibility
    password_bytes = password.encode('utf-8')
    if len(password_bytes) > 72:
        # Truncate to 72 bytes if needed
        password = password_bytes[:72].decode('utf-8', errors='ignore')

    # Try bcrypt first
    try:
        # Initialize bcrypt context with proper backend handling
        return pwd_context.hash(password)
    except Exception:
        # Fallback to pbkdf2
        import hashlib
        import secrets
        salt = secrets.token_hex(16)  # 16 bytes = 32 hex chars
        pwdhash = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt.encode('utf-8'), 100000)
        pwdhash_hex = pwdhash.hex()
        # Store salt with hash, separated by $ (common format)
        return f"pbkdf2${salt}${pwdhash_hex}"


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create a JWT access token."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)

    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt


def verify_token(token: str, credentials_exception):
    """Verify a JWT token."""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        return username
    except JWTError:
        raise credentials_exception