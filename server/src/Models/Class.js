const mongoose = require('mongoose');

const attributeSchema = new mongoose.Schema({
	id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Attribute',
	},
	minValue: {
		type: Number,
		default: null,
	},
	maxValue: {
		type: Number,
		default: null,
	},
	value: {
		type: [mongoose.Schema.Types.Mixed],
		default: null,
	}
});

const classSchema = new mongoose.Schema({
	name: String,
	attributes: [attributeSchema]
});

const Class = mongoose.model('Class', classSchema);

module.exports = Class;
