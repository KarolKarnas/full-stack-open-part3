require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');
const app = express();

morgan.token('body', function (req, res) {
	return JSON.stringify(req.body);
});

// unknown endpoint

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: 'unknown endpoint' });
};

// error handler

const errorHandler = (error, request, response, next) => {
	console.error(error.message);

	if (error.name === 'CastError') {
		return response.status(400).send({ error: 'malformatted id' });
	}

	next(error);
};

app.use(express.json());
app.use(cors());
app.use(
	morgan(':method :url :status :res[content-length] - :response-time ms :body')
);
app.use(express.static('build'));

app.get('/api/persons', (request, response, next) => {
	Person.find({})
		.then((person) => {
			response.json(person);
		})
		.catch((error) => next(error));
});

app.get('/info', (request, response, next) => {
	Person.find({})
		.then((person) => {
			const date = new Date();
			const counter = person.length;
			response.send(
				`<p>Phonebook has info for ${counter} people</p><p>${date}</p>`
			);
		})
		.catch((error) => next(error));
});

app.get('/api/persons/:id/', (request, response, next) => {
	Person.findById(request.params.id)
		.then((person) => {
			if (person) {
				response.json(person);
			} else {
				response.status(404).end();
			}
		})
		.catch((error) => next(error));
});

app.delete('/api/persons/:id/', (request, response, next) => {
	Person.findByIdAndRemove(request.params.id)
		.then((result) => {
			if (result) {
				response.status(204).end();
			} else {
				response
					.status(404)
					.send({ info: 'the note has already been deleted' });
			}
		})
		.catch((error) => next(error));
});

app.post('/api/persons', (request, response) => {
	const body = request.body;

	if (!body.name) {
		return response.status(400).json({
			error: 'name is missing',
		});
	} else if (!body.number) {
		return response.status(400).json({
			error: 'number is missing',
		});
	}

	// else if (persons.findIndex((person) => person.name === body.name) !== -1) {
	// 	return response.status(400).json({
	// 		error: 'name must be unique',
	// 	});
	// }

	const person = new Person({
		name: body.name,
		number: body.number,
	});

	person.save().then((savedPerson) => {
		response.json(savedPerson);
	});
});

app.use(unknownEndpoint);
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT} - http://localhost:${PORT}`);
});
