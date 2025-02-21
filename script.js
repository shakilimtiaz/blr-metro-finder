// Initialize the map
let map = L.map('map').setView([12.9716, 77.5946], 13); // Default center at Bangalore

// Add OpenStreetMap tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Markers and Routes
let userMarker, destinationMarker, userMetroMarker, destinationMetroMarker, routeLayer;

// 📌 Bangalore Metro Stations (Updated List)
const metroStations = {
    purple: [
        { name: "Challaghatta", lat: 12.9230, lon: 77.4693 },
        { name: "Kengeri", lat: 12.9243, lon: 77.4696 },
        { name: "Kengeri Bus Terminal", lat: 12.9271, lon: 77.4867 },
        { name: "Pattanagere", lat: 12.9362, lon: 77.5007 },
        { name: "Jnana Bharathi", lat: 12.9466, lon: 77.5101 },
        { name: "Rajarajeshwari Nagara", lat: 12.9534, lon: 77.5162 },
        { name: "Pantharapalya - Nayandahalli", lat: 12.9616, lon: 77.5232 },
        { name: "Mysuru Road", lat: 12.9584, lon: 77.5179 },
        { name: "Deepanjali Nagara", lat: 12.9673, lon: 77.5296 },
        { name: "Attiguppe", lat: 12.9695, lon: 77.5379 },
        { name: "Vijayanagara", lat: 12.9735, lon: 77.5462 },
        { name: "Sri Balagangadharanatha Swamiji Station, Hosahalli", lat: 12.9743, lon: 77.5531 },
        { name: "Magadi Road", lat: 12.9786, lon: 77.5604 },
        { name: "Krantivira Sangolli Rayanna Railway Station", lat: 12.9764, lon: 77.5706 },
        { name: "Nadaprabhu Kempegowda Station, Majestic", lat: 12.9777, lon: 77.5713 },
        { name: "Sir M. Visveshwaraya Station, Central College", lat: 12.9794, lon: 77.5785 },
        { name: "Dr. BR. Ambedkar Station, Vidhana Soudha", lat: 12.9790, lon: 77.5862 },
        { name: "Cubbon Park", lat: 12.9794, lon: 77.5932 },
        { name: "Mahatma Gandhi Road", lat: 12.9745, lon: 77.6192 },
        { name: "Trinity", lat: 12.9753, lon: 77.6182 },
        { name: "Halasuru", lat: 12.9770, lon: 77.6283 },
        { name: "Indiranagar", lat: 12.9782, lon: 77.6406 },
        { name: "Swami Vivekananda Road", lat: 12.9883, lon: 77.6415 },
        { name: "Baiyappanahalli", lat: 12.9905, lon: 77.6492 },
    ],
    green: [
        { name: "Madavara", lat: 13.0671, lon: 77.5179 },
        { name: "Chikkabidarakallu", lat: 13.0592, lon: 77.5192 },
        { name: "Manjunathanagara", lat: 13.0521, lon: 77.5199 },
        { name: "Nagasandra", lat: 13.0641, lon: 77.5164 },
        { name: "Dasarahalli", lat: 13.0447, lon: 77.5198 },
        { name: "Jalahalli", lat: 13.0392, lon: 77.5190 },
        { name: "Peenya Industry", lat: 13.0384, lon: 77.5118 },
        { name: "Peenya", lat: 13.0348, lon: 77.5059 },
        { name: "Goraguntepalya", lat: 13.0265, lon: 77.5026 },
        { name: "Yeshwanthpur", lat: 13.0171, lon: 77.5544 },
        { name: "Sandal Soap Factory", lat: 13.0072, lon: 77.5541 },
        { name: "Mahalakshmi", lat: 13.0013, lon: 77.5535 },
        { name: "Rajajinagara", lat: 12.9953, lon: 77.5529 },
        { name: "Mahakavi Kuvempu Road", lat: 12.9914, lon: 77.5523 },
        { name: "Srirampura", lat: 12.9876, lon: 77.5515 },
        { name: "Mantri Square Sampige Road", lat: 12.9837, lon: 77.5507 },
        { name: "Nadaprabhu Kempegowda Station, Majestic", lat: 12.9777, lon: 77.5713 },
        { name: "Chikkapete", lat: 12.9678, lon: 77.5746 },
        { name: "Krishna Rajendra Market", lat: 12.9650, lon: 77.5784 },
        { name: "National College", lat: 12.9578, lon: 77.5813 },
        { name: "Lalbagh", lat: 12.9555, lon: 77.5843 },
        { name: "South End Circle", lat: 12.9456, lon: 77.5889 },
        { name: "Jayanagara", lat: 12.9252, lon: 77.5939 },
        { name: "Rashtreeya Vidyalaya Road", lat: 12.9162, lon: 77.5958 },
        { name: "Banashankari", lat: 12.9185, lon: 77.5738 },
        { name: "Jayaprakash Nagara", lat: 12.9027, lon: 77.5715 },
        { name: "Yelachenahalli", lat: 12.8805, lon: 77.5695 },
        { name: "Konanakunte Cross", lat: 12.8678, lon: 77.5675 },
        { name: "Doddakallasandra", lat: 12.8556, lon: 77.5649 },
        { name: "Vajarahalli", lat: 12.8465, lon: 77.5643 },
        { name: "Thalaghattapura", lat: 12.8382, lon: 77.5638 },
        { name: "Silk Institute", lat: 12.8356, lon: 77.5649 },
    ],
};

