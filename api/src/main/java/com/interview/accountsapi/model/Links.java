package com.interview.accountsapi.model;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record Links(
        String self,
        String first,
        String prev,
        String next,
        String last
) {}
