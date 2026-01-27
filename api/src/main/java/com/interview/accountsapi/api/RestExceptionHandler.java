package com.interview.accountsapi.api;

import com.interview.accountsapi.model.ErrorItem;
import com.interview.accountsapi.model.MetaOnlyRequestDateTime;
import com.interview.accountsapi.model.ResponseErrorMetaSingle;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MissingRequestHeaderException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;

@RestControllerAdvice
public class RestExceptionHandler {

    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<ResponseErrorMetaSingle> unauthorized(UnauthorizedException ex) {
        return response(HttpStatus.UNAUTHORIZED, "UNAUTHORIZED", "Unauthorized", ex.getMessage());
    }

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<ResponseErrorMetaSingle> notFound(NotFoundException ex) {
        return response(HttpStatus.NOT_FOUND, "NOT_FOUND", "Not Found", ex.getMessage());
    }

    @ExceptionHandler(MissingRequestHeaderException.class)
    public ResponseEntity<ResponseErrorMetaSingle> missingHeader(MissingRequestHeaderException ex) {
        // Spec has 401 for auth failures; keep it explicit for Authorization only
        if ("Authorization".equalsIgnoreCase(ex.getHeaderName())) {
            return response(HttpStatus.UNAUTHORIZED, "UNAUTHORIZED", "Unauthorized", "Missing required header: Authorization");
        }
        return response(HttpStatus.BAD_REQUEST, "BAD_REQUEST", "Bad Request", "Missing required header: " + ex.getHeaderName());
    }

    @ExceptionHandler({
            ConstraintViolationException.class,
            MethodArgumentNotValidException.class,
            MethodArgumentTypeMismatchException.class
    })
    public ResponseEntity<ResponseErrorMetaSingle> validation(Exception ex) {
        String detail = "Validation error";

        if (ex instanceof ConstraintViolationException cve) {
            detail = cve.getConstraintViolations().stream()
                    .map(v -> v.getPropertyPath() + " " + v.getMessage())
                    .findFirst()
                    .orElse(detail);
        } else if (ex instanceof MethodArgumentTypeMismatchException matme) {
            detail = "Invalid value for parameter '" + matme.getName() + "'";
        } else if (ex instanceof MethodArgumentNotValidException manve) {
            detail = manve.getBindingResult().getFieldErrors().stream()
                    .map(err -> err.getField() + " " + err.getDefaultMessage())
                    .findFirst()
                    .orElse(detail);
        }

        return response(HttpStatus.BAD_REQUEST, "BAD_REQUEST", "Bad Request", detail);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ResponseErrorMetaSingle> unexpected(Exception ex, HttpServletRequest request) {
        return response(HttpStatus.INTERNAL_SERVER_ERROR, "INTERNAL_SERVER_ERROR", "Internal Server Error", ex.getMessage());
    }

    private ResponseEntity<ResponseErrorMetaSingle> response(HttpStatus status, String code, String title, String detail) {
        ResponseErrorMetaSingle body = new ResponseErrorMetaSingle(
                List.of(new ErrorItem(code, title, detail)),
                new MetaOnlyRequestDateTime(OffsetDateTime.now(ZoneOffset.UTC))
        );
        return ResponseEntity.status(status).body(body);
    }
}
