import requests
import json

# Test if the backend API is running
try:
    response = requests.get("http://localhost:8000/")
    print("Backend is running!")
    print("Response:", response.json())
except Exception as e:
    print(f"Backend is not accessible: {e}")

# Test health endpoint
try:
    response = requests.get("http://localhost:8000/health")
    print("Health check:", response.json())
except Exception as e:
    print(f"Health check failed: {e}")