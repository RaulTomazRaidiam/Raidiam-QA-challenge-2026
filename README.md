# Raidiam-QA-challenge-2026

## Running with Java Code

This project contains automated API tests for the Account service using RestAssured and JUnit 5.

### Overview

The test suite validates the Account API endpoints, including:
- Retrieving all accounts
- Retrieving individual accounts by ID
- Validating response data structure and content

### Test Structure

#### Test Class: `AccountMockTechCaseTest`

Located in `stack/java/src/test/java/AccountMockTechCaseTest.java`, this class contains:

**Test Methods:**

1. **`testGetAllAccounts()`**
   - Tests the GET `/accounts` endpoint
   - Retrieves all accounts from the API
   - Deserializes the response into `Account` objects
   - Validates the response structure
   - Prints all account details

2. **`testGetAccountById()`**
   - Tests the GET `/accounts/{accountId}` endpoint
   - For each account retrieved from the list endpoint:
     - Makes a request to get the individual account details
     - Deserializes the response into `AccountDetail` objects
     - Validates that common properties match between list and detail responses

**Helper Methods:**
- `getAllAccounts()`: Retrieves all accounts from the API and returns a list of `Account` objects
- `getAccountById(String accountId)`: Retrieves a specific account by ID and returns an `AccountDetail` object

**Data Models:**
- **`Account`**: Represents account data from the list endpoint
  - Fields: `accountId`, `brandName`, `companyCnpj`, `type`, `compeCode`, `branchCode`, `number`, `checkDigit`
- **`AccountDetail`**: Represents account data from the individual account endpoint
  - Fields: `compeCode`, `branchCode`, `number`, `checkDigit`, `type`, `subtype`, `currency`

### Prerequisites

- Java 11 or higher
- Maven 3.6 or higher
- The API server running (default: `http://localhost:8080`)

### Dependencies

The project uses the following key dependencies:
- **RestAssured 4.5.1**: For API testing
- **JUnit Jupiter 5.10.0**: For test framework
- **Jackson Databind 2.15.2**: For JSON deserialization
- **Lombok 1.18.42**: For reducing boilerplate code

### How to Execute Tests

#### Option 1: Using Maven (Recommended)

Navigate to the java project directory:
```bash
cd stack/java
```

Run all tests:
```bash
mvn test
```

Run a specific test class:
```bash
mvn test -Dtest=AccountMockTechCaseTest
```

Run a specific test method:
```bash
mvn test -Dtest=AccountMockTechCaseTest#testGetAllAccounts
```

#### Option 2: Using Maven with Custom Base URL

Set the base URL via system property:
```bash
cd stack/java
mvn test -Dbase.url=http://localhost:8080
```

Or use an environment variable:
```bash
cd stack/java
export BASE_URL=http://localhost:8080
mvn test
```

#### Option 3: Using IDE (Cursor/VS Code)

1. **Install Java Test Runner Extension**
   - Install the "Extension Pack for Java" or "Java Test Runner" extension in Cursor/VS Code

2. **Run Tests from IDE**
   - Open `stack/java/src/test/java/AccountMockTechCaseTest.java`
   - Click the "Run Test" link above each `@Test` method
   - Or click the play icon next to the class name to run all tests
   - Use `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows/Linux) and type "Java: Run Tests"

3. **Debug Tests**
   - Click the "Debug Test" link above each test method
   - Set breakpoints and debug as needed

#### Option 4: Using Command Palette

1. Press `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows/Linux)
2. Type "Java: Run Tests"
3. Select the test class or method to run

### Configuration

#### Base URL Configuration

The test suite supports configuring the base URL in three ways (in order of precedence):

1. **System Property**: `-Dbase.url=http://your-server:port`
2. **Environment Variable**: `BASE_URL=http://your-server:port`
3. **Default**: `http://localhost:8080`

Example with custom URL:
```bash
cd stack/java
mvn test -Dbase.url=http://api.example.com:8080
```

#### Authentication

The tests use OAuth2 authentication with a bearer token:
- Token: `Bearer 1234567890`
- Header: `x-fapi-interaction-id` (UUID generated for each request)

### Test Execution Flow

