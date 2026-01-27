package com.interview.accountsapi.api;

import com.interview.accountsapi.model.*;
import com.interview.accountsapi.service.MockAccountService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import org.springframework.http.MediaType;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;

@Validated
@RestController
@RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE)
public class AccountsController {

    // From the provided OpenAPI spec:
    private static final String UUID_REGEX = "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$";
    private static final String FAPI_AUTH_DATE_REGEX =
            "^(Mon|Tue|Wed|Thu|Fri|Sat|Sun), \\d{2} (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) \\d{4} \\d{2}:\\d{2}:\\d{2} (GMT|UTC)$";
    private static final String ACCOUNT_ID_REGEX = "^[a-zA-Z0-9][a-zA-Z0-9\\-]{0,99}$";

    private final MockAccountService service;

    public AccountsController(MockAccountService service) {
        this.service = service;
    }

    @GetMapping("/accounts")
    public ResponseAccountList getAccounts(
            @RequestHeader("Authorization") @NotBlank String authorization,
            @RequestHeader("x-fapi-interaction-id") @NotBlank @Pattern(regexp = UUID_REGEX) String interactionId,
            @RequestHeader(value = "x-fapi-auth-date", required = false) @Pattern(regexp = FAPI_AUTH_DATE_REGEX) String fapiAuthDate,
            @RequestHeader(value = "x-fapi-customer-ip-address", required = false) String customerIp,
            @RequestHeader(value = "x-customer-user-agent", required = false) String customerUserAgent,

            @RequestParam(value = "page", defaultValue = "1") @Min(1) int page,
            @RequestParam(value = "page-size", defaultValue = "25") @Min(1) @Max(1000) int pageSize,
            @RequestParam(value = "accountType", required = false) EnumAccountType accountType,
            @RequestParam(value = "pagination-key", required = false) String paginationKey,

            HttpServletRequest request
    ) {
        // simple "auth" rule for interview exercises:
        // if header doesn't look like Bearer, treat as unauthorized
        if (!authorization.toLowerCase().startsWith("bearer ")) {
            throw new UnauthorizedException("Authorization must be a Bearer token (e.g., 'Bearer <token>')");
        }

        List<AccountData> filtered = service.listAccounts(accountType);

        int totalRecords = filtered.size();
        int totalPages = Math.max(1, (int) Math.ceil((double) totalRecords / (double) pageSize));

        int fromIndex = Math.min((page - 1) * pageSize, totalRecords);
        int toIndex = Math.min(fromIndex + pageSize, totalRecords);
        List<AccountData> pageData = filtered.subList(fromIndex, toIndex);

        String baseUrl = ServletUriComponentsBuilder.fromRequest(request).replaceQueryParam("page").replaceQueryParam("page-size").toUriString();

        Links links = LinksBuilder.pageLinks(baseUrl, page, pageSize, totalPages);
        Meta meta = new Meta(totalRecords, totalPages, OffsetDateTime.now(ZoneOffset.UTC));

        return new ResponseAccountList(pageData, links, meta);
    }

    @GetMapping("/accounts/{accountId}")
    public ResponseAccountIdentification getAccountById(
            @RequestHeader("Authorization") @NotBlank String authorization,
            @RequestHeader("x-fapi-interaction-id") @NotBlank @Pattern(regexp = UUID_REGEX) String interactionId,
            @RequestHeader(value = "x-fapi-auth-date", required = false) @Pattern(regexp = FAPI_AUTH_DATE_REGEX) String fapiAuthDate,
            @RequestHeader(value = "x-fapi-customer-ip-address", required = false) String customerIp,
            @RequestHeader(value = "x-customer-user-agent", required = false) String customerUserAgent,

            @PathVariable("accountId") @Pattern(regexp = ACCOUNT_ID_REGEX) String accountId,
            HttpServletRequest request
    ) {
        if (!authorization.toLowerCase().startsWith("bearer ")) {
            throw new UnauthorizedException("Authorization must be a Bearer token (e.g., 'Bearer <token>')");
        }

        AccountIdentificationData data = service.getAccountIdentification(accountId)
                .orElseThrow(() -> new NotFoundException("Account not found: " + accountId));

        LinksAccountId links = new LinksAccountId(ServletUriComponentsBuilder.fromRequest(request).toUriString());
        Meta meta = new Meta(1, 1, OffsetDateTime.now(ZoneOffset.UTC));

        return new ResponseAccountIdentification(data, links, meta);
    }
}
