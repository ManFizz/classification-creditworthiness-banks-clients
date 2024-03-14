const express = require('express');
const router = express.Router();
const Class = require('../Models/Class');

router.get('/', async (req, res) => {
	try {
		const classes = await Class.find();
		const transformedClasses = classes.map(classItem => ({
			id: classItem._id,
			name: classItem.name
		}));

		res.json(transformedClasses);
	} catch (error) {
		console.error('Error fetching classes:', error);
		res.status(500).json({ message: 'Error fetching classes' });
	}
});


router.post('/', async (req, res) => {
	const { name } = req.body;
	try {
		const newClass = new Class({ name });
		await newClass.save();
		res.status(201).json({ id: newClass._id, name: newClass.name });
	} catch (error) {
		console.error('Error adding class:', error);
		res.status(500).json({ message: 'Error adding class' });
	}
});


router.put('/:id', async (req, res) => {
	const { id } = req.params;
	const { name } = req.body;
	try {
		const classToUpdate = await Class.findById(id);
		if (!classToUpdate) {
			return res.status(404).json({ message: 'Class not found' });
		}

		classToUpdate.name = name;
		await classToUpdate.save();

		res.status(200).json({ id: classToUpdate._id, name: classToUpdate.name });
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