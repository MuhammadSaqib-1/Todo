#!/usr/bin/env python3
"""
Debug script to check what's causing the server error
"""

import requests
import traceback

BASE_URL = "http://localhost:8000/api"

def test_signup_debug():
    """Debug signup to see exact error"""
    print("Debugging signup...")

    signup_data = {
        "email": "test@example.com",
        "username": "testuser",
        "password": "testpassword123"
    }

    try:
        response = requests.post(f"{BASE_URL}/signup", json=signup_data)
        print(f"Response Status Code: {response.status_code}")
        print(f"Response Headers: {dict(response.headers)}")
        print(f"Response Text: {response.text[:500]}...")  # First 500 chars

        if response.status_code >= 400:
            print("Full Response Text:")
            print(response.text)
    except Exception as e:
        print(f"Request Error: {str(e)}")
        traceback.print_exc()

if __name__ == "__main__":
    test_signup_debug()