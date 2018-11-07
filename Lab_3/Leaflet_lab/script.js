var map = L.map('map', {
  'center': [0, 0],
  'zoom': 0,
  'layers': [
    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      'attribution': 'Map data &copy; OpenStreetMap contributors'
    })
  ]
});

var controlLayers = L.control.layers().addTo(map);

var url = 'https://rawgit.com/johan/world.geo.json/master/countries.geo.json';

$.getJSON(url, function (geojson) {
  var geojsonLayer = L.geoJson(geojson, {
    style: function (feature) {
      return {
        'weight': 0,
        'fillColor': 'yellow',
        'fillOpacity': 1
      }
    }
  }).addTo(map);
  controlLayers.addOverlay(geojsonLayer, 'GeoJSON layer 1');
});

$.getJSON(url, function (geojson) {
  var geojsonLayer = L.geoJson(geojson, {
    style: function (feature) {
      return {
        'weight': 1,
        'color': 'red',
        'fillOpacity': 0
      }
    }
  }).addTo(map);
  controlLayers.addOverlay(geojsonLayer, 'GeoJSON layer 2');
});