// 📌 Enable Autocomplete Search with Location Suggestions (Restrict to Bangalore)
let searchBox = document.getElementById("locationInput");
searchBox.addEventListener("input", function () {
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${searchBox.value}&countrycodes=IN&bounded=1&viewbox=77.3,13.5,78.0,12.5&limit=5`)
        .then(response => response.json())
        .then(data => {
            let dropdown = document.createElement("ul");
            dropdown.setAttribute("id", "autocomplete-dropdown");
            dropdown.innerHTML = "";

            data.forEach(place => {
                let item = document.createElement("li");
                item.textContent = place.display_name;
                item.addEventListener("click", function () {
                    searchBox.value = place.display_name;
                    document.body.removeChild(dropdown);
                });
                dropdown.appendChild(item);
            });

            let existingDropdown = document.getElementById("autocomplete-dropdown");
            if (existingDropdown) document.body.removeChild(existingDropdown);
            document.body.appendChild(dropdown);
        });
});

// 📌 Get User's Current Location
function getCurrentLocation() {
    if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser.");
        return;
    }

    navigator.geolocation.getCurrentPosition(position => {
        const userLat = position.coords.latitude;
        const userLon = position.coords.longitude;
        const userLocation = [userLat, userLon];

        if (userMarker) map.removeLayer(userMarker);
        userMarker = L.marker(userLocation).addTo(map).bindPopup("Your Location").openPopup();
        map.setView(userLocation, 14);

        findNearestMetro(userLat, userLon, "user");
    }, () => {
        alert("Could not get your location.");
    });
}

// 📌 Find Nearest Metro Station
function findNearestMetro(lat, lon, type) {
    let nearest = null;
    let minDistance = Infinity;

    let allStations = [...metroStations.purple, ...metroStations.green];

    allStations.forEach(station => {
        let distance = getDistanceFromLatLonInKm(lat, lon, station.lat, station.lon);
        if (distance < minDistance) {
            minDistance = distance;
            nearest = station;
        }
    });

    if (nearest) {
        let metroLocation = [nearest.lat, nearest.lon];

        if (type === "user") {
            if (userMetroMarker) map.removeLayer(userMetroMarker);
            userMetroMarker = L.marker(metroLocation).addTo(map)
                .bindPopup(`Nearest Metro: ${nearest.name}`).openPopup();
            
            drawRoute([lat, lon], metroLocation);
        } else if (type === "destination") {
            if (destinationMetroMarker) map.removeLayer(destinationMetroMarker);
            destinationMetroMarker = L.marker(metroLocation).addTo(map)
                .bindPopup(`Nearest Metro: ${nearest.name}`).openPopup();

            drawRoute(metroLocation, [lat, lon]);
        }
    }
}

// 📌 Restrict Locations to Bangalore (100km Rule)
function isLocationInBangalore(lat, lon) {
    let withinRange = false;

    let allStations = [...metroStations.purple, ...metroStations.green];

    allStations.forEach(station => {
        let distance = getDistanceFromLatLonInKm(lat, lon, station.lat, station.lon);
        if (distance <= 100) {
            withinRange = true;
        }
    });

    return withinRange;
}

// 📌 Handle Destination Search
function findDestinationMetro() {
    let destinationInput = document.getElementById("locationInput").value;

    if (!destinationInput) {
        alert("Enter a valid destination.");
        return;
    }

    // Convert destination to coordinates
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${destinationInput}&countrycodes=IN&bounded=1&viewbox=77.3,13.5,78.0,12.5&limit=1`)
        .then(response => response.json())
        .then(data => {
            if (data.length === 0) {
                alert("Location not found!");
                return;
            }

            let destLat = data[0].lat;
            let destLon = data[0].lon;
            let destinationLocation = [destLat, destLon];

            // 🚨 If the location is outside Bangalore, alert user
            if (!isLocationInBangalore(destLat, destLon)) {
                alert("This location is outside Bangalore.");
                return;
            }

            if (destinationMarker) map.removeLayer(destinationMarker);
            destinationMarker = L.marker(destinationLocation).addTo(map)
                .bindPopup(`Destination: ${destinationInput}`).openPopup();
            map.setView(destinationLocation, 14);

            findNearestMetro(destLat, destLon, "destination");
        })
        .catch(error => console.error("Error:", error));
}

// 📌 Draw Route
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

// 📌 Helper function to calculate distance between two coordinates
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of Earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}