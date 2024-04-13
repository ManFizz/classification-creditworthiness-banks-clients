const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const classRoutes = require('./src/Routes/ClassRoute');
const attributeRoutes = require('./src/Routes/AttributeRoute');

const app = express();
const PORT = process.env.PORT || 5000;

mongoose.connect('mongodb://localhost:27017/mitips', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
})
	.then(() => {
		console.log('Connected to MongoDB');
	})
	.catch((error) => {
		console.error('Error connecting to MongoDB:', error);
	});

app.use(bodyParser.json());

app.use('/api/classes', classRoutes);
app.use('/api/attributes', attributeRoutes);
app.use('/classes', classRoutes);
app.use('/attributes', attributeRoutes);

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
