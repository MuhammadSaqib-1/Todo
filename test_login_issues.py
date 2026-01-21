#!/usr/bin/env python3
"""
Test script to reproduce the login issue with wrong passwords
"""

import requests
import json

BASE_URL = "http://localhost:8000/api"

def test_wrong_password_login():
    """Test login with wrong password"""
    print("Testing login with wrong password...")

    login_data = {
        "username": "testuser_e2f17014@example.com",  # Using the user we created earlier
        "password": "wrongpassword123"  # Wrong password
    }

    try:
        response = requests.post(f"{BASE_URL}/login", data=login_data)
        print(f"Login response status: {response.status_code}")
        print(f"Login response text: {response.text}")

        # Check if it's a valid JSON response
        try:
            json_response = response.json()
            print(f"JSON response: {json.dumps(json_response, indent=2)}")
        except:
            print("Response is not valid JSON")

    except Exception as e:
        print(f"Login request error: {str(e)}")

def test_correct_password_login():
    """Test login with correct password"""
    print("\nTesting login with correct password...")

    login_data = {
        "username": "testuser_e2f17014@example.com",  # Using the user we created earlier
        "password": "testpassword123"  # Correct password
    }

    try:
        response = requests.post(f"{BASE_URL}/login", data=login_data)
        print(f"Login response status: {response.status_code}")
        print(f"Login response text: {response.text}")

        # Check if it's a valid JSON response
        try:
            json_response = response.json()
            print(f"JSON response: {json.dumps(json_response, indent=2)}")
        except:
            print("Response is not valid JSON")

    except Exception as e:
        print(f"Login request error: {str(e)}")

def test_server_health():
    """Test if server is healthy"""
    print("Testing server health...")

    try:
        response = requests.get(f"{BASE_URL}/../health")
        print(f"Health check: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"Health check error: {str(e)}")

if __name__ == "__main__":
    print("Testing Login Issues")
    print("=" * 50)

    test_server_health()
    test_wrong_password_login()
    test_correct_password_login()