#!/usr/bin/env python3
"""
Test to simulate the exact error condition that might be causing the issue
"""

import requests

BASE_URL = "http://localhost:8000/api"

def test_login_errors():
    print("Testing various login error scenarios...")

    # Test with wrong password
    print("\n1. Testing login with wrong password:")
    login_data = {
        "username": "admin@example.com",  # Assuming this user exists
        "password": "wrongpassword"
    }

    try:
        response = requests.post(f"{BASE_URL}/login", data=login_data)
        print(f"Response Status: {response.status_code}")
        print(f"Response Body: {response.text}")

        if response.status_code == 401:
            try:
                json_resp = response.json()
                print(f"JSON Response: {json_resp}")

                # Check the structure to make sure our frontend can parse it
                if 'detail' in json_resp:
                    print(f"✓ Contains 'detail' field: '{json_resp['detail']}'")
                else:
                    print("⚠ Does not contain 'detail' field")

            except ValueError:
                print("⚠ Response is not JSON")
    except Exception as e:
        print(f"Error: {e}")

    # Test with non-existent user
    print("\n2. Testing login with non-existent user:")
    login_data = {
        "username": "nonexistent@example.com",
        "password": "any_password"
    }

    try:
        response = requests.post(f"{BASE_URL}/login", data=login_data)
        print(f"Response Status: {response.status_code}")
        print(f"Response Body: {response.text}")

        if response.status_code == 401:
            try:
                json_resp = response.json()
                print(f"JSON Response: {json_resp}")

                # Check the structure to make sure our frontend can parse it
                if 'detail' in json_resp:
                    print(f"✓ Contains 'detail' field: '{json_resp['detail']}'")
                else:
                    print("⚠ Does not contain 'detail' field")

            except ValueError:
                print("⚠ Response is not JSON")
    except Exception as e:
        print(f"Error: {e}")

    # Test with empty credentials
    print("\n3. Testing login with empty credentials:")
    login_data = {
        "username": "",
        "password": ""
    }

    try:
        response = requests.post(f"{BASE_URL}/login", data=login_data)
        print(f"Response Status: {response.status_code}")
        print(f"Response Body: {response.text}")
    except Exception as e:
        print(f"Error: {e}")

    print("\nTesting completed.")

if __name__ == "__main__":
    test_login_errors()