const request = require('supertest');
const { v4: uuidv4 } = require('uuid');
const { expect } = require('chai');

const BASE_URL = 'http://locahost:8080';
const ACCOUNTS_ENDPOINT = '/account';
const BEARER_TOKEN = '';

function generateInteractionId() {
  return uuidv4();
}

function createHeaders() {
  return {
    'Authorization': BEARER_TOKEN,
    'Content-Type': 'application/json',
  };
}

async function getAllAccounts() {
  const response = await request(BASE_URL)
    .get(ACCOUNTS_ENDPOINT)
    .set(createHeaders())

  expect(response.statusCode).to.equal(200);

  return (response.body.data || []).map(account => ({
    accountId: account.accountId,
    brandName: account.brandName,
    companyCnpj: account.companyCnpj,
    type: account.type,
    compeCode: account.compeCode,
    branchCode: account.branchCode,
    number: account.number,
    checkDigit: account.checkDigit
  }));
}

async function getAccountById(accountId) {
  const response = await request(BASE_URL)
    .get(ACCOUNTS_ENDPOINT + '/' + accountId)
    .set(createHeaders())
    .expect(200);

  const { data } = response.body;
  return {
    compeCode: data.compeCode,
    branchCode: data.branchCode,
    number: data.number,
    checkDigit: data.checkDigit,
    type: data.type,
    subtype: data.subtype,
    currency: data.currency
  };
}

describe('Accounts API (Supertest)', function () {
  describe('GET /account', function () {
    it('returns 200 and a list of accounts with required fields', async function () {
      const accounts = await getAllAccounts();
      expect(accounts).to.be.an('array');
      expect(accounts.length).to.be.greaterThan(0);
      accounts.forEach(account => {
        expect(account).to.include.keys(
          'accountId', 'brandName', 'companyCnpj', 'type',
          'compeCode', 'branchCode', 'number', 'checkDigit'
        );
      });
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

module.exports = {
  getAllAccounts,
  getAccountById
};