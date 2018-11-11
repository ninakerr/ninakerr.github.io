var map = L.map('map', {
  'center': [26.6, -81.5],
  'zoom': 6,
  'layers': [
    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      'attribution': 'Map data &copy; OpenStreetMap contributors',
    
    })
  ]
});

var controlLayers = L.control.layers().addTo(map);

var url = 'https://opendata.arcgis.com/datasets/f398a70bf5484c83ae072ac40d5910c9_10.geojson';

$.getJSON(url, function (geojson) {
  var geojsonLayer = L.geoJson(geojson, {
    style: function (feature) {
      return {
        'weight': 1,
        'fillColor': 'grey',
          'color': 'red',
        'fillOpacity': 0.6
      }
    }
  }).addTo(map);
  controlLayers.addOverlay(geojsonLayer, 'Congressional District');
});
var url_b = 'https://opendata.arcgis.com/datasets/9c0667c589de45db9e2992945e7bb491_11.geojson';

$.getJSON(url_b, function (geojson) {
  var geojsonLayer = L.geoJson(geojson, {
    style: function (feature) {
      return {
        'weight': 1,
        'fillColor': 'grey',
        'color': 'blue',
        'fillOpacity': 0.6
      }
    }
  }).addTo(map);
  controlLayers.addOverlay(geojsonLayer, 'Senate Districts');
  var marker = L.marker([25.4, -81.1]).addTo(map);
  marker.bindPopup("<b> New House 26 Reresentative:</b><br>Debbie Mucarsel-Powell (D)");
  marker.on('click', onClick);

  function onClick(e) {
   var popup = e.target.getPopup();
   var content = popup.getContent();

   console.log(content);
}
  var marker2 = L.marker([25.69, -80.30]).addTo(map);
  marker2.bindPopup("<b> New House 27 Reresentative:</b> <br>Donna Shalala(D)");

  
}).addTo(map);