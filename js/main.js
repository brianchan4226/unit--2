/* Leaflet Proportional Symbols Example */

//Creating the basic map
function createMap(){
	//Creating the map itself
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

//Size of the orange circle
function calcPropRadius(attValue) {
	//scale of the circle
	var scaleFactor = 50;
	//area of the circle
	var area = attValue * scaleFactor;
	//radius calculated based on area
	var radius = Math.sqrt(area/Math.PI);

	return radius;
};

//From above function and make it circle
function pointToLayer(feature, latlng, attributes){
	//Assign the current attribute based on the first index of the attributes array
	var attribute = attributes[0];

	//marker properties
	var options = {
		fillColor: "#ff7800",
		color: "#000",
		weight: 1,
		opacity: 1,
		fillOpacity: 0.8
	};

	//For each feature, determine its value for the selected attribute
	var attValue = Number(feature.properties[attribute]);

	//Give each feature's circle marker a radius based on its attribute value
	options.radius = calcPropRadius(attValue);

	//create circle marker layer
	var layer = L.circleMarker(latlng, options);

	//original popupContent can be changed to panelContent
	var popupContent = "<p><b>City:</b> " + feature.properties.City + "</p>";

	//add formatted attribute to content string
	var year = attribute.split("_")[1];
	popupContent += "<p><b>Population in " + year + ":</b> " + feature.properties[attribute] + " million</p>";

	// //popup content is now just the city name
	// var popupContent = feature.properties.City;

	//Popup animation for the circles
	layer.bindPopup(popupContent, {
		offset: new L.Point(0,-options.radius),
		closeButton: false
	});

	//function to hover and click for the circles
	layer.on({
		mouseover: function(){
			this.openPopup();
		},
		mouseout: function(){
			this.closePopup();
		}//,
	// 	click: function(){
	// 		$("#panel").html(panelContent);
	// 	}
	});

	//return the circle marker to the L.geoJson pointToLayer option
	return layer;
};

//build an attributes array from the data
function processData(data){
	//empty array to hold attributes
	var attributes = [];

	//properties of the first feature in the dataset
	var properties = data.features[0].properties;
	//push each attribute name into attributes array
	for (var attribute in properties){
		//only take attributes with population values
		if (attribute.indexOf("Pop") > -1){
			attributes.push(attribute);
		};
	};

	return attributes;
};

//Add circle markers for point features to the map
function createPropSymbols(data, map, attributes){
	//create a Leaflet GeoJSON layer and add it to the map
	L.geoJson(data, {
		pointToLayer: function(feature, latlng){
			return pointToLayer(feature, latlng, attributes);
		}
	}).addTo(map);
};

//Resizing circles
function updatePropSymbols(map, attribute){
	map.eachLayer(function(layer){
		if (layer.feature && layer.feature.properties[attribute]){
			//access feature properties
            var props = layer.feature.properties;

            //update each feature's radius based on new attribute values
            var radius = calcPropRadius(props[attribute]);
            layer.setRadius(radius);

            //add city to popup content string
            var popupContent = "<p><b>City:</b> " + props.City + "</p>";

            //add formatted attribute to panel content string
            var year = attribute.split("_")[1];
            popupContent += "<p><b>Population in " + year + ":</b> " + props[attribute] + " million</p>";

            //replace the layer popup
            layer.bindPopup(popupContent, {
                offset: new L.Point(0,-radius)
            });
		};
	});
};

//Creating slider and button for resizing the map
function createSequenceControls(map, attributes){
	//create range input element (slider)
	$('#panel').append('<input class="range-slider" type="range">');

	//set slider attributes
	$('.range-slider').attr({
		max: 6,
		min: 0,
		value: 0,
		step: 1
	});

	//add skip buttons
	$('#panel').append('<button class="skip" id="reverse" title="Reverse">Reverse</button>');
	$('#panel').append('<button class="skip" id="forward" title="Forward">Skip</button>');

	//replace button content with images
	$('#reverse').html('<img src="img/reverse.png">');
	$('#forward').html('<img src="img/forward.png">');

	//function for setting how much the slider can resize the circle
	$('.skip').click(function(){
		//get the old index value
		var index = $('.range-slider').val();

		//How much the circle increases its size for each click
		if ($(this).attr('id') == 'forward'){
			index++;
			//Setting upper limit for the slider
			index = index > 6 ? 0 : index;
		} else if ($(this).attr('id') == 'reverse'){
			index--;
			//Setting lower limit for the slider
			index = index < 0 ? 6 : index;
		};

		//Update slider
		$('.range-slider').val(index);

		//Updating symbols
		updatePropSymbols(map, attributes[index]);
	});

	//Giving input to the slider
	$('.range-slider').on('input', function(){
		//Get the new index value
		var index = $(this).val();

		//Pass new attribute to update symbols
		updatePropSymbols(map, attributes[index]);
	});
};

//Importing geoJson file to the map
function getData(map){
	//load the data
	$.ajax("data/MegaCities.geojson", {
		dataType: "json",
		success: function(response){
			//create an attributes array
			var attributes = processData(response);

			createPropSymbols(response, map, attributes);
			createSequenceControls(map, attributes);

		}
	});
};

$(document).ready(createMap);
