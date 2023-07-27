var map = L.map('map').setView([0, 0], 2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
}).addTo(map);

var earthquakeDataUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson';

function getMarkerSize(magnitude) {
  return Math.max(4, Math.round(magnitude) * 2);
}

function getMarkerColor(depth) {
  return depth > 70 ? '#d73027' :
         depth > 50 ? '#fc8d59' :
         depth > 30 ? '#fee08b' :
         depth > 10 ? '#d9ef8b' : '#91cf60';
}

fetch(earthquakeDataUrl)
  .then(response => response.json())
  .then(data => {
    data.features.forEach(function (feature) {
      var coordinates = feature.geometry.coordinates;
      var lat = coordinates[1];
      var lng = coordinates[0];
      var magnitude = feature.properties.mag;
      var depth = coordinates[2];

      var marker = L.circleMarker([lat, lng], {
        radius: getMarkerSize(magnitude),
        fillColor: getMarkerColor(depth),
        color: '#000',
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      }).addTo(map);

      marker.bindPopup('<strong>' + feature.properties.title + '</strong><br>Magnitude: ' + magnitude + '<br>Depth: ' + depth + ' km');
    });
  })
  .catch(error => {
    console.log('Error fetching earthquake data:', error);
  });

var legend = L.control({ position: 'bottomright' });

legend.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'legend');
  var depths = [0, 10, 30, 50, 70];
  var labels = ['<strong>Depth (km)</strong>'];

  for (var i = 0; i < depths.length; i++) {
    div.innerHTML +=
      '<i style="background:' + getMarkerColor(depths[i] + 1) + '"></i> ' +
      depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
  }
  div.innerHTML = labels.join('<br>') + div.innerHTML;

  return div;
};

legend.addTo(map);
