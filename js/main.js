//Building the baisc map
function createMap(){
    //create the map
    map = L.map('map', {
        center: [37.8, -96],
        zoom: 4,

    });
    //The layer with Open Map
    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
    }).addTo(map);

    //call getData function
    getData(map);
};


function pointToLayer(feature, latlng){
    //Determine which attribute to visualize with proportional symbols
		var attribute = "INSTNM";
    //create marker options
    var options = {
        radius: 8,
        fillColor: "#ff7800",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };


//create circle marker layer
    var layer = L.circleMarker(latlng, options);
    //build popup content string
    var popupContent = "<p><b>School Name:</b> " + feature.properties.INSTNM +
		"</p><p><b>Street Name: </b>" + feature.properties.STREET + "</p>";
    //bind the popup to the circle marker
    layer.bindPopup(popupContent, {
			offset: new L.Point(0, -options.radius)
		});

    //return the circle marker to the L.geoJson pointToLayer option
    return layer;
};

//Step 3: Add circle markers for point features to the map
function createPropSymbols(data){
    //create a Leaflet GeoJSON layer and add it to the map
    L.geoJson(data, {
        pointToLayer: pointToLayer
		}).addTo(map);
};



//Import GeoJSON data
function getData(map){
    //load the data
    $.ajax("data/hihi.geojson", {
				dataType: "json",
				success: function(response){
					createPropSymbols(response);
				}
    });
};

$(document).ready(createMap);
