package com.interview.accountsapi.model;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.OffsetDateTime;

public record Meta(
        int totalRecords,
        int totalPages,
        @JsonFormat(shape = JsonFormat.Shape.STRING) OffsetDateTime requestDateTime
) {}
