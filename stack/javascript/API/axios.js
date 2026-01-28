const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

// Configuration
const BASE_URL = process.env.BASE_URL || process.env.base_url || 'http://locahost:8080';
const ACCOUNTS_ENDPOINT = '/account';
const BEARER_TOKEN = '';

// Helper function to generate UUID for x-fapi-interaction-id header
function generateInteractionId() {
  return uuidv4();
}

// Helper function to create request headers
function createHeaders() {
  return {
    'Authorization': BEARER_TOKEN,
    'Content-Type': 'application/json'
  };
}

/**
 * Helper method to get all accounts from the API
 * @returns {Promise<Array<Account>>} List of Account objects with all properties set
 */
async function getAllAccounts() {
  try {
    console.log('Getting all accounts from:', BASE_URL + ACCOUNTS_ENDPOINT);
    
    // Getting all accounts from the mock project
    const response = await axios.get(BASE_URL + ACCOUNTS_ENDPOINT, {
      headers: createHeaders()
    });

    // Checking if the response is successful
    if (response.status !== 200) {
      throw new Error(`Expected status 200, got ${response.status}`);
    }

    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(response.data, null, 2));

    // Deserializing the data attribute results into Account objects
    const deserializedAccounts = response.data.data || [];

    // Create Account objects dynamically for each account returned and set all properties
    const accountList = [];
    for (const deserializedAccount of deserializedAccounts) {
      const account = {
        accountId: deserializedAccount.accountId,
        brandName: deserializedAccount.brandName,
        companyCnpj: deserializedAccount.companyCnpj,
        type: deserializedAccount.type,
        compeCode: deserializedAccount.compeCode,
        branchCode: deserializedAccount.branchCode,
        number: deserializedAccount.number,
        checkDigit: deserializedAccount.checkDigit
      };
      accountList.push(account);
    }

    return accountList;
  } catch (error) {
    console.error('Error getting all accounts:');
    if (error.message) {
      console.error('Error message:', error.message);
    }
    if (error.response) {
      // Request was made and server responded with error status
      console.error('Response status:', error.response.status);
      console.error('Response status text:', error.response.statusText);
      console.error('Response data:', JSON.stringify(error.response.data, null, 2));
      console.error('Response headers:', error.response.headers);
    } else if (error.request) {
      // Request was made but no response received
      console.error('No response received. Request details:', {
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers
      });
      console.error('Error code:', error.code);
    } else {
      // Something else happened
      console.error('Error setting up request:', error);
    }
    console.error('Full error object:', error);
    throw error;
  }
}

/**
 * Helper method to get a specific account by ID from the API
 * @param {string} accountId The account ID to retrieve
 * @returns {Promise<AccountDetail>} AccountDetail object with all properties set
 */
async function getAccountById(accountId) {
  try {
    console.log('Getting account by ID:', accountId);
    console.log('Request URL:', BASE_URL + ACCOUNTS_ENDPOINT + '/' + accountId);

    // Do a request to the specific account endpoint
    const accountResponse = await axios.get(
      BASE_URL + ACCOUNTS_ENDPOINT + '/' + accountId,
      {
        headers: createHeaders()
      }
    );

    // Checking if the response is successful
    if (accountResponse.status !== 200) {
      throw new Error(`Expected status 200, got ${accountResponse.status}`);
    }

    console.log('Response status:', accountResponse.status);
    console.log('Response data:', JSON.stringify(accountResponse.data, null, 2));

    // Deserializing the data attribute results into AccountDetail object
    const accountDetail = {
      compeCode: accountResponse.data.data.compeCode,
      branchCode: accountResponse.data.data.branchCode,
      number: accountResponse.data.data.number,
      checkDigit: accountResponse.data.data.checkDigit,
      type: accountResponse.data.data.type,
      subtype: accountResponse.data.data.subtype,
      currency: accountResponse.data.data.currency
    };

    return accountDetail;
  } catch (error) {
    console.error('Error getting account by ID:');
    if (error.message) {
      console.error('Error message:', error.message);
    }
    if (error.response) {
      // Request was made and server responded with error status
      console.error('Response status:', error.response.status);
      console.error('Response status text:', error.response.statusText);
      console.error('Response data:', JSON.stringify(error.response.data, null, 2));
      console.error('Response headers:', error.response.headers);
    } else if (error.request) {
      // Request was made but no response received
      console.error('No response received. Request details:', {
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers
      });
      console.error('Error code:', error.code);
    } else {
      // Something else happened
      console.error('Error setting up request:', error);
    }
    console.error('Full error object:', error);
    throw error;
  }
}

