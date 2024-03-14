const mongoose = require('mongoose');

const attributeSchema = new mongoose.Schema({
	maxValue: {
		type: Number,
		default: null
	},
	value: {
		type: [String, Boolean],
		default: null
	}
});

const classSchema = new mongoose.Schema({
	name: String,
	attributes: [attributeSchema]
});

const Class = mongoose.model('Class', classSchema);

module.exports = Class;
