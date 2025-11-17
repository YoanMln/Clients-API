package edu.API.ClientsAPI;

public class ClientUnder18Exception extends RuntimeException {
    public ClientUnder18Exception(int age) {
        super("Client is under 18: " + age);
    }
}