/**
 * Test: Get all accounts
 * Tests the GET /accounts endpoint
 * Retrieves all accounts from the API
 * Deserializes the response into Account objects
 * Validates the response structure
 * Prints all account details
 */
async function testGetAllAccounts() {
  console.log('\n=== Running testGetAllAccounts ===\n');

  try {
    // Get all accounts using the helper method
    const accounts = await getAllAccounts();

    // Print all values from all objects at the end
    for (const account of accounts) {
      console.log('Account ID:', account.accountId);
      console.log('Brand Name:', account.brandName);
      console.log('Company CNPJ:', account.companyCnpj);
      console.log('Type:', account.type);
      console.log('COMPE Code:', account.compeCode);
      console.log('Branch Code:', account.branchCode);
      console.log('Number:', account.number);
      console.log('Check Digit:', account.checkDigit);
      console.log('---');
    }

    console.log(`\n✓ testGetAllAccounts passed - Retrieved ${accounts.length} accounts\n`);
    return accounts;
  } catch (error) {
    console.error('\n✗ testGetAllAccounts failed');
    if (error.message) {
      console.error('Error message:', error.message);
    }
    if (error.response) {
      console.error('HTTP Status:', error.response.status, error.response.statusText);
      console.error('Response data:', JSON.stringify(error.response.data, null, 2));
    }
    throw error;
  }
}

/**
 * Test: Get account by ID
 * Tests the GET /accounts/{accountId} endpoint
 * For each account retrieved from the list endpoint:
 * - Makes a request to get the individual account details
 * - Deserializes the response into AccountDetail objects
 * - Validates that common properties match between list and detail responses
 */
async function testGetAccountById() {
  console.log('\n=== Running testGetAccountById ===\n');

  try {
    // Get all accounts using the helper method
    const accounts = await getAllAccounts();

    // Get each account by ID using the helper method and assert properties match
    for (const account of accounts) {
      const accountDetail = await getAccountById(account.accountId);

      // Assert that common account properties match between the list and individual account response
      const assertions = [
        { expected: account.type, actual: accountDetail.type, field: 'type' },
        { expected: account.compeCode, actual: accountDetail.compeCode, field: 'compeCode' },
        { expected: account.branchCode, actual: accountDetail.branchCode, field: 'branchCode' },
        { expected: account.number, actual: accountDetail.number, field: 'number' },
        { expected: account.checkDigit, actual: accountDetail.checkDigit, field: 'checkDigit' }
      ];

      let allPassed = true;
      for (const assertion of assertions) {
        if (assertion.expected !== assertion.actual) {
          console.error(`✗ Assertion failed for ${assertion.field}: expected "${assertion.expected}", got "${assertion.actual}"`);
          allPassed = false;
        } else {
          console.log(`✓ ${assertion.field} matches: "${assertion.expected}"`);
        }
      }

      if (!allPassed) {
        throw new Error(`Assertions failed for account ${account.accountId}`);
      }
    }

    console.log(`\n✓ testGetAccountById passed - Validated ${accounts.length} accounts\n`);
  } catch (error) {
    console.error('\n✗ testGetAccountById failed');
    if (error.message) {
      console.error('Error message:', error.message);
    }
    if (error.response) {
      console.error('HTTP Status:', error.response.status, error.response.statusText);
      console.error('Response data:', JSON.stringify(error.response.data, null, 2));
    }
    throw error;
  }
}

/**
 * Run all tests
 */
async function runAllTests() {
  console.log('========================================');
  console.log('Starting Account API Tests');
  console.log('Base URL:', BASE_URL);
  console.log('========================================\n');

  try {
    await testGetAllAccounts();
    await testGetAccountById();
    
    console.log('========================================');
    console.log('All tests passed successfully!');
    console.log('========================================');
  } catch (error) {
    console.error('\n========================================');
    console.error('Test execution failed');
    if (error.message) {
      console.error('Error message:', error.message);
    }
    if (error.response) {
      console.error('HTTP Status:', error.response.status, error.response.statusText);
      console.error('Response data:', JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      console.error('No response received from server');
      console.error('Request URL:', error.config?.url);
    } else {
      console.error('Error details:', error);
    }
    console.error('========================================');
    process.exit(1);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests();
}

// Export functions for use in other modules or test frameworks
module.exports = {
  getAllAccounts,
  getAccountById,
  testGetAllAccounts,
  testGetAccountById,
  runAllTests
};
