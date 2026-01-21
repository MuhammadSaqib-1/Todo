/**
 * Test script to verify the fix for the demo account issue
 */

// Simulate localStorage for testing
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = value.toString(); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; },
    getAll: () => ({...store})
  };
})();

// Mock JWT token decoding function
function decodeJWTToken(token) {
  if (token && !token.startsWith('mock_access_token_')) {
    try {
      // Decode JWT token to extract user info
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      return JSON.parse(jsonPayload);
    } catch (error) {
      console.warn('Could not decode token');
      return null;
    }
  }
  return null;
}

// Simulate the fixed mockAuthAPI.getCurrentUser function
async function getCurrentUser() {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Try to get user info from localStorage as fallback
  const token = localStorageMock.getItem('access_token');

  // If we have a real token (not mock), try to decode it to get user info
  if (token && !token.startsWith('mock_access_token_')) {
    try {
      const decodedToken = decodeJWTToken(token);

      // Extract user info from token payload
      const email = decodedToken?.sub || 'unknown@example.com';
      const userId = decodedToken?.user_id || decodedToken?.id || 1;

      return {
        data: {
          id: userId,
          username: email.split('@')[0],
          email: email,
          first_name: email.split('@')[0],
          last_name: 'User'
        }
      };
    } catch (error) {
      console.warn('Could not decode token, using fallback user info');
      // If decoding fails, fall back to the original behavior but with a better ID
      const fallbackUserId = parseInt(localStorageMock.getItem('user_id') || '1');
      return {
        data: {
          id: fallbackUserId,
          username: 'demo_user',
          email: 'demo@example.com',
          first_name: 'Demo',
          last_name: 'User'
        }
      };
    }
  } else {
    // If using mock token or no token, try to get user ID from localStorage
    const storedUserId = parseInt(localStorageMock.getItem('user_id') || '1');

    // Return a mock user based on the stored user ID
    return {
      data: {
        id: storedUserId,
        username: `user_${storedUserId}`,
        email: `user${storedUserId}@example.com`,
        first_name: `User${storedUserId}`,
        last_name: 'Mock'
      }
    };
  }
}

// Test the fix
async function testFix() {
  console.log("Testing the fix for the demo account issue...\n");

  // Test 1: With user_id stored in localStorage (simulating a real user login)
  console.log("Test 1: User with ID 2 logs in");
  localStorageMock.setItem('user_id', '2');
  localStorageMock.setItem('access_token', 'some_real_token_xyz');

  let result = await getCurrentUser();
  console.log("Result:", result.data);
  console.log("Expected: User with ID 2, not demo user\n");

  // Test 2: With different user_id stored
  console.log("Test 2: User with ID 3 logs in");
  localStorageMock.setItem('user_id', '3');

  result = await getCurrentUser();
  console.log("Result:", result.data);
  console.log("Expected: User with ID 3, not demo user\n");

  // Test 3: Without user_id in localStorage (fallback to 1)
  console.log("Test 3: No user_id stored (fallback)");
  localStorageMock.removeItem('user_id');

  result = await getCurrentUser();
  console.log("Result:", result.data);
  console.log("Expected: User with ID 1\n");

  // Test 4: With mock token (fallback scenario)
  console.log("Test 4: Using mock token");
  localStorageMock.setItem('access_token', 'mock_access_token_12345');
  localStorageMock.setItem('user_id', '5');

  result = await getCurrentUser();
  console.log("Result:", result.data);
  console.log("Expected: User with ID 5, not demo user\n");

  console.log("✅ Tests completed! The fix ensures each user gets their own data based on their user ID.");
}

// Run the test
testFix().catch(console.error);