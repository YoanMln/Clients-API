# ClientsAPI

Une API RESTful pour gérer les informations des clients, développée avec **Spring Boot 3.5.7** et **Java 17**.

## 📋 Description

ClientsAPI est une application Spring Boot qui fournit une API complète pour créer, lire, mettre à jour et supprimer (CRUD) des informations client. Elle utilise une base de données H2 embarquée et est intégrée à Netflix Eureka pour la découverte de services.

## 🛠 Technologies

- **Java 17**
- **Spring Boot 3.5.7**
- **Spring Data JPA** - ORM pour la gestion des données
- **Spring Web** - Framework pour les API REST
- **H2 Database** - Base de données embarquée
- **Netflix Eureka** - Service de découverte
- **Maven** - Gestionnaire de dépendances

## 📦 Structure du projet

```
ClientsAPI/
├── src/
│   ├── main/
│   │   ├── java/edu/API/ClientsAPI/
│   │   │   ├── Client.java              # Entité Client
│   │   │   ├── ClientController.java    # Contrôleur REST
│   │   │   ├── ClientRepository.java    # Accès aux données
│   │   │   └── ClientsApiApplication.java # Point d'entrée
│   │   └── resources/
│   │       └── application.properties   # Configuration
│   └── test/
│       └── java/edu/API/ClientsAPI/
│           └── ClientsApiApplicationTests.java
├── pom.xml                              # Configuration Maven
└── README.md
```

## 🚀 Démarrage rapide

### Prérequis

- Java 17 ou supérieur
- Maven 3.6+

### Installation et lancement

1. **Clonez ou téléchargez le projet**

2. **Navigez vers le répertoire du projet**
   ```bash
   cd /Users/apple/Desktop/ClientsAPI
   ```

3. **Compilez et lancez l'application**
   ```bash
   ./mvnw spring-boot:run
   ```

   L'application démarrera sur `http://localhost:8080`

4. **Accédez à la base de données H2**
   - URL : `http://localhost:8080/h2-console`
   - JDBC URL : `jdbc:h2:mem:testdb`
   - Utilisateur : `sa`
   - Mot de passe : (laisser vide)

## 📚 Modèle de données

### Client

L'entité `Client` représente un client avec les attributs suivants :

| Champ | Type | Description |
|-------|------|-------------|
| `id` | Integer | Identifiant unique (généré automatiquement) |
| `firstName` | String | Prénom du client |
| `lastName` | String | Nom du client |
| `dateOfBirth` | LocalDate | Date de naissance (format: YYYY-MM-DD) |
| `licenseNumber` | Integer | Numéro de permis |
| `dateOfLicenseObtained` | LocalDate | Date d'obtention du permis (format: YYYY-MM-DD) |

## 🔌 Endpoints API

### Base URL
```
http://localhost:8080/clients
```

### 1. Récupérer tous les clients
```http
GET /clients
```

**Réponse (200 OK):**
```json
[
  {
    "id": 1,
    "firstName": "Jean",
    "lastName": "Dupont",
    "dateOfBirth": "1990-05-15",
    "licenseNumber": 123456,
    "dateOfLicenseObtained": "2015-03-20"
  }
]
```

### 2. Récupérer un client par ID
```http
GET /clients/{id}
```

**Paramètres:**
- `id` (entier) - Identifiant du client

**Réponse (200 OK):**
```json
{
  "id": 1,
  "firstName": "Jean",
  "lastName": "Dupont",
  "dateOfBirth": "1990-05-15",
  "licenseNumber": 123456,
  "dateOfLicenseObtained": "2015-03-20"
}
```

### 3. Créer un nouveau client
```http
POST /clients
```

**Corps de la requête (JSON):**
```json
{
  "firstName": "Bob",
  "lastName": "Bob",
  "dateOfBirth": "1995-11-15",
  "licenseNumber": 111111,
  "dateOfLicenseObtained": "2020-10-10"
}
```

⚠️ **Important:** L'`id` ne doit **pas** être inclus dans la requête. Il est généré automatiquement par la base de données.

**Réponse (201 Created):**
```json
{
  "id": 2,
  "firstName": "Bob",
  "lastName": "Bob",
  "dateOfBirth": "1995-11-15",
  "licenseNumber": 111111,
  "dateOfLicenseObtained": "2020-10-10"
}
```

### 4. Mettre à jour un client
```http
PUT /clients/{id}
```

**Paramètres:**
- `id` (entier) - Identifiant du client à mettre à jour

**Corps de la requête (JSON):**
```json
{
  "firstName": "Jean",
  "lastName": "Martin",
  "dateOfBirth": "1990-05-15",
  "licenseNumber": 123456,
  "dateOfLicenseObtained": "2015-03-20"
}
```

**Réponse (200 OK):**
```json
{
  "id": 1,
  "firstName": "Jean",
  "lastName": "Martin",
  "dateOfBirth": "1990-05-15",
  "licenseNumber": 123456,
  "dateOfLicenseObtained": "2015-03-20"
}
```

### 5. Supprimer un client
```http
DELETE /clients/{id}
```

**Paramètres:**
- `id` (entier) - Identifiant du client à supprimer

**Réponse (204 No Content)** - Pas de corps de réponse

## 📋 Exemples avec cURL

### Créer un client
```bash
curl -X POST http://localhost:8080/clients \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Alice",
    "lastName": "Bernard",
    "dateOfBirth": "1992-03-10",
    "licenseNumber": 654321,
    "dateOfLicenseObtained": "2018-06-15"
  }'
```

### Récupérer tous les clients
```bash
curl http://localhost:8080/clients
```

### Récupérer un client
```bash
curl http://localhost:8080/clients/1
```

### Mettre à jour un client
```bash
curl -X PUT http://localhost:8080/clients/1 \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Alice",
    "lastName": "Durand",
    "dateOfBirth": "1992-03-10",
    "licenseNumber": 654321,
    "dateOfLicenseObtained": "2018-06-15"
  }'
```

### Supprimer un client
```bash
curl -X DELETE http://localhost:8080/clients/1
```

## ⚙️ Configuration

Modifiez le fichier `src/main/resources/application.properties` pour configurer l'application :

```properties
# Port
server.port=8080

# H2 Console
spring.h2.console.enabled=true
spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=

# JPA/Hibernate
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.jpa.hibernate.ddl-auto=create-drop
```

## 🐛 Dépannage

### Erreur : "Violation d'index unique ou clé primaire"
**Cause:** Vous essayez d'insérer un client avec un `id` qui existe déjà.

**Solution:** 
- N'incluez **pas** l'`id` dans la requête POST
- L'`id` est généré automatiquement par la base de données
- Laissez le champ `id` vide

### Erreur : "Eureka client cannot register"
**Cause:** L'application tente de se connecter à un serveur Eureka qui n'existe pas.

**Solution:** 
- C'est un avertissement normal en développement local
- L'API REST fonctionne normalement malgré ce message
- Pour désactiver Eureka, modifiez `application.properties` :
  ```properties
  eureka.client.enabled=false
  ```

## 📝 Codes de statut HTTP

| Code | Signification |
|------|---------------|
| 200 | OK - Requête réussie |
| 201 | Created - Ressource créée |
| 204 | No Content - Suppression réussie |
| 404 | Not Found - Ressource introuvable |
| 500 | Internal Server Error - Erreur serveur |

## 🧪 Tests

Pour exécuter les tests :

```bash
./mvnw test
```



---

**Besoin d'aide ?** Consultez la [documentation Spring Boot](https://spring.io/projects/spring-boot)

