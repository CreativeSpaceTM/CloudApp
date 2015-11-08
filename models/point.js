var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var pointSchema = new Schema({
	location: {
		type: [Number],
		required: true,
		index: "2dsphere"
	},

	data: {
		type: [Schema.Types.Mixed]
	},

	created_at: Date,
	updated_at: Date
});

pointSchema.pre('save', function(next) {
	var currentDate = new Date();

	this.updated_at = currentDate;

	if (!this.created_at) {
		this.created_at = currentDate;
	}

	next();
});

var Point = mongoose.model('Point', pointSchema);

module.exports = Point;
