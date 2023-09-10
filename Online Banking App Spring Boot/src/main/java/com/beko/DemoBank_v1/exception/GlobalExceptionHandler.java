package com.beko.DemoBank_v1.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletResponse;


@ControllerAdvice
public class GlobalExceptionHandler {


    @ExceptionHandler(CustomError.class)
    @ResponseBody
    public void handleCustomError(CustomError ex) {
        if (ex.getStatusCode() == HttpServletResponse.SC_UNAUTHORIZED) {
            throw ex;
        }
        throw ex;
    }

    // Diğer istisnaları işlemek için başka yöntemler ekleyebilirsiniz.
}