//Creating the map project
let myMap = L.map('map').setView([37.09, -95.71], 3);

//To add the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

//Setting our api urls based on what we want to display (Past 7 Days All Day)
const url="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"


//Calling the api with d3 to get the data.
d3.json(url).then(function(data){
  //create a leaflet layer group
  let earthquakes = L.layerGroup();
  
  //Looping through the features in the data
  data.features.forEach(function(feature) {
    //To get the coordinates of the earthquake
    let coordinates = feature.geometry.coordinates;
    let lat = coordinates[1];
    let lng = coordinates[0];
    let depth = coordinates[2];
    
    //Getting the depth of the earthquake
    let magnitude = feature.properties.mag;
    
    //Create a bubble marker for the earthquake
    let marker = L.circleMarker([lat, lng], {
      radius: magnitude * 3,
      color: '#000',
      weight: 1,
      fillColor: getColor(depth),
      fillOpacity: 0.7
    });
    
    //Creating popup to the marker with information about the earthquake
    marker.bindPopup(`<strong>Location:</strong> ${feature.properties.place}<br>
      <strong>Magnitude:</strong> ${magnitude}<br>
      <strong>Depth:</strong> ${depth} km`);
    
    //Adding the marker to the layer group earthquakes 
    marker.addTo(earthquakes);
  });
  
  //Adding the layer group to the map
  earthquakes.addTo(myMap);

  //Defining the function to get the color based on the depth of the earthquake
function getColor(d) {
  return d > 90 ? '#800026' :
         d > 70 ? '#BD0026' :
         d > 50 ? '#E31A1C' :
         d > 30 ? '#FC4E2A' :
         d > 10 ? '#FD8D3C' :
         d > -10 ? '#FFEDA0' :
         '#FFFFCC';
}

//Create a legend control
let legend = L.control({position: 'bottomright'});

//Add the legend to the map
legend.onAdd = function () {
  let div = L.DomUtil.create('div', 'info legend'),
      depths = [-10, 10, 30, 50, 70, 90],
      labels = [];

  //Loopipng through our depth intervals and generate a label with a colored square for each interval
  for (let i = 0; i < depths.length; i++) {
    div.innerHTML +=
        '<i style="background:' + getColor(depths[i] + 1) + '"></i> ' +
        depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+') + '<br>';
  }

  return div;
};

legend.addTo(myMap);

});