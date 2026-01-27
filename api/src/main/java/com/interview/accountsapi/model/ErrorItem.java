package com.interview.accountsapi.model;

public record ErrorItem(
        String code,
        String title,
        String detail
) {}
