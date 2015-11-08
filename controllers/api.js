var express = require('express');
var router = express.Router();

var Point = require("../models/point");

router.post('/addPoint', function(req, res) {
	var point = new Point();
	point.location = [req.body.lon, req.body.lat];
	point.data = req.body.data;

	point.save(function (err) {
		if (err) {
			res.status(500).json({ status: 'error', error: err });
		}
		else {
			res.json({ status: 'ok'});
		}
	});

});

router.get('/getPoints/:lat/:lon', function(req, res) {
	Point
	.find({
		location: {
			$near: {
				$geometry : {
					type : "Point" ,
					coordinates :[req.params.lon, req.params.lat]
				},
				$maxDistance: 10000
			},
		}
	}, {location: 1, data :1, _id: 0})
	.limit(500)
	.exec(function (err, points) {
		if (err) {
			res.status(500).json({ status: 'error', error: err });
		}
		else {
			res.json({ status: 'ok', points: points});
		}
	});
});

router.get('/getAvg/:lat/:lon', function(req, res) {
	Point
	.aggregate({
		$geoNear: {
			spherical: true,
			limit: 500,
			near : {
				type : "Point" ,
				coordinates :[parseFloat(req.params.lon), parseFloat(req.params.lat)]
			},
			maxDistance: 10000,
			distanceField: "distance"
		},
	})
	.append({
		$unwind: "$data"
	})
	.append({
		$group: {
			_id: "$data.name",
			avg: {$avg: "$data.value"}
		}
	})
	.append({
		$project: {
			_id: 0,
			avg: 1,
			name: "$_id",
		}
	})
	.exec(function (err, points) {
		if (err) {
			res.status(500).json({ status: 'error', error: err });
		}
		else {
			res.json({
				status: 'ok',
				data: points,
				location: [
					req.params.lat,
					req.params.lon
				]
			});
		}
	});
});



module.exports = router;
