package com.interview.accountsapi;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class AccountsApiSmokeTest {

    @Autowired
    MockMvc mvc;

    @Test
    void getAccounts_ok() throws Exception {
        mvc.perform(get("/accounts")
                        .header("Authorization", "Bearer test")
                        .header("x-fapi-interaction-id", "11111111-1111-1111-1111-111111111111"))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith("application/json"))
                .andExpect(jsonPath("$.data").isArray())
                .andExpect(jsonPath("$.meta.totalRecords").value(3));
    }

    @Test
    void getAccounts_missingAuth_is401() throws Exception {
        mvc.perform(get("/accounts")
                        .header("x-fapi-interaction-id", "11111111-1111-1111-1111-111111111111"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void getAccounts_invalidInteractionId_is400() throws Exception {
        mvc.perform(get("/accounts")
                        .header("Authorization", "Bearer test")
                        .header("x-fapi-interaction-id", "not-a-uuid"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void getAccountById_notFound_is404() throws Exception {
        mvc.perform(get("/accounts/ACC-999")
                        .header("Authorization", "Bearer test")
                        .header("x-fapi-interaction-id", "11111111-1111-1111-1111-111111111111"))
                .andExpect(status().isNotFound());
    }
}
