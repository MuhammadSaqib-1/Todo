from setuptools import setup, find_packages

setup(
    name="todo-backend",
    version="0.1.0",
    packages=find_packages(),
    install_requires=[
        "fastapi==0.115.0",
        "uvicorn[standard]==0.34.0",
        "sqlmodel==0.0.22",
        "pydantic==2.12.5",
        "pydantic-core==2.41.5",
        "pydantic-settings==2.7.0",
        "passlib[bcrypt]==1.7.4",
        "python-jose[cryptography]==3.3.0",
        "python-multipart==0.0.20",
        "sqlalchemy==2.0.35",
        "alembic==1.14.1",
        "asyncpg==0.31.0",
        "python-dotenv==1.0.1",
    ],
    package_data={'': ['*.py', '*.txt', '*.md']},
    include_package_data=True,
)