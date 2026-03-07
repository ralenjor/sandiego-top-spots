$(document).ready(function () {
// download contents of data.json
    $.getJSON('data.json', function(data){

        // iterate through the locations
        $.each(data, function(index, spot) {

            // pull coordinates from location
            const lat = spot.location[0];
            const lon = spot.location[1];

            // construct map link
            const mapUrl = `https://www.google.com/maps?q=${lat},${lon}`;

            const row = `
                <tr>
                 <td>${spot.name}</td>
                 <td>${spot.description}</td>
                 <td>
                 <a href="${mapUrl}" target="_blank">View on Map</a>
                 </td>
                </tr>

            `;

            $('#top-spots-table tbody').append(row);
        });
    });
 });