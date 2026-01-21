#!/usr/bin/env python3
"""
Test script to verify the fixes for authentication and task management issues.
This script tests the reported issues to make sure they are fixed.
"""

import os
import sys
import subprocess
import time
import requests
import threading
from pathlib import Path

def start_backend():
    """Start the backend server in a separate thread"""
    def run_server():
        try:
            # Change to backend directory and start the server
            backend_dir = Path(__file__).parent / "backend"
            os.chdir(backend_dir)

            # Run the backend server
            subprocess.run([
                sys.executable, "-m", "uvicorn",
                "main:app",
                "--host", "127.0.0.1",
                "--port", "8000",
                "--reload"
            ], check=False)
        except Exception as e:
            print(f"Error starting backend: {e}")

    server_thread = threading.Thread(target=run_server, daemon=True)
    server_thread.start()
    time.sleep(3)  # Give the server time to start
    return server_thread

def test_duplicate_signup():
    """Test that duplicate signup is properly prevented"""
    print("Testing duplicate signup prevention...")

    # Clear any existing test users
    try:
        requests.delete("http://127.0.0.1:8000/api/test/cleanup")
    except:
        pass  # Ignore cleanup errors

    # Register a user
    signup_data = {
        "email": "test@example.com",
        "username": "testuser",
        "password": "testpassword123"
    }

    response1 = requests.post("http://127.0.0.1:8000/api/signup", json=signup_data)
    print(f"First signup response: {response1.status_code}")

    if response1.status_code != 200:
        print("ERROR: First signup failed unexpectedly")
        return False

    # Try to register the same user again (should fail)
    response2 = requests.post("http://127.0.0.1:8000/api/signup", json=signup_data)
    print(f"Second signup response: {response2.status_code}")

    if response2.status_code != 400:
        print("ERROR: Duplicate signup was allowed!")
        return False

    print("✓ Duplicate signup properly prevented")
    return True

def test_login_error_messages():
    """Test that incorrect login shows proper error messages"""
    print("\nTesting login error messages...")

    # Register a test user first
    signup_data = {
        "email": "login_test@example.com",
        "username": "logintest",
        "password": "password123"
    }

    requests.post("http://127.0.0.1:8000/api/signup", json=signup_data)

    # Try to login with wrong password
    login_data = {
        "username": "login_test@example.com",
        "password": "wrongpassword"
    }

    response = requests.post("http://127.0.0.1:8000/api/login", data=login_data)
    print(f"Incorrect login response: {response.status_code}")

    if response.status_code != 401:
        print("ERROR: Incorrect login should return 401")
        return False

    if "detail" not in response.json():
        print("ERROR: Response should contain error detail")
        return False

    print("✓ Login error messages working properly")
    return True

def test_task_visibility_after_failed_login():
    """Test that tasks remain visible after failed login attempts"""
    print("\nTesting task visibility after failed login attempts...")

    # Register and login a test user
    signup_data = {
        "email": "task_test@example.com",
        "username": "tasktest",
        "password": "password123"
    }

    requests.post("http://127.0.0.1:8000/api/signup", json=signup_data)

    login_data = {
        "username": "task_test@example.com",
        "password": "password123"
    }

    login_response = requests.post("http://127.0.0.1:8000/api/login", data=login_data)
    if login_response.status_code != 200:
        print("ERROR: Login failed")
        return False

    token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Create a test task
    task_data = {
        "title": "Test Task",
        "description": "This is a test task",
        "priority_level": "normal",
        "category": "General"
    }

    # Get user ID first
    user_response = requests.get("http://127.0.0.1:8000/api/users/me", headers=headers)
    user_id = user_response.json()["id"]

    # Create task
    create_task_response = requests.post(f"http://127.0.0.1:8000/api/{user_id}/tasks",
                                       json=task_data, headers=headers)
    if create_task_response.status_code != 200:
        print("ERROR: Failed to create task")
        return False

    task_id = create_task_response.json()["id"]
    print(f"Created task with ID: {task_id}")

    # Try to login with wrong credentials (should fail)
    wrong_login_data = {
        "username": "task_test@example.com",
        "password": "wrongpassword"
    }
    requests.post("http://127.0.0.1:8000/api/login", data=wrong_login_data)

    # Try to login again with correct credentials
    correct_login_response = requests.post("http://127.0.0.1:8000/api/login", data=login_data)
    if correct_login_response.status_code != 200:
        print("ERROR: Correct login failed after failed attempt")
        return False

    new_token = correct_login_response.json()["access_token"]
    new_headers = {"Authorization": f"Bearer {new_token}"}

    # Verify tasks are still accessible
    tasks_response = requests.get(f"http://127.0.0.1:8000/api/{user_id}/tasks", headers=new_headers)
    if tasks_response.status_code != 200:
        print("ERROR: Could not retrieve tasks after re-login")
        return False

    tasks = tasks_response.json()
    task_exists = any(task["id"] == task_id for task in tasks)

    if not task_exists:
        print("ERROR: Task is not visible after re-login")
        return False

    print("✓ Tasks remain visible after failed login attempts")
    return True

def main():
    print("Starting tests for authentication and task management fixes...\n")

    # Start the backend server
    print("Starting backend server...")
    server_thread = start_backend()

    # Wait a bit for server to be ready
    time.sleep(5)

    # Run tests
    results = []
    results.append(test_duplicate_signup())
    results.append(test_login_error_messages())
    results.append(test_task_visibility_after_failed_login())

    # Summary
    passed = sum(results)
    total = len(results)

    print(f"\nTest Results: {passed}/{total} tests passed")

    if passed == total:
        print("✓ All tests passed! The fixes are working correctly.")
        return 0
    else:
        print("✗ Some tests failed. Please check the implementation.")
        return 1

if __name__ == "__main__":
    exit(main())