package com.interview.accountsapi.model;

public record AccountData(
        String brandName,
        String companyCnpj,
        EnumAccountType type,
        String compeCode,
        String branchCode,
        String number,
        String checkDigit,
        String accountId
) {}
