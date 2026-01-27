package com.interview.accountsapi.model;

public record ResponseAccountIdentification(
        AccountIdentificationData data,
        LinksAccountId links,
        Meta meta
) {}
