const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AttributeSchema = new Schema({
	name: String,
	type: Number,
	minValue: { type: Number, required: false },
	maxValue: { type: Number, required: false },
	value: { type: [String], required: false }
});

const Attribute = mongoose.model('Attribute', AttributeSchema);

module.exports = Attribute;
