package edu.API.ClientsAPI;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class Client {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String firstName;
    private String lastName;
    private LocalDate dateOfBirth;
    private Integer licenseNumber;
    private LocalDate dateOfLicenseObtained;


    public Client() {
    }


    public Client(String firstName, String lastName, LocalDate dateOfBirth, Integer licenseNumber, LocalDate dateOfLicenseObtained) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.dateOfBirth = dateOfBirth;
        this.licenseNumber = licenseNumber;
        this.dateOfLicenseObtained = dateOfLicenseObtained;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int  getId() {
        return id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public Integer getLicenseNumber() {
        return licenseNumber;
    }

    public void setLicenseNumber(Integer licenseNumber) {
        this.licenseNumber = licenseNumber;
    }

    public LocalDate getDateOfLicenseObtained() {
        return dateOfLicenseObtained;
    }

    public void setDateOfLicenseObtained(LocalDate dateOfLicenseObtained) {
        this.dateOfLicenseObtained = dateOfLicenseObtained;
    }
}