const express = require('express');
const router = express.Router();
const Class = require('../Models/Class');

async function GetClasses(filter = undefined) {
	const classes = await Class.find(filter);
	return classes.map(classItem => ({
		id: classItem._id,
		name: classItem.name,
		attributes: classItem.attributes,
	}));
}

router.get('/', async (req, res) => {
	try {
		res.json(await GetClasses());
	} catch (error) {
		console.error('Error fetching classes:', error);
		res.status(500).json({ message: 'Error fetching classes' });
	}
});


router.post('/', async (req, res) => {
	const { name, attributes } = req.body;
	try {
		const newClass = new Class({ name, attributes });
		await newClass.save();

		res.status(201).json((await GetClasses(newClass._id))[0]);
	} catch (error) {
		console.error('Error adding class:', error);
		res.status(500).json({ message: 'Error adding class' });
	}
});


router.put('/:id', async (req, res) => {
	const { id } = req.params;
	const { name, attributes } = req.body;
	try {
		const classToUpdate = await Class.findById(id).populate('attributes.id');
		if (!classToUpdate) {
			return res.status(404).json({ message: 'Class not found' });
		}

		if (name !== undefined) classToUpdate.name = name;
		if (attributes !== undefined) classToUpdate.attributes = attributes;

		await classToUpdate.save();

		res.status(200).json((await GetClasses(classToUpdate._id))[0]);
	} catch (error) {
		console.error('Error updating class:', error);
		res.status(500).json({ message: 'Error updating class' });
	}
});

router.delete('/:id', async (req, res) => {
	const { id } = req.params;
	try {
		await Class.findByIdAndDelete(id);
		res.json({ message: 'Class deleted successfully' });
	} catch (error) {
		console.error('Error deleting class:', error);
		res.status(500).json({ message: 'Error deleting class' });
	}
});

module.exports = router;