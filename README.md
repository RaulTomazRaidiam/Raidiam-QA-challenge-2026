# Raidiam-QA-challenge-2026

## Table of Contents

- [Test API Configuration](#test-api-configuration)
- [Running with Java Code](#running-with-java-code)
- [Running with JavaScript (Axios)](#running-with-javascript-axios)
- [Running with JavaScript (Supertest)](#running-with-javascript-supertest)
- [Running with Go](#running-with-go)

## Test API Configuration

**Implemented Endpoints:**
- `GET /accounts`
- `GET /accounts/{accountId}`

## How to Build & Run

#### Prerequisites

- Java 17+
- Maven 3.9+
- [How to install Java 17+ & Maven Setup](README-java-maven.md)
- [IntelliJ or another IDE for Java](https://www.jetbrains.com/idea/download/)

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


### Authentication (Mocked)

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


### Endpoints

#### GET `/accounts`

Returns a list of accounts. Supports pagination and filtering.

**Example Request:**

```bash
curl --request GET \
  --url "http://localhost:8080/accounts" \
  --header "Authorization: Bearer test-token" \
  --header "x-fapi-interaction-id: 1f8e2a24-4c2b-4e06-b0b0-1f0d8bb2aabc"
```

**Example Success Response:**

```json
{
  "data": [
    {
      "brandName": "Organização A",
      "companyCnpj": "21128159000166",
      "type": "CONTA_DEPOSITO_A_VISTA",
      "compeCode": "001",
      "branchCode": "1234",
      "number": "94088392",
      "checkDigit": "4",
      "accountId": "ACC-001"
    }
  ],
  "links": {
    "self": "http://localhost:8084/accounts?page=1&page-size=25"
  },
  "meta": {
    "totalRecords": 3,
    "totalPages": 1,
    "requestDateTime": "2026-01-30T18:11:25.13686Z"
  }
}
```

#### GET `/accounts/{accountId}`

Returns a single account by ID.

**Example Request:**

```bash
curl --request GET \
  --url "http://localhost:8080/accounts/ACC-001" \
  --header "Authorization: Bearer test-token" \
  --header "x-fapi-interaction-id: 1f8e2a24-4c2b-4e06-b0b0-1f0d8bb2aabc"
```

**Example Success Response:**

```json
{
  "data": {
    "compeCode": "001",
    "branchCode": "1234",
    "number": "94088392",
    "checkDigit": "4",
    "type": "CONTA_DEPOSITO_A_VISTA",
    "subtype": "INDIVIDUAL",
    "currency": "BRL"
  },
  "links": {
    "self": "http://localhost:8084/accounts/ACC-001"
  },
  "meta": {
    "totalRecords": 1,
    "totalPages": 1,
    "requestDateTime": "2026-01-30T18:12:23.13676Z"
  }
}
```

### Prerequisites

- [How to install Java 17+ & Maven Setup](README-java-maven.md)
- The API server running (default: `http://localhost:8080`)

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

#### Option 2: Using IDE (Cursor/VS Code)

**Run Tests from IDE**
   - Open `stack/java/src/test/java/AccountMockTechCaseTest.java`
   - Click the "Run Test" link above each `@Test` method
   - Or click the play icon next to the class name to run all tests
   - Use `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows/Linux) and type "Java: Run Tests"


### Project Structure

```
stack/java/
├── pom.xml                                    # Maven configuration
├── README.md                                  # Detailed Java test documentation
├── src/
│   ├── main/java
│   └── test/
│       └── java/
│           └── AccountMockTechCaseTest.java  # API tests
└── target/                                    # Compiled classes and test reports
```

## Running with JavaScript (Axios)

### Prerequisites

- Node.js 14 or higher
- npm
- [How to install Node and NPM](README-node-npm.md)
- [Visual Studio Code/Cursor or another IDE for javascript](https://code.visualstudio.com/)
- The API server running (default: `http://localhost:8080`)

### How to Execute Tests

#### Option 1: Using Node.js directly

Navigate to the API directory:
```bash
cd stack/javascript/API
```

Install dependencies:
```bash
npm install
```

Run the tests:
```bash
node axios.js
```

#### Option 2: Using npm scripts

```bash
cd stack/javascript/API
npm install
npm run test:axios
```

## Running with JavaScript (Supertest)

### Prerequisites

- Node.js 14 or higher
- npm or yarn
- The API server running (default: `http://localhost:8080`)


#### Option 1: Using Node.js directly

Navigate to the API directory:
```bash
cd stack/javascript/API
```

Install dependencies:
```bash
npm install
```

Run the tests:
```bash
node supertest.js
```

#### Option 2: Using npm scripts

```bash
cd stack/javascript/API
npm install
npm run test:supertest
```

## Running with Go

### Prerequisites

- Go 1.21 or higher
- [How to install Go 1.21+ Setup](README-go.md)
- The API server running (default: `http://localhost:8080`)


### How to Execute Tests

#### Option 1: Using go run

Navigate to the go project directory:
```bash
cd stack/go
```

Download dependencies:
```bash
go mod tidy
```

Run the tests:
```bash
go run main.go
```

#### Option 2: Build and Run

Build the executable:
```bash
cd stack/go
go build -o account-tests main.go
```

Run the executable:
```bash
./account-tests
```