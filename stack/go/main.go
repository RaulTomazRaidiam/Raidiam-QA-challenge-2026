package main

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"time"

	"github.com/google/uuid"
)

// Configuration
var (
	baseURL         = getEnvOrDefault("BASE_URL", "http://locahost:8080")
	accountsEndpoint = "/account"
	bearerToken     = ""
)

// Account represents account data from the list endpoint
type Account struct {
	AccountID    string `json:"accountId"`
	BrandName    string `json:"brandName"`
	CompanyCnpj  string `json:"companyCnpj"`
	Type         string `json:"type"`
	CompeCode    string `json:"compeCode"`
	BranchCode   string `json:"branchCode"`
	Number       string `json:"number"`
	CheckDigit   string `json:"checkDigit"`
}

// AccountDetail represents account data from the individual account endpoint
type AccountDetail struct {
	CompeCode  string `json:"compeCode"`
	BranchCode string `json:"branchCode"`
	Number     string `json:"number"`
	CheckDigit string `json:"checkDigit"`
	Type       string `json:"type"`
	Subtype    string `json:"subtype"`
	Currency   string `json:"currency"`
}

// AccountsResponse represents the response structure for GET /accounts
type AccountsResponse struct {
	Data []Account `json:"data"`
}

// AccountDetailResponse represents the response structure for GET /accounts/{accountId}
type AccountDetailResponse struct {
	Data AccountDetail `json:"data"`
}

// Helper function to get environment variable or return default
func getEnvOrDefault(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

// Helper function to generate UUID for x-fapi-interaction-id header
func generateInteractionID() string {
	return uuid.New().String()
}

// Helper function to create request headers
func createHeaders() map[string]string {
	return map[string]string{
		"Authorization":        bearerToken,
		"Content-Type":         "application/json",
	}
}

// Helper function to make HTTP GET request
func makeRequest(url string, headers map[string]string) (*http.Response, error) {
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	// Set headers
	for key, value := range headers {
		req.Header.Set(key, value)
	}

	// Create HTTP client with timeout
	client := &http.Client{
		Timeout: 10 * time.Second,
	}

	fmt.Printf("Making request to: %s\n", url)
	fmt.Printf("Headers: Authorization=%s, x-fapi-interaction-id=%s\n", headers["Authorization"], headers["x-fapi-interaction-id"])

	resp, err := client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to make request: %w", err)
	}

	return resp, nil
}

/**
 * Helper method to get all accounts from the API
 * Returns list of Account objects with all properties set
 */
func getAllAccounts() ([]Account, error) {
	url := baseURL + accountsEndpoint
	headers := createHeaders()

	resp, err := makeRequest(url, headers)
	if err != nil {
		return nil, fmt.Errorf("error getting all accounts: %w", err)
	}
	defer resp.Body.Close()

	// Check if response is successful
	if resp.StatusCode != http.StatusOK {
		bodyBytes, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("expected status 200, got %d. Response: %s", resp.StatusCode, string(bodyBytes))
	}

	fmt.Printf("Response status: %d %s\n", resp.StatusCode, resp.Status)

	// Read response body
	bodyBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read response body: %w", err)
	}

	fmt.Printf("Response data: %s\n", string(bodyBytes))

	// Deserialize JSON response
	var accountsResponse AccountsResponse
	if err := json.Unmarshal(bodyBytes, &accountsResponse); err != nil {
		return nil, fmt.Errorf("failed to unmarshal response: %w", err)
	}

	// Create Account objects dynamically for each account returned
	accountList := make([]Account, 0, len(accountsResponse.Data))
	for _, deserializedAccount := range accountsResponse.Data {
		account := Account{
			AccountID:   deserializedAccount.AccountID,
			BrandName:   deserializedAccount.BrandName,
			CompanyCnpj: deserializedAccount.CompanyCnpj,
			Type:        deserializedAccount.Type,
			CompeCode:   deserializedAccount.CompeCode,
			BranchCode:  deserializedAccount.BranchCode,
			Number:      deserializedAccount.Number,
			CheckDigit:  deserializedAccount.CheckDigit,
		}
		accountList = append(accountList, account)
	}

	return accountList, nil
}

/**
 * Helper method to get a specific account by ID from the API
 * Returns AccountDetail object with all properties set
 */
func getAccountById(accountID string) (*AccountDetail, error) {
	url := baseURL + accountsEndpoint + "/" + accountID
	headers := createHeaders()

	fmt.Printf("Getting account by ID: %s\n", accountID)
	fmt.Printf("Request URL: %s\n", url)

	resp, err := makeRequest(url, headers)
	if err != nil {
		return nil, fmt.Errorf("error getting account by ID: %w", err)
	}
	defer resp.Body.Close()

	// Check if response is successful
	if resp.StatusCode != http.StatusOK {
		bodyBytes, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("expected status 200, got %d. Response: %s", resp.StatusCode, string(bodyBytes))
	}

	fmt.Printf("Response status: %d %s\n", resp.StatusCode, resp.Status)

	// Read response body
	bodyBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read response body: %w", err)
	}

	fmt.Printf("Response data: %s\n", string(bodyBytes))

	// Deserialize JSON response
	var accountDetailResponse AccountDetailResponse
	if err := json.Unmarshal(bodyBytes, &accountDetailResponse); err != nil {
		return nil, fmt.Errorf("failed to unmarshal response: %w", err)
	}

	accountDetail := &AccountDetail{
		CompeCode:  accountDetailResponse.Data.CompeCode,
		BranchCode: accountDetailResponse.Data.BranchCode,
		Number:     accountDetailResponse.Data.Number,
		CheckDigit: accountDetailResponse.Data.CheckDigit,
		Type:       accountDetailResponse.Data.Type,
		Subtype:    accountDetailResponse.Data.Subtype,
		Currency:   accountDetailResponse.Data.Currency,
	}

	return accountDetail, nil
}

