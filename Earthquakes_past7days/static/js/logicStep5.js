//Add console.log to check if code working
console.log("working")

//Create the tile layer that will be the background of map
let streets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    accessToken: API_KEY
});

// Create the tile layer that will be the background of map
let satelliteStreets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    accessToken: API_KEY
});

// Base layer, both maps
let baseMaps = {
  "Streets": streets,
  "Satellite Streets": satelliteStreets
};

//Earthquake layer
let earthquakes = new L.LayerGroup();

//Define object that contains overlays
let overlays = {
  Earthquakes: earthquakes
};

// Create the map object with center, zoom level and default layer, Toronto
let map = L.map('mapid', {
  center: [39.5, -98.5],
  zoom: 3,
  layers: [streets]
})

//Pass map layers into layer control and add the layer control to the map
L.control.layers(baseMaps, overlays).addTo(map);


// Retrieve the earthquake GeoJSON data.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function(data) {


// Returns the style data for each of the earthquakes on the map
// Pass the magnitude of the earthquake into a function
// to calculate radius
function styleInfo(feature) {
  return {
    opacity: 1,
    fillOpacity: 1,
    fillColor: getColor(feature.properties.mag),
    color: "#000000",
    radius: getRadius(),
    stroke: true,
    weight: 0.5
  };
}

//Determines color of circle based on the magnitude
function getColor(magnitude) {
  if (magnitude > 5) {
    return "#ea2c2c";
  }
  if (magnitude > 4) {
    return "#ea822c";
  }
  if (magnitude > 3) {
    return "#ee9c00";
  }
  if (magnitude > 2) {
    return "#eecc00";
  }
  if (magnitude > 1) {
    return "#d4ee00";
  }
  return "#98ee00";
}

//Determines the radius of earthquake marker based on magnitude
//If magnitude of 0 will be plotted with radius of 1
function getRadius(magnitude) {
  if (magnitude === 0) {
    return 1;
  }
  return magnitude * 4;
}

// Creating a GeoJSON layer with the retrieved data.
L.geoJSON(data, {

  // We turn each feature into a circleMarker on the map.
  
  pointToLayer: function(feature, latlng) {
              console.log(data);
              return L.circleMarker(latlng);
          },
        //Set style for each circleMarker
        style: styleInfo,
        onEachFeautre: function(feature, layer){
          layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
        }
      }).addTo(earthquakes);

      //Add earthquakes layer
      earthquakes.addTo(map);

//Legend 
let legend = L.control({
  position: "bottomright"
});


      legend.onAdd = function () {
        let div = L.DomUtil.create("div", "info legend");
      };
        const magnitude = [0, 1, 2, 3, 4, 5];
            const colors = [
              "#98ee00",
              "#d4ee00",
              "#eecc00",
              "#ee9c00",
              "#ea822c",
              "#ea2c2c"
            ];
              


// Looping through our intervals to generate a label with a colored square for each interval.
for (var i = 0; i < magnitudes.length; i++) {
  console.log(colors[i]);
  div.innerHTML +=
    "<i style='background: " + colors[i] + "'></i> " +
    magnitudes[i] + (magnitudes[i + 1] ? "&ndash;" + magnitudes[i + 1] + "<br>" : "+");
}
  return div;

legend.addTo(map);
});

