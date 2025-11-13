package edu.API.ClientsAPI;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/clients")
public class ClientController {
    @Autowired
    private ClientRepository repository;

    @GetMapping
    public ResponseEntity<List<Client>> getAll() {
        return ResponseEntity.ok(repository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Client> getById(@PathVariable int id) {
        Optional<Client> client = repository.findById(id);
        return client.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Client> add(@RequestBody Client client) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(repository.save(client));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Client> update(@PathVariable int id, @RequestBody Client client) {
        if (!repository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        client.setId(id);
        return ResponseEntity.ok(repository.save(client));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable int id) {
        if (!repository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
