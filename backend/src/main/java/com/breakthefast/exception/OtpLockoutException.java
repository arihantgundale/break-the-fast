package com.breakthefast.exception;

public class OtpLockoutException extends RuntimeException {
    public OtpLockoutException(String message) {
        super(message);
    }
}
