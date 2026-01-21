from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlmodel import Session, select
from datetime import timedelta
from typing import Annotated
from database.session import get_session
from models.user import User, UserCreate
from schemas.user import UserResponse, UserCreate as UserCreateSchema, Token
from core.security import verify_password, get_password_hash, create_access_token
from core.config import settings

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


def get_user_by_email(session: Session, email: str):
    """Get a user by email."""
    statement = select(User).where(User.email == email)
    result = session.execute(statement).scalars().first()
    return result


def get_user_by_username(session: Session, username: str):
    """Get a user by username."""
    statement = select(User).where(User.username == username)
    result = session.execute(statement).scalars().first()
    return result


def authenticate_user(session: Session, email: str, password: str):
    """Authenticate a user by email and password."""
    user = get_user_by_email(session, email)
    if not user or not verify_password(password, user.hashed_password):
        return False
    return user


@router.post("/signup", response_model=UserResponse)
def signup(user_create: UserCreateSchema, session: Session = Depends(get_session)):
    """Register a new user."""
    # Check if user with email already exists
    existing_user_by_email = get_user_by_email(session, user_create.email)
    if existing_user_by_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Check if user with username already exists
    existing_user_by_username = get_user_by_username(session, user_create.username)
    if existing_user_by_username:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken"
        )

    # Hash the password
    hashed_password = get_password_hash(user_create.password)

    # Create the user
    db_user = User(
        email=user_create.email,
        username=user_create.username,
        hashed_password=hashed_password
    )

    session.add(db_user)
    session.commit()
    session.refresh(db_user)

    return db_user


@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), session: Session = Depends(get_session)):
    """Authenticate user and return access token."""
    user = authenticate_user(
        session=session, email=form_data.username, password=form_data.password
    )
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Create access token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )

    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/forgot-password")
def forgot_password(email: str):
    """Initiate password reset process."""
    # In a real application, you would send an email with a reset token
    # For now, we'll just return a success message
    return {"message": "If an account with that email exists, a password reset link has been sent."}


@router.post("/reset-password")
def reset_password(token: str, new_password: str):
    """Reset user password with token."""
    # In a real application, you would validate the reset token
    # and update the user's password
    # For now, we'll just return a success message
    return {"message": "Password has been reset successfully."}


@router.get("/users/me", response_model=UserResponse)
def read_users_me(token: str = Depends(oauth2_scheme), session: Session = Depends(get_session)):
    """Get current user information."""
    from jose import jwt
    from jose.exceptions import JWTError
    from core.config import settings

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = get_user_by_email(session, email=email)
    if user is None:
        raise credentials_exception

    return user


@router.post("/users/change-password")
def change_password(
    password_data: dict,
    token: str = Depends(oauth2_scheme),
    session: Session = Depends(get_session)
):
    """Change user password."""
    from jose import jwt
    from jose.exceptions import JWTError
    from core.config import settings
    from core.security import verify_password, get_password_hash

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = get_user_by_email(session, email=email)
    if user is None:
        raise credentials_exception

    # Verify current password
    current_password = password_data.get("current_password")
    new_password = password_data.get("new_password")

    if not verify_password(current_password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect"
        )

    # Hash and update new password
    hashed_new_password = get_password_hash(new_password)
    user.hashed_password = hashed_new_password
    session.add(user)
    session.commit()

    return {"message": "Password changed successfully"}