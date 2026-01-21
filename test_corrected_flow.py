#!/usr/bin/env python3
"""
Test to verify the corrected login flow that ensures user ID is properly stored
"""

import requests
import json
import uuid

BASE_URL = "http://localhost:8000/api"

def test_corrected_login_flow():
    print("Testing Corrected Login Flow")
    print("=" * 40)

    # Create a new test user
    unique_id = str(uuid.uuid4()).split('-')[0]
    test_email = f"flow_test_{unique_id}@example.com"
    test_username = f"flow_test_{unique_id}"
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
        print(f"Signup: {response.status_code}")

        if response.status_code != 200:
            # If user already exists, continue anyway
            if "already registered" in response.text.lower():
                print("User already exists, continuing with login test...")
            else:
                print(f"Signup failed: {response.text}")
                return False
    except Exception as e:
        print(f"Signup error: {e}")
        return False

    # Test login and get user profile in one sequence (simulating frontend behavior)
    print(f"\nTesting login and user profile retrieval for: {test_email}")

    # Step 1: Login
    login_data = {
        "username": test_email,
        "password": test_password
    }

    try:
        response = requests.post(f"{BASE_URL}/login", data=login_data)
        print(f"Login response: {response.status_code}")

        if response.status_code == 200:
            login_result = response.json()
            access_token = login_result.get('access_token')

            if access_token:
                print("[PASS] Login successful - Access token received")

                # Step 2: Get user profile using the token (simulating what frontend does)
                headers = {
                    "Authorization": f"Bearer {access_token}",
                    "Content-Type": "application/json"
                }

                profile_response = requests.get(f"{BASE_URL}/users/me", headers=headers)
                print(f"Get user profile response: {profile_response.status_code}")

                if profile_response.status_code == 200:
                    user_data = profile_response.json()
                    user_id = user_data.get('id')

                    if user_id:
                        print(f"[PASS] User profile retrieved successfully")
                        print(f"User ID: {user_id}")
                        print(f"Username: {user_data.get('username')}")

                        # Step 3: Test that we can use this user ID for todo operations
                        todos_response = requests.get(f"{BASE_URL}/{user_id}/tasks", headers=headers)
                        print(f"Get todos response: {todos_response.status_code}")

                        if todos_response.status_code == 200:
                            print("[PASS] Can access user's todos using retrieved user ID")
                            print(f"Number of todos: {len(todos_response.json())}")

                            # Try to create a test todo
                            todo_data = {
                                "title": "Test todo from flow verification",
                                "description": "This verifies the login flow works correctly"
                            }

                            create_response = requests.post(f"{BASE_URL}/{user_id}/tasks",
                                                          json=todo_data, headers=headers)
                            print(f"Create todo response: {create_response.status_code}")

                            if create_response.status_code == 200:
                                created_todo = create_response.json()
                                print(f"[PASS] Todo created successfully: {created_todo.get('title')}")

                                # Clean up: delete the test todo
                                delete_response = requests.delete(f"{BASE_URL}/{user_id}/tasks/{created_todo['id']}",
                                                               headers=headers)
                                print(f"Cleanup response: {delete_response.status_code}")

                                if delete_response.status_code == 200:
                                    print("[PASS] Test todo cleaned up successfully")
                                    return True
                                else:
                                    print(f"[WARNING] Cleanup failed: {delete_response.text}")
                                    return True  # Still consider it a success since main flow worked
                            else:
                                print(f"[FAIL] Failed to create todo: {create_response.text}")
                                return False
                        else:
                            print(f"[FAIL] Cannot access user's todos: {todos_response.text}")
                            return False
                    else:
                        print("[FAIL] No user ID in profile data")
                        return False
                else:
                    print(f"[FAIL] Failed to get user profile: {profile_response.text}")
                    return False
            else:
                print("[FAIL] No access token in login response")
                return False
        else:
            print(f"[FAIL] Login failed: {response.text}")
            return False
    except Exception as e:
        print(f"[FAIL] Error in login flow test: {e}")
        return False

    print("\n" + "=" * 40)
    print("Corrected login flow test completed!")

if __name__ == "__main__":
    success = test_corrected_login_flow()
    if success:
        print("\n[SUCCESS] Corrected login flow test PASSED!")
        print("The login should now work properly in the browser.")
    else:
        print("\n[FAILURE] Corrected login flow test FAILED!")