package edu.API.ClientsAPI;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.time.Period;
import java.util.List;
import java.util.Optional;

@Service
public class ClientService {
    @Autowired
    private RestTemplate restTemplate;

    private final ClientRepository repository;

    public ClientService(ClientRepository repository, RestTemplate restTemplate){
        this.repository = repository;
        this.restTemplate = restTemplate;
    }

    public Integer calculateClientAge(int id){
        Optional<Client> client = repository.findById(id);
        return calculateClientAge(client);
    }

    public Integer calculateClientAge(Optional<Client> client){
            LocalDate birthDate = client.get().getDateOfBirth();
            LocalDate currentDate = LocalDate.now();
            if ((birthDate != null)) {
                return Period.between(birthDate, currentDate).getYears();
            } else {
                return 0;
            }
    }

    public ResponseEntity<Client> addClient(Client client) throws InvalidLicenseException, ClientUnder18Exception{
        int clientAge = calculateClientAge(Optional.ofNullable(client));

        if (!isLicenseValid(client)){
            throw new InvalidLicenseException(client.getLicenseNumber());
        } else if (clientAge <18) {
            throw new ClientUnder18Exception(clientAge);
        }
        save(client);
        return ResponseEntity.status(HttpStatus.CREATED).body(client);

    }

    public boolean isLicenseValid(Client client){
        return restTemplate.getForObject("http://license/licenses/" + client.getLicenseNumber(), Boolean.class);
    }

    public Optional<Client> findById(int id) {
        return repository.findById(id);
    }

    public List<Client> findAll(){
        return repository.findAll();
    }

    public Client save(Client client){
        return repository.save(client);
    }

    public boolean existsById(int id){
        return !repository.existsById(id);
    }

    public void deleteById(int id){
        repository.deleteById(id);
    }
}
