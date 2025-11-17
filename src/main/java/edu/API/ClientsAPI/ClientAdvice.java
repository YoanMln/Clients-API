package edu.API.ClientsAPI;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class ClientAdvice {

    @ExceptionHandler(InvalidLicenseException.class)
    public ResponseEntity<String> handleInvalidLicense(InvalidLicenseException ex){
        return new ResponseEntity<>("Cannot add client: " + ex.getMessage(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(ClientUnder18Exception.class)
    public ResponseEntity<String> handleClientUnder18(ClientUnder18Exception ex){
        return new ResponseEntity<>("Cannot add client: " + ex.getMessage(), HttpStatus.BAD_REQUEST);
    }
}
