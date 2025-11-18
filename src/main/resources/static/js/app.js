const API_URL_Clients = "http://localhost:8083/clients";
const API_URL_Reservations = "http://localhost:8082/reservations";
const API_URL_Vehicles = "http://localhost:8081/vehicles";

let allClients = [];
let filteredClients = [];
let currentFilter = "all";

const elements = {
  loading: document.getElementById("loading"),
  errorMessage: document.getElementById("errorMessage"),
  errorText: document.getElementById("errorText"),
  retryBtn: document.getElementById("retryBtn"),
  emptyState: document.getElementById("emptyState"),
  clientsTable: document.getElementById("clientsTable"),
  clientsTableBody: document.getElementById("clientsTableBody"),
  searchInput: document.getElementById("searchInput"),
  refreshBtn: document.getElementById("refreshBtn"),
  addClientBtn: document.getElementById("addClientBtn"),
  totalClients: document.getElementById("totalClients"),
  withLicense: document.getElementById("withLicense"),
  under18: document.getElementById("under18"),
  modal: document.getElementById("clientModal"),
  modalTitle: document.getElementById("modalTitle"),
  clientDetails: document.getElementById("clientDetails"),
  closeModal: document.querySelector(".close"),
};

document.addEventListener("DOMContentLoaded", function () {
  initializeApp();
});



function initializeApp() {
  setupEventListeners();
  loadClients();
}

function setupEventListeners() {
  elements.refreshBtn.addEventListener("click", loadClients);

  elements.retryBtn.addEventListener("click", loadClients);

  elements.searchInput.addEventListener("input", handleSearch);

  const filterButtons = document.querySelectorAll(".filter-btn");
  filterButtons.forEach((btn) => {
    btn.addEventListener("click", handleFilter);
  });

  elements.closeModal.addEventListener("click", closeModal);
  window.addEventListener("click", function (event) {
    if (event.target === elements.modal) {
      closeModal();
    }
  });

  elements.addClientBtn.addEventListener("click", function () {
    alert("Fonctionnalité d'ajout de client à implémenter");
  });
}

function goToVehicles() {
  window.open(
    "http://127.0.0.1:5500/src/main/resources/static/index.html",
    "_blank"
  );
}

function goToReservation() {
    window.open(
      "http://127.0.0.1:5501/src/main/resources/static/index.html",
      "_blank"
    );
  }

async function loadClients() {
  showLoading();
  hideError();
  hideEmptyState();

  try {
    const response = await fetch(API_URL_Clients);

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const clients = await response.json();
    allClients = clients;
    filteredClients = clients;

    hideLoading();

    if (clients.length === 0) {
      showEmptyState();
    } else {
      displayClients();
      updateStats();
    }
  } catch (error) {
    console.error("Erreur lors du chargement des clients:", error);
    hideLoading();
    showError(`Erreur lors du chargement des clients: ${error.message}`);
  }
}

function showLoading() {
  elements.loading.style.display = "block";
  elements.clientsTable.style.display = "none";
}

function hideLoading() {
  elements.loading.style.display = "none";
  elements.clientsTable.style.display = "table";
}

function showError(message) {
  elements.errorText.textContent = message;
  elements.errorMessage.style.display = "flex";
  elements.clientsTable.style.display = "none";
}

function hideError() {
  elements.errorMessage.style.display = "none";
}

function showEmptyState() {
  elements.emptyState.style.display = "block";
  elements.clientsTable.style.display = "none";
}

function hideEmptyState() {
  elements.emptyState.style.display = "none";
}

function displayClients() {
  elements.clientsTableBody.innerHTML = "";

  filteredClients.forEach((client) => {
    const row = createClientRow(client);
    elements.clientsTableBody.appendChild(row);
  });
}

