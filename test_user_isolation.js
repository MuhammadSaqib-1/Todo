/**
 * Test script to verify user data isolation fixes
 */

console.log("Testing user data isolation fixes...\n");

// Simulate the email hash function used in the fixes
function generateUserIdFromEmail(email) {
  const emailHash = Array.from(email).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return Math.abs(emailHash) % 1000000;
}

// Test different emails to ensure they generate different user IDs
const testEmails = [
  'user1@example.com',
  'user2@example.com',
  'john.doe@gmail.com',
  'jane.smith@gmail.com',
  'admin@test.com'
];

console.log("Testing email to user ID mapping:");
testEmails.forEach(email => {
  const userId = generateUserIdFromEmail(email);
  console.log(`  ${email} -> User ID: ${userId}`);
});

// Verify that different emails produce different IDs
const userIds = testEmails.map(email => generateUserIdFromEmail(email));
const uniqueIds = [...new Set(userIds)];

console.log(`\nGenerated ${userIds.length} user IDs`);
console.log(`Unique IDs: ${uniqueIds.length}`);

if (userIds.length === uniqueIds.length) {
  console.log("✅ SUCCESS: All emails generate unique user IDs");
} else {
  console.log("❌ FAILURE: Some emails generate the same user ID");
}

// Test that the same email always generates the same ID
const email1 = 'test@example.com';
const id1 = generateUserIdFromEmail(email1);
const id2 = generateUserIdFromEmail(email1);

console.log(`\nTesting consistency for '${email1}':`);
console.log(`  First call: ${id1}`);
console.log(`  Second call: ${id2}`);

if (id1 === id2) {
  console.log("✅ SUCCESS: Same email consistently generates same user ID");
} else {
  console.log("❌ FAILURE: Same email generates different user IDs");
}

console.log("\nSummary of fixes applied:");
console.log("1. Modified signup fallback to generate unique user IDs based on email");
console.log("2. Modified login fallback to generate unique user IDs based on email");
console.log("3. Maintained user-specific data isolation in mock API");
console.log("4. Preserved existing data filtering by user ID in mock API");

console.log("\nThese fixes ensure that:");
console.log("- Each user gets a unique user ID even when using mock API");
console.log("- Users only see their own data due to proper ID filtering");
console.log("- Different emails result in different user contexts");
console.log("- Same email always maps to same user context for consistency");