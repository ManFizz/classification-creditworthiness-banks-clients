const express = require('express');
const router = express.Router();
const Attribute = require('../Models/Attribute');

router.get('/', async (req, res) => {
	try {
		const attributes = await Attribute.find();
		const transformedAttributes = attributes.map(attr => ({
			id: attr._id,
			name: attr.name,
			type: attr.type,
			minValue: attr.minValue,
			maxValue: attr.maxValue,
			value: attr.value
		}));

		res.json(transformedAttributes);
	} catch (error) {
		console.error('Error fetching attributes:', error);
		res.status(500).json({ message: 'Error fetching attributes' });
	}
});

router.post('/', async (req, res) => {
	const { name, type, minValue, maxValue, value } = req.body;
	try {
		const newAttribute = new Attribute({ name, type, minValue, maxValue, value });
		await newAttribute.save();
		res.status(201).json(newAttribute);
	} catch (error) {
		console.error('Error adding attribute:', error);
		res.status(500).json({ message: 'Error adding attribute' });
	}
});

router.put('/:id', async (req, res) => {
	const { id } = req.params;

	try {
		const attributeToUpdate = await Attribute.findById(id);
		if (!attributeToUpdate) {
			return res.status(404).json({ message: 'Class not found' });
		}

		const { name, type, minValue, maxValue, value } = req.body;
		if (name) attributeToUpdate.name = name;
		if (type) attributeToUpdate.type = type;
		if (minValue !== undefined) attributeToUpdate.minValue = minValue;
		if (maxValue !== undefined) attributeToUpdate.maxValue = maxValue;
		if (value !== undefined) attributeToUpdate.value = value;

		await attributeToUpdate.save();

		res.status(200).json({
			id: attributeToUpdate._id,
			name: attributeToUpdate.name,
			type: attributeToUpdate.type,
			minValue: attributeToUpdate.minValue,
			maxValue: attributeToUpdate.maxValue,
			value: attributeToUpdate.value });
	} catch (error) {
		console.error('Error updating class:', error);
		res.status(500).json({ message: 'Error updating class' });
	}
});


router.delete('/:id', async (req, res) => {
	const { id } = req.params;
	try {
		await Attribute.findByIdAndDelete(id);
		res.json({ message: 'Attribute deleted successfully' });
	} catch (error) {
		console.error('Error deleting attribute:', error);
		res.status(500).json({ message: 'Error deleting attribute' });
	}
});

module.exports = router;