function createClientRow(client) {
  const row = document.createElement("tr");
  const age = calculateAge(client.dateOfBirth);
  const isMinor = age < 18;
  const hasLicense =
    client.licenseNumber !== null && client.licenseNumber !== undefined;

  row.innerHTML = `
        <td>${client.id}</td>
        <td>${client.firstName}</td>
        <td>${client.lastName}</td>
        <td>${formatDate(client.dateOfBirth)}</td>
        <td>
            <span class="age-badge ${isMinor ? "minor" : "adult"}">
                ${age} ans
            </span>
        </td>
        <td>
            ${
              hasLicense
                ? `<span class="license-badge has-license">${client.licenseNumber}</span>`
                : `<span class="license-badge no-license">Aucun</span>`
            }
        </td>
        <td>${
          client.dateOfLicenseObtained
            ? formatDate(client.dateOfLicenseObtained)
            : "-"
        }</td>
        <td>
            <div class="action-buttons">
                <button class="btn btn-sm btn-primary" onclick="viewClient(${
                  client.id
                })">
                    <i class="fas fa-eye"></i> Voir
                </button>
                <button class="btn btn-sm btn-secondary" onclick="editClient(${
                  client.id
                })">
                    <i class="fas fa-edit"></i> Modifier
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteClient(${
                  client.id
                })">
                    <i class="fas fa-trash"></i> Supprimer
                </button>
            </div>
        </td>
    `;

  return row;
}

function calculateAge(dateOfBirth) {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
}

function formatDate(dateString) {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR");
}

function updateStats() {
  const total = allClients.length;
  const withLicenseCount = allClients.filter(
    (client) =>
      client.licenseNumber !== null && client.licenseNumber !== undefined
  ).length;
  const under18Count = allClients.filter(
    (client) => calculateAge(client.dateOfBirth) < 18
  ).length;

  elements.totalClients.textContent = total;
  elements.withLicense.textContent = withLicenseCount;
  elements.under18.textContent = under18Count;
}

