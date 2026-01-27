package com.interview.accountsapi.model;

import java.util.List;

public record ResponseAccountList(
        List<AccountData> data,
        Links links,
        Meta meta
) {}
