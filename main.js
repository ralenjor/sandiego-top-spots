let allSpots = [];

$(document).ready(function () {
    userLocation();
});

function userLocation(){
if ("geolocation" in navigator){
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const userLat = position.coords.latitude;
            const userLon = position.coords.longitude;  
            processDataWithLocation(userLat, userLon);
        },
        (error) => {
            console.error("Error getting location:", error.message);
            processDataWithLocation(null, null);
        }
    );
} else {
    console.log("Geolocation is not supported by this browser.");
    processDataWithLocation(null, null);
}
}



async function processDataWithLocation(userLat, userLon){
    
    try{
    const response = await fetch('data.json');
    const locations = await response.json();

    const locationsWithDistance = locations.map(spot => {
        let dist = null;
        if (userLat !== null){

            dist = calculateDistance(userLat, userLon, spot.location[0], spot.location[1]);
        }
        return {
            ...spot,
            distance: dist
        };
    });

        locationsWithDistance.sort((a, b) => {

    if (a.distance === null) return 1;
    if (b.distance === null) return -1;
    return a.distance - b.distance;
    });

    allSpots = locationsWithDistance;
    renderTable(allSpots);

} catch (err) {
    console.error("Failed to process data:", err);
    }   
}

function calculateDistance(userLat, userLon, lat, lon){
    const R = 3958.8;
    const dLat = (lat - userLat) * Math.PI / 180;
    const dLon = (lon - userLon) * Math.PI / 180;

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(userLat * Math.PI / 180) * Math.cos(lat * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
    return Math.round((R * c) * 10) / 10;
}

function renderTable(data) {
    console.log('renderTable called with', data.length, 'rows');
    const $tbody = $('#top-spots-table tbody');
    $tbody.empty();
    $.each(data, function(index, spot) {
        const lat = parseFloat(spot.location[0]);
        const lon = parseFloat(spot.location[1]);
        const mapUrl = `https://www.google.com/maps?q=${lat},${lon}`;

        const $name = $('<td>').text(spot.name);
        const $desc = $('<td>').text(spot.description);
        const $dist = $('<td>').html(`<strong>${parseFloat(spot.distance)} miles</strong>`);
        const $btn  = $('<button>').addClass('map-btn').text('View on Map');
        const $map  = $('<td>').append($btn);

        $btn.on('click', function(e) {
            e.stopPropagation();
            console.log('Row clicked:', lat, lon);
            updateRightSideMap(lat, lon);
        });

        const $row = $('<tr>');
        $row.css('cursor', 'pointer');
        $row.on('click', function() {
            console.log('Row clicked:', lat, lon);
            updateRightSideMap(lat, lon);
        });
        $row.append($name, $desc, $dist, $map);
        $tbody.append($row);
    });
}

function updateRightSideMap(lat, lon) {
    const mapIframe = document.getElementById('map-placeholder');
    // Using Google Maps Embed API
    const embedUrl = `https://maps.google.com/maps?q=${lat},${lon}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
    mapIframe.src = embedUrl;
}



