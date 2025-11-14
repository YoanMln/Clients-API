package edu.API.ClientsAPI;

public class InvalidLicenseException extends RuntimeException {
    public InvalidLicenseException(int licenseId) {
        super("License id: " + licenseId + " is invalid");
    }
}
