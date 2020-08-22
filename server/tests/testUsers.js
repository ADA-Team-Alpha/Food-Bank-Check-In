require('dotenv').config();

module.exports = {
  testUser: {
    testUserID: 2,
    testUserHouseholdID: '1',
    testUserName: 'test_order',
    testUserEmail: 'test_order@email.com',
    testUserPassword: 'test_order_password'
  },
  adminUser: {
    adminEmail: process.env.ADMIN_EMAIL,
    adminPassword: process.env.ADMIN_PASSWORD,
    id: 1,
    name: process.env.ADMIN_NAME,
    accessLevel: 100,
    householdID: null,
    latestOrder: null,
    active: true
  }
};