/**
 * Test: Get all accounts
 * Tests the GET /accounts endpoint
 * Retrieves all accounts from the API
 * Deserializes the response into Account objects
 * Validates the response structure
 * Prints all account details
 */
func testGetAllAccounts() ([]Account, error) {
	fmt.Println("\n=== Running testGetAllAccounts ===\n")

	// Get all accounts using the helper method
	accounts, err := getAllAccounts()
	if err != nil {
		return nil, fmt.Errorf("testGetAllAccounts failed: %w", err)
	}

	// Print all values from all objects at the end
	for _, account := range accounts {
		fmt.Printf("Account ID: %s\n", account.AccountID)
		fmt.Printf("Brand Name: %s\n", account.BrandName)
		fmt.Printf("Company CNPJ: %s\n", account.CompanyCnpj)
		fmt.Printf("Type: %s\n", account.Type)
		fmt.Printf("COMPE Code: %s\n", account.CompeCode)
		fmt.Printf("Branch Code: %s\n", account.BranchCode)
		fmt.Printf("Number: %s\n", account.Number)
		fmt.Printf("Check Digit: %s\n", account.CheckDigit)
		fmt.Println("---")
	}

	fmt.Printf("\n✓ testGetAllAccounts passed - Retrieved %d accounts\n\n", len(accounts))
	return accounts, nil
}

/**
 * Test: Get account by ID
 * Tests the GET /accounts/{accountId} endpoint
 * For each account retrieved from the list endpoint:
 * - Makes a request to get the individual account details
 * - Deserializes the response into AccountDetail objects
 * - Validates that common properties match between list and detail responses
 */
func testGetAccountById() error {
	fmt.Println("\n=== Running testGetAccountById ===\n")

	// Get all accounts using the helper method
	accounts, err := getAllAccounts()
	if err != nil {
		return fmt.Errorf("testGetAccountById failed to get accounts: %w", err)
	}

	// Get each account by ID using the helper method and assert properties match
	for _, account := range accounts {
		accountDetail, err := getAccountById(account.AccountID)
		if err != nil {
			return fmt.Errorf("testGetAccountById failed to get account %s: %w", account.AccountID, err)
		}

		// Assert that common account properties match between the list and individual account response
		assertions := []struct {
			expected string
			actual   string
			field    string
		}{
			{account.Type, accountDetail.Type, "type"},
			{account.CompeCode, accountDetail.CompeCode, "compeCode"},
			{account.BranchCode, accountDetail.BranchCode, "branchCode"},
			{account.Number, accountDetail.Number, "number"},
			{account.CheckDigit, accountDetail.CheckDigit, "checkDigit"},
		}

		allPassed := true
		for _, assertion := range assertions {
			if assertion.expected != assertion.actual {
				fmt.Printf("✗ Assertion failed for %s: expected \"%s\", got \"%s\"\n",
					assertion.field, assertion.expected, assertion.actual)
				allPassed = false
			} else {
				fmt.Printf("✓ %s matches: \"%s\"\n", assertion.field, assertion.expected)
			}
		}

		if !allPassed {
			return fmt.Errorf("assertions failed for account %s", account.AccountID)
		}
	}

	fmt.Printf("\n✓ testGetAccountById passed - Validated %d accounts\n\n", len(accounts))
	return nil
}

/**
 * Run all tests
 */
func runAllTests() {
	fmt.Println("========================================")
	fmt.Println("Starting Account API Tests (Go)")
	fmt.Printf("Base URL: %s\n", baseURL)
	fmt.Println("========================================\n")

	// Run testGetAllAccounts
	accounts, err := testGetAllAccounts()
	if err != nil {
		fmt.Printf("\n========================================\n")
		fmt.Printf("Test execution failed: %v\n", err)
		fmt.Println("========================================")
		os.Exit(1)
	}

	// Run testGetAccountById
	if err := testGetAccountById(); err != nil {
		fmt.Printf("\n========================================\n")
		fmt.Printf("Test execution failed: %v\n", err)
		fmt.Println("========================================")
		os.Exit(1)
	}

	// If we got here but no accounts were retrieved, that's also a failure
	if len(accounts) == 0 {
		fmt.Printf("\n========================================\n")
		fmt.Println("Test execution failed: No accounts retrieved")
		fmt.Println("========================================")
		os.Exit(1)
	}

	fmt.Println("========================================")
	fmt.Println("All tests passed successfully!")
	fmt.Println("========================================")
}

func main() {
	runAllTests()
}
