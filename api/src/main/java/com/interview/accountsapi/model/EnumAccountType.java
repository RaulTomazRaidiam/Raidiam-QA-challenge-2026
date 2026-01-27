package com.interview.accountsapi.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum EnumAccountType {
    CONTA_DEPOSITO_A_VISTA,
    CONTA_POUPANCA,
    CONTA_PAGAMENTO_PRE_PAGA;

    @JsonCreator
    public static EnumAccountType from(String value) {
        return EnumAccountType.valueOf(value);
    }

    @JsonValue
    public String toValue() {
        return this.name();
    }
}
