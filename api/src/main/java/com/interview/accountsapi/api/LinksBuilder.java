package com.interview.accountsapi.api;

import com.interview.accountsapi.model.Links;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

final class LinksBuilder {

    private LinksBuilder() {}

    static Links pageLinks(String baseUrlNoPageParams, int page, int pageSize, int totalPages) {
        String self = withPage(baseUrlNoPageParams, page, pageSize);

        String first = page > 1 ? withPage(baseUrlNoPageParams, 1, pageSize) : null;
        String prev = page > 1 ? withPage(baseUrlNoPageParams, page - 1, pageSize) : null;
        String next = page < totalPages ? withPage(baseUrlNoPageParams, page + 1, pageSize) : null;
        String last = page < totalPages ? withPage(baseUrlNoPageParams, totalPages, pageSize) : null;

        return new Links(self, first, prev, next, last);
    }

    private static String withPage(String baseUrl, int page, int pageSize) {
        String sep = baseUrl.contains("?") ? "&" : "?";
        return baseUrl + sep + "page=" + page + "&page-size=" + pageSize;
    }
}
