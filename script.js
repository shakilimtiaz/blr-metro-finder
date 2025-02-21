let map = L.map('map').setView([12.9716, 77.5946], 13); // Default to Bangalore

// Add OpenStreetMap tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Markers and Routes
let userMarker, destinationMarker, userMetroMarker, destinationMetroMarker;
let routeLayer;

// Get user's current location
function getCurrentLocation() {
    if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser.");
        return;
    }

    navigator.geolocation.getCurrentPosition(position => {
        const userLat = position.coords.latitude;
        const userLon = position.coords.longitude;
        const userLocation = [userLat, userLon];

        // Add user location marker
        if (userMarker) map.removeLayer(userMarker);
        userMarker = L.marker(userLocation).addTo(map).bindPopup("Your Location").openPopup();
        
        map.setView(userLocation, 14);

        // Find nearest metro to user's location
        findNearestMetro(userLat, userLon, "user");
    }, () => {
        alert("Could not get your location.");
    });
}

// Function to find nearest metro station
function findNearestMetro(lat, lon, type) {
    const overpassQuery = `[out:json];
        node(around:5000,${lat},${lon})["railway"="station"]["subway"="yes"];
        out;`;

    fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`)
        .then(response => response.json())
        .then(data => {
            if (data.elements.length === 0) {
                alert("No metro stations found nearby.");
                return;
            }

            const nearestMetro = data.elements[0];
            const metroLocation = [nearestMetro.lat, nearestMetro.lon];

            if (type === "user") {
                if (userMetroMarker) map.removeLayer(userMetroMarker);
                userMetroMarker = L.marker(metroLocation).addTo(map)
                    .bindPopup(`Nearest Metro: ${nearestMetro.tags.name || "Unknown"}`).openPopup();

                drawRoute([lat, lon], metroLocation);
            } else if (type === "destination") {
                if (destinationMetroMarker) map.removeLayer(destinationMetroMarker);
                destinationMetroMarker = L.marker(metroLocation).addTo(map)
                    .bindPopup(`Destination Metro: ${nearestMetro.tags.name || "Unknown"}`).openPopup();

                drawRoute(metroLocation, [lat, lon]);
            }
        })
        .catch(error => console.error("Error:", error));
}

// Find nearest metro station to a manually entered destination
function findDestinationMetro() {
    const destinationInput = document.getElementById("destinationInput").value;

    if (!destinationInput) {
        alert("Please enter a destination.");
        return;
    }

    // Convert destination to coordinates using Nominatim API
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${destinationInput}`)
        .then(response => response.json())
        .then(data => {
            if (data.length === 0) {
                alert("Location not found!");
                return;
            }

            const destLat = data[0].lat;
            const destLon = data[0].lon;
            const destinationLocation = [destLat, destLon];

            // Add destination marker
            if (destinationMarker) map.removeLayer(destinationMarker);
            destinationMarker = L.marker(destinationLocation).addTo(map)
                .bindPopup(`Destination: ${destinationInput}`).openPopup();

            map.setView(destinationLocation, 14);

            // Find nearest metro station to destination
            findNearestMetro(destLat, destLon, "destination");
        })
        .catch(error => console.error("Error:", error));
}

// Draw route between two points
function drawRoute(start, end) {
    const routeURL = `https://routing.openstreetmap.de/routed-foot/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`;

    fetch(routeURL)
        .then(response => response.json())
        .then(data => {
            if (routeLayer) map.removeLayer(routeLayer);

            routeLayer = L.geoJSON(data.routes[0].geometry, { color: 'blue' }).addTo(map);
        })
        .catch(error => console.error("Error:", error));
}