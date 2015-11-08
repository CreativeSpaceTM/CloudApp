(function() {
	'use strict';

	var center = [45.75, 21.22];
	var map = L.map('map').setView(center, 13);

	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
		attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
		maxZoom: 18,
		id: 'postal2600.o3lk3i9k',
		accessToken: 'pk.eyJ1IjoicG9zdGFsMjYwMCIsImEiOiJaOHZYQXdvIn0.O3n-BnC6oxnIgekYehJrVA'
	}).addTo(map);


	$.ajax({
		url: "/api/getPoints/45.75/21.22",
		success: function (response) {
			var bounds = L.latLngBounds(center, center);
			_.forEach(response.points, function (point) {
				var location = [point.location[1], point.location[0]];
				bounds.extend(location);
				var popup = "";
				_.forEach(point.data, function (data) {
					popup += "<b>" + data.name + "</b><br />";
					popup += data.value + "<br />";
				})
				L.marker(location).bindPopup(popup).addTo(map);
			});
			map.fitBounds(bounds);
		}
	});

}());
