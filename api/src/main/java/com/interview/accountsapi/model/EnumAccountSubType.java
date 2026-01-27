package com.interview.accountsapi.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum EnumAccountSubType {
    INDIVIDUAL,
    CONJUNTA_SIMPLES,
    CONJUNTA_SOLIDARIA;

    @JsonCreator
    public static EnumAccountSubType from(String value) {
        return EnumAccountSubType.valueOf(value);
    }

    @JsonValue
    public String toValue() {
        return this.name();
    }
}
