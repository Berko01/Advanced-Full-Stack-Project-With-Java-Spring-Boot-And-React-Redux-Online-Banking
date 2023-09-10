package com.beko.DemoBank_v1.exception;

import org.springframework.http.HttpStatus;

public class CustomError extends RuntimeException {

    private int statusCode;

    public CustomError(String message, int statusCode) {
        super(message);
        this.statusCode = statusCode;
    }

    public int getStatusCode() {
        return statusCode;
    }
}
