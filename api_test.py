import requests
import json

# Test the API endpoints directly to identify the issue
base_url = "http://localhost:8000/api"

print("Testing API endpoints...")

# Test root endpoint
try:
    response = requests.get(f"{base_url}/")
    print(f"Root endpoint: {response.status_code} - {response.json()}")
except Exception as e:
    print(f"Root endpoint failed: {e}")

# Test health endpoint
try:
    response = requests.get(f"{base_url}/health")
    print(f"Health endpoint: {response.status_code} - {response.json()}")
except Exception as e:
    print(f"Health endpoint failed: {e}")

# Test signup with a new user
test_user = {
    "email": "testuser@example.com",
    "username": "testuser",
    "password": "password123"
}

try:
    response = requests.post(f"{base_url}/signup", json=test_user)
    print(f"Signup endpoint: {response.status_code}")
    if response.status_code != 200:
        print(f"Signup response: {response.text}")
    else:
        print(f"Signup response: {response.json()}")
except Exception as e:
    print(f"Signup endpoint failed: {e}")

# Try to login with the test user
login_data = {
    "username": "testuser@example.com",
    "password": "password123"
}

try:
    response = requests.post(
        f"{base_url}/login",
        data=login_data,
        headers={"Content-Type": "application/x-www-form-urlencoded"}
    )
    print(f"Login endpoint: {response.status_code}")
    if response.status_code != 200:
        print(f"Login response: {response.text}")
    else:
        print(f"Login response: {response.json()}")
        token_data = response.json()
        access_token = token_data.get("access_token")

        if access_token:
            # Test getting current user
            headers = {"Authorization": f"Bearer {access_token}"}
            try:
                response = requests.get(f"{base_url}/users/me", headers=headers)
                print(f"Get user endpoint: {response.status_code}")
                if response.status_code != 200:
                    print(f"Get user response: {response.text}")
                else:
                    user_data = response.json()
                    print(f"Get user response: {user_data}")

                    # Test getting todos for this user
                    user_id = user_data.get("id")
                    if user_id:
                        response = requests.get(f"{base_url}/{user_id}/tasks", headers=headers)
                        print(f"Get todos endpoint: {response.status_code}")
                        if response.status_code != 200:
                            print(f"Get todos response: {response.text}")
                        else:
                            print(f"Get todos response: {response.json()}")
            except Exception as e:
                print(f"Get user endpoint failed: {e}")

except Exception as e:
    print(f"Login endpoint failed: {e}")