function handleSearch(event) {
  const searchTerm = event.target.value.toLowerCase();

  if (searchTerm === "") {
    filteredClients = filterClientsByCurrentFilter(allClients);
  } else {
    const searchResults = allClients.filter(
      (client) =>
        client.firstName.toLowerCase().includes(searchTerm) ||
        client.lastName.toLowerCase().includes(searchTerm) ||
        client.id.toString().includes(searchTerm) ||
        (client.licenseNumber &&
          client.licenseNumber.toString().includes(searchTerm))
    );
    filteredClients = filterClientsByCurrentFilter(searchResults);
  }

  displayClients();

  if (filteredClients.length === 0 && allClients.length > 0) {
    elements.clientsTableBody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: 2rem; color: var(--gray-500);">
                    <i class="fas fa-search"></i><br>
                    Aucun client trouvé pour cette recherche
                </td>
            </tr>
        `;
  }
}

function handleFilter(event) {
  document
    .querySelectorAll(".filter-btn")
    .forEach((btn) => btn.classList.remove("active"));
  event.target.classList.add("active");

  currentFilter = event.target.dataset.filter;

  const searchTerm = elements.searchInput.value.toLowerCase();
  let clientsToFilter = allClients;

  if (searchTerm !== "") {
    clientsToFilter = allClients.filter(
      (client) =>
        client.firstName.toLowerCase().includes(searchTerm) ||
        client.lastName.toLowerCase().includes(searchTerm) ||
        client.id.toString().includes(searchTerm) ||
        (client.licenseNumber &&
          client.licenseNumber.toString().includes(searchTerm))
    );
  }

  filteredClients = filterClientsByCurrentFilter(clientsToFilter);
  displayClients();
}

function filterClientsByCurrentFilter(clients) {
  switch (currentFilter) {
    case "with-license":
      return clients.filter(
        (client) =>
          client.licenseNumber !== null && client.licenseNumber !== undefined
      );
    case "without-license":
      return clients.filter(
        (client) =>
          client.licenseNumber === null || client.licenseNumber === undefined
      );
    case "under-18":
      return clients.filter((client) => calculateAge(client.dateOfBirth) < 18);
    default:
      return clients;
  }
}

async function viewClient(clientId) {
  const client = allClients.find((c) => c.id === clientId);
  if (!client) return;

  const age = calculateAge(client.dateOfBirth);
  const hasLicense =
    client.licenseNumber !== null && client.licenseNumber !== undefined;

  elements.modalTitle.textContent = `Détails du Client #${client.id}`;

  elements.clientDetails.innerHTML = `
        <div class="client-detail-grid">
            <div class="client-detail-item">
                <div class="client-detail-label">ID</div>
                <div class="client-detail-value">${client.id}</div>
            </div>
            <div class="client-detail-item">
                <div class="client-detail-label">Prénom</div>
                <div class="client-detail-value">${client.firstName}</div>
            </div>
            <div class="client-detail-item">
                <div class="client-detail-label">Nom</div>
                <div class="client-detail-value">${client.lastName}</div>
            </div>
            <div class="client-detail-item">
                <div class="client-detail-label">Date de Naissance</div>
                <div class="client-detail-value">${formatDate(
                  client.dateOfBirth
                )}</div>
            </div>
            <div class="client-detail-item">
                <div class="client-detail-label">Âge</div>
                <div class="client-detail-value">
                    <span class="age-badge ${age < 18 ? "minor" : "adult"}">
                        ${age} ans
                    </span>
                </div>
            </div>
            <div class="client-detail-item">
                <div class="client-detail-label">Numéro de Permis</div>
                <div class="client-detail-value">
                    ${
                      hasLicense
                        ? `<span class="license-badge has-license">${client.licenseNumber}</span>`
                        : `<span class="license-badge no-license">Aucun permis</span>`
                    }
                </div>
            </div>
            <div class="client-detail-item">
                <div class="client-detail-label">Date d'Obtention du Permis</div>
                <div class="client-detail-value">
                    ${
                      client.dateOfLicenseObtained
                        ? formatDate(client.dateOfLicenseObtained)
                        : "N/A"
                    }
                </div>
            </div>
        </div>
        
        <div class="reservations-section-modal">
            <h3><i class="fas fa-calendar-alt"></i> Véhicules Réservés</h3>
            <div class="loading-reservations">
                <div class="spinner"></div>
                <p>Chargement des réservations...</p>
            </div>
        </div>
    `;

  elements.modal.style.display = "block";

  try {
    const reservations = await loadClientReservations(clientId);
    const reservationsWithVehicles = await loadVehicleDetails(reservations);
    displayClientReservations(reservationsWithVehicles);
  } catch (error) {
    displayReservationsError(error.message);
  }
}

async function loadClientReservations(clientId) {
  try {
    console.log(
      `Tentative de chargement des réservations pour le client ${clientId}`
    );

    const response = await fetch(`${API_URL_Reservations}`);

    if (!response.ok) {
      console.warn(
        `Service réservations indisponible (${response.status}), utilisation de données de test`
      );
      return getTestReservations(clientId);
    }

    const allReservations = await response.json();

    const clientReservations = allReservations.filter(
      (reservation) => reservation.clientId === clientId
    );
    console.log(
      `${clientReservations.length} réservations trouvées pour le client ${clientId}`
    );
    return clientReservations;
  } catch (error) {
    console.warn(
      "Service réservations non disponible, utilisation de données de test:",
      error.message
    );
    return getTestReservations(clientId);
  }
}

async function loadVehicleDetails(reservations) {
  const reservationsWithVehicles = [];

  for (const reservation of reservations) {
    try {
      console.log(
        `Chargement du véhicule avec plaque ${reservation.vehicleLicensePlate}`
      );

      const vehiclesResponse = await fetch(`${API_URL_Vehicles}`);

      if (vehiclesResponse.ok) {
        const allVehicles = await vehiclesResponse.json();

        const vehicle = allVehicles.find(
          (v) => v.licensePlate === reservation.vehicleLicensePlate
        );

        if (vehicle) {
          reservationsWithVehicles.push({
            ...reservation,
            vehicle: vehicle,
          });
        } else {
          console.warn(
            `Véhicule avec plaque ${reservation.vehicleLicensePlate} non trouvé`
          );
          reservationsWithVehicles.push({
            ...reservation,
            vehicle: {
              brand: "Non trouvé",
              model: "Non trouvé",
              year: "N/A",
              licensePlate: reservation.vehicleLicensePlate,
              color: "N/A",
            },
          });
        }
      } else {
        console.warn(
          `Service véhicules indisponible, utilisation de données de test`
        );
        reservationsWithVehicles.push({
          ...reservation,
          vehicle: getTestVehicleByPlate(reservation.vehicleLicensePlate),
        });
      }
    } catch (error) {
      console.warn(
        `Erreur lors du chargement du véhicule ${reservation.vehicleLicensePlate}, utilisation de données de test:`,
        error.message
      );
      reservationsWithVehicles.push({
        ...reservation,
        vehicle: getTestVehicleByPlate(reservation.vehicleLicensePlate),
      });
    }
  }

  return reservationsWithVehicles;
}

function getTestReservations(clientId) {
  return [
    {
      id: 1,
      clientId: clientId,
      vehicleLicensePlate: "AB-123-CD",
      startDate: "2024-01-15",
      endDate: "2024-01-20",
      price: 350.0,
      km: 200,
    },
    {
      id: 2,
      clientId: clientId,
      vehicleLicensePlate: "EF-456-GH",
      startDate: "2024-02-10",
      endDate: "2024-02-15",
      price: 280.0,
      km: 150,
    },
  ];
}

function getTestVehicleByPlate(licensePlate) {
  const testVehicles = {
    "AB-123-CD": {
      brand: "Renault",
      model: "Clio",
      color: "Blue",
      licensePlate: "AB-123-CD",
      hp: 90,
    },
    "EF-456-GH": {
      brand: "Toyota",
      model: "Corolla",
      color: "Rouge",
      licensePlate: "EF-456-GH",
      hp: 120,
    },
  };

  return (
    testVehicles[licensePlate] || {
      brand: "Véhicule Test",
      model: "Modèle Test",
      color: "Gris",
      licensePlate: licensePlate,
      hp: 100,
    }
  );
}

function getTestVehicle(vehicleId) {
  const testVehicles = {
    1: {
      brand: "Toyota",
      model: "Corolla",
      color: "Blanc",
      licensePlate: "AB-123-CD",
      hp: 120,
    },
    2: {
      brand: "Renault",
      model: "Clio",
      color: "Rouge",
      licensePlate: "EF-456-GH",
      hp: 90,
    },
    3: {
      brand: "Volkswagen",
      model: "Golf",
      color: "Bleu",
      licensePlate: "IJ-789-KL",
      hp: 110,
    },
  };

  return (
    testVehicles[vehicleId] || {
      brand: "Véhicule Test",
      model: "Modèle Test",
      color: "Gris",
      licensePlate: "XX-000-XX",
      hp: 100,
    }
  );
}

function displayClientReservations(reservations) {
  const reservationsContainer = document.querySelector(
    ".reservations-section-modal"
  );

  if (reservations.length === 0) {
    reservationsContainer.innerHTML = `
      <h3><i class="fas fa-calendar-alt"></i> Véhicules Réservés</h3>
      <div class="no-reservations">
        <i class="fas fa-calendar-times"></i>
        <p>Aucune réservation trouvée pour ce client</p>
      </div>
    `;
    return;
  }

  const hasRealData = reservations.some(
    (r) =>
      r.vehicle &&
      (r.vehicle.brand === "Renault" ||
        r.vehicle.brand === "Mercedes" ||
        r.vehicle.brand === "Yamaha")
  );

  const dataSourceInfo = !hasRealData
    ? `
    <div class="test-data-warning">
      <i class="fas fa-info-circle"></i>
      <span>Données de démonstration - Services réservations/véhicules non connectés</span>
    </div>
  `
    : "";

  const reservationsHTML = reservations
    .map(
      (reservation) => `
    <div class="reservation-card">
      <div class="reservation-header">
        <div class="reservation-id">
          <strong>Réservation #${reservation.id}</strong>
          <span class="reservation-status confirmed">
            Réservée
          </span>
        </div>
        <div class="reservation-dates">
          ${formatDate(reservation.startDate)} → ${formatDate(
        reservation.endDate
      )}
        </div>
      </div>
      
      <div class="vehicle-details">
        <div class="vehicle-info">
          <h4><i class="fas fa-car"></i> Détails du Véhicule</h4>
          <div class="vehicle-grid">
            <div class="vehicle-detail">
              <span class="label">Marque:</span>
              <span class="value">${reservation.vehicle.brand}</span>
            </div>
            <div class="vehicle-detail">
              <span class="label">Modèle:</span>
              <span class="value">${reservation.vehicle.model}</span>
            </div>
            <div class="vehicle-detail">
              <span class="label">Couleur:</span>
              <span class="value">${reservation.vehicle.color || "N/A"}</span>
            </div>
            <div class="vehicle-detail">
              <span class="label">Plaque:</span>
              <span class="value">${reservation.vehicle.licensePlate}</span>
            </div>
            ${
              reservation.vehicle.hp
                ? `
              <div class="vehicle-detail">
                <span class="label">Puissance:</span>
                <span class="value">${reservation.vehicle.hp} CV</span>
              </div>
            `
                : ""
            }
            ${
              reservation.price
                ? `
              <div class="vehicle-detail">
                <span class="label">Prix:</span>
                <span class="value price">${reservation.price.toFixed(
                  2
                )}€</span>
              </div>
            `
                : ""
            }
            ${
              reservation.km
                ? `
              <div class="vehicle-detail">
                <span class="label">Kilométrage:</span>
                <span class="value">${reservation.km} km</span>
              </div>
            `
                : ""
            }
          </div>
        </div>
      </div>
    </div>
  `
    )
    .join("");

  reservationsContainer.innerHTML = `
    <h3><i class="fas fa-calendar-alt"></i> Véhicules Réservés (${reservations.length})</h3>
    ${dataSourceInfo}
    <div class="reservations-list">
      ${reservationsHTML}
    </div>
  `;
}

function displayReservationsError(errorMessage) {
  const reservationsContainer = document.querySelector(
    ".reservations-section-modal"
  );
  reservationsContainer.innerHTML = `
    <h3><i class="fas fa-calendar-alt"></i> Véhicules Réservés</h3>
    <div class="error-reservations">
      <i class="fas fa-exclamation-triangle"></i>
      <p>Erreur lors du chargement des réservations: ${errorMessage}</p>
    </div>
  `;
}

function getStatusLabel(status) {
  switch (status.toLowerCase()) {
    case "pending":
      return "En attente";
    case "confirmed":
      return "Confirmée";
    case "cancelled":
      return "Annulée";
    case "completed":
      return "Terminée";
    case "active":
      return "Active";
    default:
      return status;
  }
}

function editClient(clientId) {
  alert(`Fonctionnalité de modification du client ${clientId} à implémenter`);
}

async function deleteClient(clientId) {
  const client = allClients.find((c) => c.id === clientId);
  if (!client) return;

  const confirmed = confirm(
    `Êtes-vous sûr de vouloir supprimer le client ${client.firstName} ${client.lastName} ?`
  );

  if (confirmed) {
    try {
      const response = await fetch(`${API_URL_Clients}/${clientId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        loadClients();
        alert("Client supprimé avec succès");
      } else {
        throw new Error(`Erreur lors de la suppression: ${response.status}`);
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      alert(`Erreur lors de la suppression: ${error.message}`);
    }
  }
}

function closeModal() {
  elements.modal.style.display = "none";
}

window.refreshData = loadClients;
window.getClientsData = () => allClients;
