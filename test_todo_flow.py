#!/usr/bin/env python3
"""
Test script to verify the complete todo functionality flow:
1. Create account
2. Login
3. Create todo
4. Update todo
5. Mark todo as complete
6. Delete todo
"""

import requests
import json
import time
import uuid

BASE_URL = "http://localhost:8000/api"

def test_todo_flow():
    print("Testing Complete Todo Flow")
    print("=" * 50)

    # Generate unique test user
    unique_id = str(uuid.uuid4()).split('-')[0]
    test_email = f"testuser_{unique_id}@example.com"
    test_username = f"testuser_{unique_id}"
    test_password = "testpassword123"

    print(f"Using test user: {test_email}")

    # Step 1: Signup
    print("\n1. Testing Signup...")
    signup_data = {
        "email": test_email,
        "username": test_username,
        "password": test_password
    }

    try:
        response = requests.post(f"{BASE_URL}/signup", json=signup_data)
        print(f"Signup response: {response.status_code}")
        if response.status_code == 200:
            print("[PASS] Signup successful")
            user_data = response.json()
            print(f"Created user: {user_data['username']}")
        else:
            print(f"[FAIL] Signup failed: {response.text}")
            # If user already exists, try logging in
            if "already registered" in response.text:
                print("User already exists, continuing with login...")
            else:
                return False
    except Exception as e:
        print(f"[FAIL] Signup error: {str(e)}")
        return False

    # Step 2: Login
    print("\n2. Testing Login...")
    login_data = {
        "username": test_email,  # Using email as username
        "password": test_password
    }

    try:
        # Using form data for OAuth2PasswordRequestForm
        response = requests.post(f"{BASE_URL}/login", data=login_data)
        print(f"Login response: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            access_token = result.get('access_token')
            print("[PASS] Login successful")
            print(f"Access token received: {bool(access_token)}")
        else:
            print(f"[FAIL] Login failed: {response.text}")
            return False
    except Exception as e:
        print(f"[FAIL] Login error: {str(e)}")
        return False

    if not access_token:
        print("[FAIL] No access token received")
        return False

    # Set up headers with the token
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }

    # Step 3: Get user profile to get user ID
    print("\n3. Getting user profile...")
    try:
        response = requests.get(f"{BASE_URL}/users/me", headers=headers)
        print(f"Get user profile response: {response.status_code}")
        if response.status_code == 200:
            user_data = response.json()
            user_id = user_data.get('id')
            print(f"[PASS] User profile retrieved successfully")
            print(f"User ID: {user_id}")
            print(f"Username: {user_data.get('username')}")
        else:
            print(f"[FAIL] Get user profile failed: {response.text}")
            return False
    except Exception as e:
        print(f"[FAIL] Get user profile error: {str(e)}")
        return False

    # Step 4: Create a todo
    print("\n4. Testing Create Todo...")
    todo_data = {
        "title": "Test Todo",
        "description": "This is a test todo created for verification"
    }

    try:
        response = requests.post(f"{BASE_URL}/{user_id}/tasks", json=todo_data, headers=headers)
        print(f"Create todo response: {response.status_code}")
        if response.status_code == 200:
            todo = response.json()
            todo_id = todo.get('id')
            print("[PASS] Todo created successfully")
            print(f"Todo ID: {todo_id}")
            print(f"Title: {todo.get('title')}")
            print(f"Description: {todo.get('description')}")
        else:
            print(f"[FAIL] Create todo failed: {response.text}")
            return False
    except Exception as e:
        print(f"[FAIL] Create todo error: {str(e)}")
        return False

    # Step 5: Get all todos
    print("\n5. Testing Get Todos...")
    try:
        response = requests.get(f"{BASE_URL}/{user_id}/tasks", headers=headers)
        print(f"Get todos response: {response.status_code}")
        if response.status_code == 200:
            todos = response.json()
            print(f"[PASS] Retrieved {len(todos)} todos")
            if len(todos) > 0:
                print(f"First todo: {todos[0]['title']}")
        else:
            print(f"[FAIL] Get todos failed: {response.text}")
            return False
    except Exception as e:
        print(f"[FAIL] Get todos error: {str(e)}")
        return False

    # Step 6: Update the todo
    print("\n6. Testing Update Todo...")
    update_data = {
        "title": "Updated Test Todo",
        "description": "This is an updated test todo"
    }

    try:
        response = requests.put(f"{BASE_URL}/{user_id}/tasks/{todo_id}", json=update_data, headers=headers)
        print(f"Update todo response: {response.status_code}")
        if response.status_code == 200:
            updated_todo = response.json()
            print("[PASS] Todo updated successfully")
            print(f"Updated title: {updated_todo.get('title')}")
            print(f"Updated description: {updated_todo.get('description')}")
        else:
            print(f"[FAIL] Update todo failed: {response.text}")
            return False
    except Exception as e:
        print(f"[FAIL] Update todo error: {str(e)}")
        return False

    # Step 7: Mark todo as complete
    print("\n7. Testing Mark Todo as Complete...")
    try:
        response = requests.patch(f"{BASE_URL}/{user_id}/tasks/{todo_id}/complete",
                                params={"is_completed": True}, headers=headers)
        print(f"Mark complete response: {response.status_code}")
        if response.status_code == 200:
            print("[PASS] Todo marked as complete successfully")
        else:
            print(f"[FAIL] Mark complete failed: {response.text}")
            return False
    except Exception as e:
        print(f"[FAIL] Mark complete error: {str(e)}")
        return False

    # Step 8: Get the updated todo to verify completion
    print("\n8. Verifying todo completion...")
    try:
        response = requests.get(f"{BASE_URL}/{user_id}/tasks/{todo_id}", headers=headers)
        print(f"Get todo response: {response.status_code}")
        if response.status_code == 200:
            todo = response.json()
            is_completed = todo.get('is_completed', False)
            print(f"[PASS] Todo completion status: {is_completed}")
            if is_completed:
                print("[PASS] Todo is correctly marked as complete")
            else:
                print("[FAIL] Todo is not marked as complete")
                return False
        else:
            print(f"[FAIL] Get todo failed: {response.text}")
            return False
    except Exception as e:
        print(f"[FAIL] Verify completion error: {str(e)}")
        return False

    # Step 9: Delete the todo
    print("\n9. Testing Delete Todo...")
    try:
        response = requests.delete(f"{BASE_URL}/{user_id}/tasks/{todo_id}", headers=headers)
        print(f"Delete todo response: {response.status_code}")
        if response.status_code == 200:
            print("[PASS] Todo deleted successfully")
        else:
            print(f"[FAIL] Delete todo failed: {response.text}")
            return False
    except Exception as e:
        print(f"[FAIL] Delete todo error: {str(e)}")
        return False

    # Step 10: Verify todo is deleted
    print("\n10. Verifying todo deletion...")
    try:
        response = requests.get(f"{BASE_URL}/{user_id}/tasks/{todo_id}", headers=headers)
        print(f"Get deleted todo response: {response.status_code}")
        if response.status_code == 404:
            print("[PASS] Todo correctly deleted (404 not found)")
        else:
            print(f"[FAIL] Todo was not deleted properly: {response.status_code}")
            return False
    except Exception as e:
        print(f"[FAIL] Verify deletion error: {str(e)}")
        return False

    print("\n" + "=" * 50)
    print("TODO FLOW TEST RESULTS:")
    print("[PASS] Signup: PASS")
    print("[PASS] Login: PASS")
    print("[PASS] Create Todo: PASS")
    print("[PASS] Get Todos: PASS")
    print("[PASS] Update Todo: PASS")
    print("[PASS] Mark Complete: PASS")
    print("[PASS] Verify Completion: PASS")
    print("[PASS] Delete Todo: PASS")
    print("[PASS] Verify Deletion: PASS")
    print("\n[SUCCESS] All todo functionality is working correctly!")
    return True

if __name__ == "__main__":
    success = test_todo_flow()
    if success:
        print("\n[SUCCESS] Complete todo flow test PASSED!")
    else:
        print("\n[FAILURE] Complete todo flow test FAILED!")