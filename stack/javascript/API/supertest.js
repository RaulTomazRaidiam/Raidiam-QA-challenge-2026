const request = require('supertest');
const { v4: uuidv4 } = require('uuid');
const { expect } = require('chai');

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
    
    const headers = createHeaders();
    
    // Getting all accounts from the mock project using supertest
    const response = await request(BASE_URL)
      .get(ACCOUNTS_ENDPOINT)
      .set(headers)
      .expect(200);

    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(response.body, null, 2));

    // Deserializing the data attribute results into Account objects
    const deserializedAccounts = response.body.data || [];

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
      console.error('Response data:', JSON.stringify(error.response.body || error.response.data, null, 2));
    } else if (error.err) {
      // Supertest error
      console.error('Supertest error:', error.err);
      console.error('Error details:', error);
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

    const headers = createHeaders();

    // Do a request to the specific account endpoint using supertest
    const accountResponse = await request(BASE_URL)
      .get(ACCOUNTS_ENDPOINT + '/' + accountId)
      .set(headers)
      .expect(200);

    console.log('Response status:', accountResponse.status);
    console.log('Response data:', JSON.stringify(accountResponse.body, null, 2));

    // Deserializing the data attribute results into AccountDetail object
    const accountDetail = {
      compeCode: accountResponse.body.data.compeCode,
      branchCode: accountResponse.body.data.branchCode,
      number: accountResponse.body.data.number,
      checkDigit: accountResponse.body.data.checkDigit,
      type: accountResponse.body.data.type,
      subtype: accountResponse.body.data.subtype,
      currency: accountResponse.body.data.currency
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
      console.error('Response data:', JSON.stringify(error.response.body || error.response.data, null, 2));
    } else if (error.err) {
      // Supertest error
      console.error('Supertest error:', error.err);
      console.error('Error details:', error);
    } else {
      // Something else happened
      console.error('Error setting up request:', error);
    }
    console.error('Full error object:', error);
    throw error;
  }
}

// --- Mocha tests (run with: npm run test:supertest or mocha supertest.js) ---

describe('Account API (Supertest)', function () {
  describe('GET /account', function () {
    it('returns 200 and a list of accounts with required fields', async function () {
      const accounts = await getAllAccounts();
      expect(accounts).to.be.an('array');
      expect(accounts.length).to.be.greaterThan(0);
      for (const account of accounts) {
        expect(account).to.include.keys(
          'accountId', 'brandName', 'companyCnpj', 'type',
          'compeCode', 'branchCode', 'number', 'checkDigit'
        );
      }
    });
  });

  describe('GET /account/:accountId', function () {
    it('returns account detail and matches list response for common fields', async function () {
      const accounts = await getAllAccounts();
      for (const account of accounts) {
        const accountDetail = await getAccountById(account.accountId);
        expect(accountDetail.type).to.equal(account.type);
        expect(accountDetail.compeCode).to.equal(account.compeCode);
        expect(accountDetail.branchCode).to.equal(account.branchCode);
        expect(accountDetail.number).to.equal(account.number);
        expect(accountDetail.checkDigit).to.equal(account.checkDigit);
      }
    });
  });
});

// Export functions for use in other modules or test frameworks
module.exports = {
  getAllAccounts,
  getAccountById
};
