package edu.API.ClientsAPI;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/clients")
public class ClientController {

    private ClientService service;

    public ClientController(ClientService service){
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<Client>> getAll() {
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Client> getById(@PathVariable int id) {
        Optional<Client> client = service.findById(id);
        return client.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/age")
    public Integer showClientAge(@PathVariable int id){
        return service.calculateClientAge(id);
    }

    @PostMapping
    public ResponseEntity<Client> add(@RequestBody Client client) {
        return service.addClient(client);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Client> update(@PathVariable int id, @RequestBody Client client) {
        if (service.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        client.setId(id);
        return ResponseEntity.ok(service.save(client));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable int id) {
        if (service.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        service.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
