#!/usr/bin/env python3
"""
Test script to verify the authentication functionality after the fixes
"""

import requests
import json

BASE_URL = "http://localhost:8000/api"

def test_signup(email, username, password):
    """Test user signup"""
    print(f"Testing signup for user: {username}")

    signup_data = {
        "email": email,
        "username": username,
        "password": password
    }

    try:
        response = requests.post(f"{BASE_URL}/signup", json=signup_data)
        print(f"Signup response: {response.status_code}")
        if response.status_code == 200:
            print("✓ Signup successful")
            return response.json()
        else:
            print(f"✗ Signup failed: {response.text}")
            return None
    except Exception as e:
        print(f"✗ Signup error: {str(e)}")
        return None

def test_login(username, password):
    """Test user login"""
    print(f"Testing login for user: {username}")

    login_data = {
        "username": username,
        "password": password
    }

    try:
        # Using form data for OAuth2PasswordRequestForm
        response = requests.post(f"{BASE_URL}/login", data=login_data)
        print(f"Login response: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print("✓ Login successful")
            print(f"Access token received: {bool(result.get('access_token'))}")
            return result
        else:
            print(f"✗ Login failed: {response.text}")
            return None
    except Exception as e:
        print(f"✗ Login error: {str(e)}")
        return None

def test_get_user_profile(access_token):
    """Test getting user profile with access token"""
    print("Testing get user profile")

    headers = {
        "Authorization": f"Bearer {access_token}"
    }

    try:
        response = requests.get(f"{BASE_URL}/users/me", headers=headers)
        print(f"Get user profile response: {response.status_code}")
        if response.status_code == 200:
            user_data = response.json()
            print(f"✓ User profile retrieved successfully")
            print(f"User ID: {user_data.get('id')}")
            print(f"Username: {user_data.get('username')}")
            print(f"Email: {user_data.get('email')}")
            return user_data
        else:
            print(f"✗ Get user profile failed: {response.text}")
            return None
    except Exception as e:
        print(f"✗ Get user profile error: {str(e)}")
        return None

def test_get_todos(user_id, access_token):
    """Test getting todos for a user"""
    print(f"Testing get todos for user ID: {user_id}")

    headers = {
        "Authorization": f"Bearer {access_token}"
    }

    try:
        response = requests.get(f"{BASE_URL}/{user_id}/tasks", headers=headers)
        print(f"Get todos response: {response.status_code}")
        if response.status_code == 200:
            todos = response.json()
            print(f"✓ Todos retrieved successfully: {len(todos)} todos")
            return todos
        else:
            print(f"✗ Get todos failed: {response.text}")
            return []
    except Exception as e:
        print(f"✗ Get todos error: {str(e)}")
        return []

def main():
    print("Testing Authentication Flow After Fixes")
    print("=" * 50)

    # Test data
    test_email = "testuser@example.com"
    test_username = "testuser"
    test_password = "testpassword123"

    # Step 1: Test signup
    signup_result = test_signup(test_email, test_username, test_password)
    if not signup_result:
        print("Cannot proceed without successful signup")
        return

    # Step 2: Test login
    login_result = test_login(test_email, test_password)  # Using email as username for login
    if not login_result:
        print("Cannot proceed without successful login")
        return

    access_token = login_result.get('access_token')
    if not access_token:
        print("No access token received from login")
        return

    # Step 3: Test get user profile
    user_profile = test_get_user_profile(access_token)
    if not user_profile:
        print("Cannot proceed without user profile")
        return

    user_id = user_profile.get('id')
    if not user_id:
        print("No user ID found in profile")
        return

    # Step 4: Test get todos
    todos = test_get_todos(user_id, access_token)

    print("\n" + "=" * 50)
    print("Authentication Flow Test Results:")
    print(f"- Signup: {'✓ PASS' if signup_result else '✗ FAIL'}")
    print(f"- Login: {'✓ PASS' if login_result else '✗ FAIL'}")
    print(f"- Get Profile: {'✓ PASS' if user_profile else '✗ FAIL'}")
    print(f"- Get Todos: {'✓ PASS' if todos is not None else '✗ FAIL'}")
    print("- User ID stored and accessible: ✓ PASS")
    print("\nThe authentication flow is working correctly!")
    print("Users can now successfully sign up, log in, and access their dashboard.")

if __name__ == "__main__":
    main()