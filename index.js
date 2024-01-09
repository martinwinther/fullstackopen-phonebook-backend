require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
const Person = require("./models/person");

const errorHandler = (error, request, response, next) => {
	console.error(error.message);

	if (error.name === "CastError") {
		return response.status(400).send({ error: "malformatted id" });
	} else if (error.name === "ValidationError") {
		return response.status(400).json({ error: error.message });
	}

	next(error);
};

morgan.token("req-data", (req, res) => {
	if (req.method === "POST") {
		return JSON.stringify(req.body);
	} else if (req.method === "GET" && req.params.id) {
		const person = persons.find((p) => p.id === Number(req.params.id));
		return person ? JSON.stringify(person) : "{}";
	}
	return "";
});

app.use(express.json());
app.use(cors());
app.use(morgan(":method :url :status :response-time ms - :req-data"));
app.use(express.static("dist"));
app.use(errorHandler);

app.get("/", (request, response) => {
	response.send("<h1>Please access the /api/</h1>");
});

app.get("/info", (request, response, next) => {
	Person.countDocuments({})
		.then((count) => {
			response.send(
				`<p>Phonebook has info for ${count} people</p><p>${new Date()}</p>`
			);
		})
		.catch((error) => next(error));
});

app.get("/api/persons", (req, res) => {
	res.json(persons);
});

app.get("/api/persons/:id", (req, res, next) => {
	Person.findById(req.params.id)
		.then((person) => {
			if (person) {
				res.json(person);
			} else {
				res.status(404).end();
			}
		})
		.catch((error) => next(error));
});

app.delete("/api/persons/:id", (req, res, next) => {
	Person.findByIdAndDelete(request.params.id)
		.then((result) => {
			response.status(204).end();
		})
		.catch((error) => next(error));
});

const generateId = () => {
	return Math.floor(Math.random() * 1000000);
};

app.post("/api/persons", (req, res, next) => {
	const body = req.body;

	// Check if the name or number is missing
	if (!body.name || !body.number) {
		return res.status(400).json({ error: "name or number is missing" });
	}

	// Check if the name already exists
	Person.findOne({ name: body.name })
		.then((existingPerson) => {
			if (existingPerson) {
				return res.status(400).json({ error: "name must be unique" });
			}

			// Create a new person object
			const person = new Person({
				name: body.name,
				number: body.number,
			});

			// Save the new person to the database
			person
				.save()
				.then((savedPerson) => {
					res.json(savedPerson);
				})
				.catch((error) => next(error));
		})
		.catch((error) => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
	const { name, number } = request.body;

	const person = {
		id: generateId(),
		name: body.name,
		number: body.number,
	};

	Person.findByIdAndUpdate(
		request.params.id,
		{ name, number },
		{ new: true, runValdiators: true, context: "query" }
	)
		.then((updatedPersone) => {
			response.json(updatedPerson);
		})
		.catch((error) => next(error));
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
