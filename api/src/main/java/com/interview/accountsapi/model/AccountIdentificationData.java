package com.interview.accountsapi.model;

public record AccountIdentificationData(
        String compeCode,
        String branchCode,
        String number,
        String checkDigit,
        EnumAccountType type,
        EnumAccountSubType subtype,
        String currency
) {}
