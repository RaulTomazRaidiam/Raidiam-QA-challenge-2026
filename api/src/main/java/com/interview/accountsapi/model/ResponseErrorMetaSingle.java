package com.interview.accountsapi.model;

import java.util.List;

public record ResponseErrorMetaSingle(
        List<ErrorItem> errors,
        MetaOnlyRequestDateTime meta
) {}
