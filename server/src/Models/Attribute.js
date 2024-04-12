const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AttributeSchema = new Schema({
	name: String,
	type: Number,
	value: {
		type: [mongoose.Schema.Types.Mixed],
		default: null,
	}
});

const Attribute = mongoose.model('Attribute', AttributeSchema);

module.exports = Attribute;
