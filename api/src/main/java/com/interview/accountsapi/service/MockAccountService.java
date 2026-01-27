package com.interview.accountsapi.service;

import com.interview.accountsapi.model.*;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class MockAccountService {

    private final List<AccountData> accounts = new ArrayList<>();

    public MockAccountService() {
        // 3 mocked accounts for interview exercises (filtering + validation of business rules)
        accounts.add(new AccountData(
                "Organização A",
                "21128159000166",
                EnumAccountType.CONTA_DEPOSITO_A_VISTA,
                "001",
                "1234",
                "94088392",
                "4",
                "ACC-001"
        ));

        accounts.add(new AccountData(
                "Organização A",
                "21128159000166",
                EnumAccountType.CONTA_POUPANCA,
                "237",
                "4321",
                "24550245",
                "7",
                "ACC-002"
        ));

        // For pre-paid accounts, branchCode/checkDigit are often absent in real-world data.
        accounts.add(new AccountData(
                "Organização B",
                "99999999000199",
                EnumAccountType.CONTA_PAGAMENTO_PRE_PAGA,
                "104",
                null,
                "12345678",
                null,
                "ACC-003"
        ));
    }

    public List<AccountData> listAccounts(EnumAccountType filterType) {
        if (filterType == null) return List.copyOf(accounts);
        return accounts.stream().filter(a -> a.type() == filterType).toList();
    }

    public Optional<AccountIdentificationData> getAccountIdentification(String accountId) {
        return accounts.stream()
                .filter(a -> a.accountId().equals(accountId))
                .findFirst()
                .map(a -> new AccountIdentificationData(
                        a.compeCode(),
                        a.branchCode(),
                        a.number(),
                        a.checkDigit(),
                        a.type(),
                        EnumAccountSubType.INDIVIDUAL,
                        "BRL"
                ));
    }
}
