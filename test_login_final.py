#!/usr/bin/env python3
"""
Final test to verify login functionality works correctly
"""

import requests
import json
import uuid

BASE_URL = "http://localhost:8000/api"

def test_login_functionality():
    print("Final Login Functionality Test")
    print("=" * 40)

    # Create a new test user
    unique_id = str(uuid.uuid4()).split('-')[0]
    test_email = f"final_test_{unique_id}@example.com"
    test_username = f"final_test_{unique_id}"
    test_password = "testpassword123"

    print(f"Creating test user: {test_email}")

    # Signup
    signup_data = {
        "email": test_email,
        "username": test_username,
        "password": test_password
    }

    try:
        response = requests.post(f"{BASE_URL}/signup", json=signup_data)
        print(f"Signup: {response.status_code} - {response.text if response.status_code != 200 else '[SUCCESS]'}")

        if response.status_code != 200:
            # If user already exists, continue anyway
            if "already registered" in response.text.lower():
                print("User already exists, continuing with login test...")
            else:
                print(f"Signup failed: {response.text}")
    except Exception as e:
        print(f"Signup error: {e}")

    # Test correct login
    print(f"\nTesting correct login for: {test_email}")
    login_data = {
        "username": test_email,
        "password": test_password
    }

    try:
        response = requests.post(f"{BASE_URL}/login", data=login_data)
        print(f"Correct login response: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print(f"[PASS] Login successful - Access token received: {bool(result.get('access_token'))}")
        else:
            print(f"[FAIL] Login failed: {response.text}")
    except Exception as e:
        print(f"[FAIL] Login error: {e}")

    # Test wrong password
    print(f"\nTesting wrong password for: {test_email}")
    wrong_login_data = {
        "username": test_email,
        "password": "wrongpassword123"
    }

    try:
        response = requests.post(f"{BASE_URL}/login", data=wrong_login_data)
        print(f"Wrong password response: {response.status_code}")
        if response.status_code == 401:
            result = response.json()
            error_detail = result.get('detail', '')
            print(f"[PASS] Correct error message: '{error_detail}'")

            # Check if it contains the expected message
            if "incorrect" in error_detail.lower() or "email or password" in error_detail.lower():
                print("[PASS] Error message is specific and helpful")
            else:
                print(f"[FAIL] Unexpected error message: {error_detail}")
        else:
            print(f"[FAIL] Expected 401, got {response.status_code}: {response.text}")
    except Exception as e:
        print(f"[FAIL] Wrong password test error: {e}")

    # Test non-existent user
    print(f"\nTesting login with non-existent user")
    fake_login_data = {
        "username": "nonexistent@example.com",
        "password": "any_password"
    }

    try:
        response = requests.post(f"{BASE_URL}/login", data=fake_login_data)
        print(f"Non-existent user response: {response.status_code}")
        if response.status_code == 401:
            result = response.json()
            error_detail = result.get('detail', '')
            print(f"[PASS] Correct error message: '{error_detail}'")

            if "incorrect" in error_detail.lower() or "email or password" in error_detail.lower():
                print("[PASS] Error message is specific (doesn't reveal if user exists)")
            else:
                print(f"[FAIL] Unexpected error message: {error_detail}")
        else:
            print(f"[FAIL] Expected 401, got {response.status_code}: {response.text}")
    except Exception as e:
        print(f"[FAIL] Non-existent user test error: {e}")

    print("\n" + "=" * 40)
    print("Login functionality test completed!")

if __name__ == "__main__":
    test_login_functionality()