1. **Setup (`@BeforeEach`)**
   - Initializes base URL (from system property, environment variable, or default)
   - Sets up the accounts endpoint path
   - Initializes the accounts list

2. **Test Execution**
   - `testGetAllAccounts()`:
     - Calls `getAllAccounts()` helper method
     - Validates HTTP 200 response
     - Deserializes JSON response into `Account` objects
     - Prints all account details
   
   - `testGetAccountById()`:
     - First calls `getAllAccounts()` to get account IDs
     - For each account, calls `getAccountById()` helper method
     - Validates HTTP 200 response
     - Deserializes JSON response into `AccountDetail` objects
     - Asserts that common properties match between list and detail responses

### Project Structure

```
stack/java/
├── pom.xml                                    # Maven configuration
├── README.md                                  # Detailed Java test documentation
├── src/
│   ├── main/
│   │   └── java/
│   │       ├── AccountTechCaseTest.java      # Main application test
│   │       └── resources/
│   │           ├── keystore.p12              # SSL keystore for mTLS
│   │           └── ca_trusted_list.pem       # CA certificates
│   └── test/
│       └── java/
│           └── AccountMockTechCaseTest.java  # API tests
└── target/                                    # Compiled classes and test reports
```

### Test Reports

After running tests with Maven, you can find test reports in:
- `stack/java/target/surefire-reports/` - Contains test execution reports
- `stack/java/target/surefire-reports/TEST-*.xml` - XML format test results
- `stack/java/target/surefire-reports/*.txt` - Text format test results

### Troubleshooting

**Tests Fail with Connection Error**
- Ensure the API server is running
- Verify the base URL is correct
- Check network connectivity

**Tests Fail with Authentication Error**
- Verify the bearer token is valid
- Check if the API requires different authentication

**Tests Fail with Deserialization Error**
- Ensure Jackson Databind is in the classpath
- Verify the response structure matches the expected model classes
- Check for any missing fields in the response

**Cannot Find Tests**
- Ensure tests are in `stack/java/src/test/java` directory
- Verify test class names end with `Test` or `Tests`
- Check that JUnit 5 dependencies are properly configured

### Additional Notes

- Tests use RestAssured's logging capabilities (`.log().all()`) to display request and response details
- Each request includes a unique `x-fapi-interaction-id` header for tracing
- The test suite validates both the list and detail endpoints to ensure data consistency

For more detailed information, see `stack/java/README.md`.

## Test API Configuration

This section describes the mock Accounts API used for testing. The API is implemented with **Spring Boot + Maven** and was built as a **technical interview case for QA API Testing**.

### Overview

The mock API focuses on:
- Understanding API contracts (OpenAPI-driven behavior)
- Validating requests (headers, params, path formats)
- Verifying responses (status codes, schemas, pagination)
- Testing negative scenarios (400/401/404) with consistent error payloads

**Implemented Endpoints:**
- `GET /accounts`
- `GET /accounts/{accountId}`

The service returns **3 mocked accounts** from memory (no database).

### Tech Stack

- Java 17
- Spring Boot (Web)
- Maven
- Jakarta Bean Validation (request validation)

### How to Build & Run

#### Prerequisites

- Java 17+
- Maven 3.9+

#### Build

```bash
cd api
mvn clean package
```

#### Run (from source)

```bash
cd api
mvn spring-boot:run
```

#### Run (from jar)

```bash
cd api
java -jar target/accounts-api-interview-0.0.1-SNAPSHOT.jar
```

The API will be available at:
```
http://localhost:8080
```

### Base URL

```
http://localhost:8080
```

### Authentication (Mocked)

This project uses a simplified authentication approach for interview purposes:

- Requests are considered **authorized only if** the header `Authorization` is present and starts with `Bearer `
- Otherwise, the API returns **401 Unauthorized** with a JSON error payload

Example:
```
Authorization: Bearer test-token
```

### Required Headers & Validations

Most calls require:

* `Authorization: Bearer <token>`
  Required. Missing or invalid → **401 Unauthorized**

* `x-fapi-interaction-id`
  Required. Must be a **valid UUID**
  Missing or invalid → **400 Bad Request**

Optional header:

