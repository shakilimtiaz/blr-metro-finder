// Initialize the map
let map = L.map('map').setView([12.9716, 77.5946], 13); // Default center: Bangalore

// Add OpenStreetMap tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Markers
let userMarker;
let metroMarker;

// Function to find nearest metro station
function findNearestMetro() {
    const locationInput = document.getElementById("locationInput").value;

    if (!locationInput) {
        alert("Please enter a location.");
        return;
    }

    // Convert location input to coordinates using Nominatim API
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${locationInput}`)
        .then(response => response.json())
        .then(data => {
            if (data.length === 0) {
                alert("Location not found!");
                return;
            }

            const userLat = data[0].lat;
            const userLon = data[0].lon;
            const userLocation = [userLat, userLon];

            if (userMarker) userMarker.remove();
            userMarker = L.marker(userLocation).addTo(map).bindPopup("Your Location").openPopup();

            // Move map to user's location
            map.setView(userLocation, 14);

            // Find nearest metro station
            searchMetro(userLat, userLon);
        })
        .catch(error => console.error("Error:", error));
}

// Function to find nearest metro using Overpass API
function searchMetro(userLat, userLon) {
    const overpassQuery = `[out:json];
        node(around:5000,${userLat},${userLon})["railway"="station"]["subway"="yes"];
        out;`;

    fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`)
        .then(response => response.json())
        .then(data => {
            if (data.elements.length === 0) {
                alert("No metro stations found nearby.");
                return;
            }

            // Get nearest metro station
            const nearestMetro = data.elements[0];
            const metroLocation = [nearestMetro.lat, nearestMetro.lon];

            if (metroMarker) metroMarker.remove();
            metroMarker = L.marker(metroLocation).addTo(map)
                .bindPopup(`Nearest Metro: ${nearestMetro.tags.name || "Unknown"}`).openPopup();

            // Draw route using OSRM API
            L.Routing.control({
                waypoints: [L.latLng(userLat, userLon), L.latLng(metroLocation)],
                routeWhileDragging: true
            }).addTo(map);
        })
        .catch(error => console.error("Error:", error));
}