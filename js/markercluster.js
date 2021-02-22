/* Map of Leaflet.markercluster with data from MegaCities.geojson */

//function to instantiate the Leaflet map
function createMap(){
	//create the map
	var map = L.map('map', {
		center: [20, 0],
		zoom: 2
	});

	//add OSM base tilelayer
	L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
	}).addTo(map);

	//call getData function
	getData(map);
};

//function to retrieve the data and place it on the map
function getData(map){
	//load the data
	$.ajax("data/MegaCities.geojson", {
		dataType: "json",
		success: function(response){
			//create a Leaflet GeoJSON layer
			var geoJsonLayer = L.geoJson(response);
			//create a L.markerClusterGroup layer
			var markers = L.markerClusterGroup();
			//add geojson to marker cluster layer
			markers.addLayer(geoJsonLayer);
			//add marker cluster layer to map
			map.addLayer(markers);
		}
	});
};

$(document).ready(createMap);