* `x-fapi-auth-date`
  Must follow an **HTTP-date / RFC 7231-like format**
  Example:
  ```
  Sun, 10 Sep 2017 19:43:31 UTC
  ```
  Invalid format → **400 Bad Request**

> These validations exist to provide realistic API testing scenarios.

### Endpoints

#### GET `/accounts`

Returns a list of accounts. Supports pagination and filtering.

**Query Parameters:**

| Parameter     | Required | Default | Validation                       | Description:               |
| ------------- | -------- | ------- | -------------------------------- | -------------------------- |
| `page`        | No       | 1       | Must be ≥ 1                      | Page number                |
| `page-size`   | No       | 25      | Must be 1–1000                   | Number of records per page |
| `accountType` | No       | —       | Must be `Personal` or `Business` | Filters accounts           |

**Example Request:**

```bash
curl --request GET \
  --url "http://localhost:8080/accounts?page=1&page-size=25&accountType=Personal" \
  --header "Authorization: Bearer test-token" \
  --header "x-fapi-interaction-id: 1f8e2a24-4c2b-4e06-b0b0-1f0d8bb2aabc"
```

**Example Success Response:**

```json
{
  "Data": {
    "Account": [
      {
        "AccountId": "11111111-1111-1111-1111-111111111111",
        "Currency": "GBP",
        "Nickname": "Main Personal",
        "AccountType": "Personal"
      }
    ]
  },
  "Links": {
    "Self": "/accounts?page=1&page-size=25"
  },
  "Meta": {
    "TotalPages": 1
  }
}
```

#### GET `/accounts/{accountId}`

Returns a single account by ID.

**Path Validation:**

* `accountId` must match UUID format:
  ```
  ^[0-9a-fA-F-]{36}$
  ```
* Invalid format → **400 Bad Request**
* Valid format but not found → **404 Not Found**

**Example Request:**

```bash
curl --request GET \
  --url "http://localhost:8080/accounts/11111111-1111-1111-1111-111111111111" \
  --header "Authorization: Bearer test-token" \
  --header "x-fapi-interaction-id: 1f8e2a24-4c2b-4e06-b0b0-1f0d8bb2aabc"
```

**Example Success Response:**

```json
{
  "Data": {
    "Account": {
      "AccountId": "11111111-1111-1111-1111-111111111111",
      "Currency": "GBP",
      "Nickname": "Main Personal",
      "AccountType": "Personal"
    }
  },
  "Links": {
    "Self": "/accounts/11111111-1111-1111-1111-111111111111"
  },
  "Meta": {}
}
```

### Mocked Accounts Dataset

The API returns the following three accounts:

#### 1) Main Personal Account

* AccountId: `11111111-1111-1111-1111-111111111111`
* Currency: GBP
* Nickname: Main Personal
* AccountType: Personal

#### 2) Travel Wallet

* AccountId: `22222222-2222-2222-2222-222222222222`
* Currency: EUR
* Nickname: Travel Wallet
* AccountType: Personal

#### 3) Business Operating Account

* AccountId: `33333333-3333-3333-3333-333333333333`
* Currency: USD
* Nickname: Biz Operating
* AccountType: Business

### Filtering Behavior

* `GET /accounts?accountType=Personal`
  Returns accounts 1 and 2

* `GET /accounts?accountType=Business`
  Returns account 3

Filtering is applied **before pagination**.

### Pagination Behavior

Pagination parameters:

* `page` → default = 1
* `page-size` → default = 25

Pagination is applied **after filtering**.

Example:
```
GET /accounts?page-size=1&page=2
```

Returns the second account in the dataset.

### Error Responses

This mock service returns consistent JSON error payloads.

#### 400 Bad Request

Returned when:

* Missing `x-fapi-interaction-id`
* Invalid UUID in `x-fapi-interaction-id`
* Invalid `x-fapi-auth-date` format
* `page < 1`
* `page-size` outside 1–1000
* Invalid `accountType`
* Invalid `accountId` format

#### 401 Unauthorized

Returned when:

* Missing `Authorization`
* `Authorization` does not start with `Bearer `

#### 404 Not Found

Returned when:

* `accountId` is valid UUID format but not found in dataset
