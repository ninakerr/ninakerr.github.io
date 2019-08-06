// Edit the initial year and number of tabs to match your GeoJSON data and tabs in index.html
var year = "2001";
var tabs = 4;

// Edit the center point and zoom level
var map = L.map('map', {
  center: [36.16, -115.1],
  zoom: 9.7,
  scrollWheelZoom: false
});

// Edit links to your GitHub repo and data source credit
map.attributionControl
.setPrefix('View <a href="http://github.com/jackdougherty/leaflet-map-polygon-tabs">data and code on GitHub</a>, created with <a href="http://leafletjs.com" title="A JS library for interactive maps">Leaflet</a>; design by <a href="http://ctmirror.org">CT Mirror</a>');

// Basemap layer
new L.tileLayer('http://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
}).addTo(map);

// Edit to upload GeoJSON data file from your local directory
$.getJSON("vegas_new_2.json", function (data) {
  geoJsonLayer = L.geoJson(data, {
    style: style,
    onEachFeature: onEachFeature
  }).addTo(map);
});

// Edit range cutoffs and colors to match your data; see http://colorbrewer.org
// Any values not listed in the ranges below displays as the last color
function getColor(d) {
  return d > 300000? '#0c2c84' :
         d > 270000? '#225ea8' :
         d > 220000? '#1d91c0' :
         d > 170000? '#41b6c4' :
         d > 120000 ? '#7fcdbb' :
         d > 80000 ? '#c7e9b4' :
         d > 50000 ? '#ffffcc' :
         d > 0 ? '#feebe2' :
                   'white' ;
}

// Edit the getColor property to match data properties in your GeoJSON file
// In this example, columns follow this pattern: index1910, index1920...
function style(feature) {
  return {
    fillColor: getColor(feature.properties["index" + year]),
    weight: 1,
    opacity: 1,
    color: 'black',
    fillOpacity: 0.8
  };
}

// This highlights the polygon on hover, also for mobile
function highlightFeature(e) {
  resetHighlight(e);
  var layer = e.target;
  layer.setStyle({
    weight: 4,
    color: 'black',
    fillOpacity: 0.7
  });
  info.update(layer.feature.properties);
}

// This resets the highlight after hover moves away
function resetHighlight(e) {
  geoJsonLayer.setStyle(style);
  info.update();
}

// This instructs highlight and reset functions on hover movement
function onEachFeature(feature, layer) {
  layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlight,
    click: highlightFeature
  });
}

// Creates an info box on the map
var info = L.control();
info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
};

// Edit info box labels (such as props.town) to match properties of the GeoJSON data
info.update = function (props) {
  var winName =
  this._div.innerHTML = (props ?
    '<div class="areaName">' + props.ZIP_Code + '</div>' : '<div class="areaName faded"><small>Hover over areas<br>Click tabs or arrow keys</small></div>') + '<div class="areaLabel"><div class="areaValue"> Zillow Housing Value Index: <b>single-family homes</b></div>' +(props ? '$' + (checkNull(props["index" + year])) : '--') + '</div>';
};
info.addTo(map);

// When a new tab is selected, this changes the year displayed
$(".tabItem").click(function() {
  $(".tabItem").removeClass("selected");
  $(this).addClass("selected");
  year = $(this).html();
  // year = $(this).html().split("-")[1];  /* use for school years, eg 2010-11 */
  geoJsonLayer.setStyle(style);
});

// Edit grades in legend to match the range cutoffs inserted above
var legend = L.control({position: 'bottomright'});
legend.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'info legend'),
    grades = [50000, 80000, 120000, 170000, 220000, 270000, 300000],
    labels = [],
    from, to;
  for (var i = 0; i < grades.length; i++) {
    from = grades[i];
    to = grades[i + 1];
    // manually inserted from + 0.1 to start one step above default 0 = white color
    labels.push(
      '<i style="background:' + getColor(from + 0.1) + '"></i> ' +
      from + (to ? '&ndash;' + to : '+'));
  }
  div.innerHTML = labels.join('<br>');
  return div;
};
legend.addTo(map);

// In info.update, this checks if GeoJSON data contains a null value, and if so displays "--"
function checkNull(val) {
  if (val != null || val == "NaN") {
    return comma(val);
  } else {
    return "--";
  }
}

// Use in info.update if GeoJSON data needs to be displayed as a percentage
function checkThePct(a,b) {
  if (a != null && b != null) {
    return Math.round(a/b*1000)/10 + "%";
  } else {
    return "--";
  }
}

// Use in info.update if GeoJSON data needs to be displayed with commas (such as 123,456)
function comma(val){
  while (/(\d+)(\d{3})/.test(val.toString())){
    val = val.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
  }
  return val;
}

// This watches for arrow keys to advance the tabs
$("body").keydown(function(e) {
    var selectedTab = parseInt($(".selected").attr('id').replace('tab', ''));
    var nextTab;

    // previous tab with left arrow
    if (e.keyCode == 37) {
        nextTab = (selectedTab == 1) ? tabs : selectedTab - 1;
    }
    // next tab with right arrow
    else if (e.keyCode == 39)  {
        nextTab = (selectedTab == tabs) ? 1 : selectedTab + 1;
    }

    $('#tab' + nextTab).click();
});
