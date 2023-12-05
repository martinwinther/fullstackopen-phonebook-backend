const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();

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

let persons = [
	{
		id: 1,
		name: "Arto Hellas",
		number: "040-123456",
	},
	{
		id: 2,
		name: "Ada Lovelace",
		number: "39-44-5323523",
	},
	{
		id: 3,
		name: "Dan Abramov",
		number: "12-43-234345",
	},
	{
		id: 4,
		name: "Mary Poppendieck",
		number: "39-23-6423122",
	},
];

app.get("/", (request, response) => {
	response.send("<h1>Please access the /api/</h1>");
});

app.get("/info", (request, response) => {
	response.send(
		`<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`
	);
});

app.get("/api/persons", (req, res) => {
	res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
	const id = Number(req.params.id);
	const person = persons.find((person) => person.id === id);

	if (person) {
		res.json(person);
	} else {
		res.status(404).end();
	}
});

app.delete("/api/persons/:id", (req, res) => {
	const id = Number(req.params.id);
	persons = persons.filter((person) => person.id !== id);

	if (person) {
		res.status(204).end();
	} else {
		res.status(404).end();
	}
});

const generateId = () => {
	return Math.floor(Math.random() * 1000000);
};

app.post("/api/persons", (req, res) => {
	const body = req.body;

	// Check if the name or number is missing
	if (!body.name || !body.number) {
		return res.status(400).json({ error: "name or number is missing" });
	}

	// Check if the name already exists
	if (persons.find((person) => person.name === body.name)) {
		return res.status(400).json({ error: "name must be unique" });
	}

	// Create a new person object
	const person = {
		id: generateId(),
		name: body.name,
		number: body.number,
	};

	// Add the new person to the array
	persons = persons.concat(person);

	res.json(person);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
