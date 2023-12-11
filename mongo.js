const mongoose = require("mongoose");

// Check if password is provided
if (process.argv.length < 3) {
	console.log(
		"Please provide the password as an argument: node mongo.js <password>"
	);
	process.exit(1);
}

const password = process.argv[2];
const url = `mongodb+srv://fullstack:${password}@cluster0.cwiaael.mongodb.net/?retryWrites=true&w=majority`;

mongoose.connect(url);
mongoose.set("strictQuery", false);

const personSchema = new mongoose.Schema({
	name: String,
	number: String,
});

const Person = mongoose.model("Person", personSchema);

// Function to list all persons in the phonebook
const listPersons = () => {
	Person.find({}).then((persons) => {
		console.log("phonebook:");
		persons.forEach((person) => {
			console.log(`${person.name} ${person.number}`);
		});
		mongoose.connection.close();
	});
};

// Function to add a new person to the phonebook
const addPerson = (name, number) => {
	const person = new Person({ name, number });

	person.save().then(() => {
		console.log(`Added ${name} number ${number} to phonebook`);
		mongoose.connection.close();
	});
};

// Check the number of arguments and call the appropriate function
if (process.argv.length === 5) {
	const name = process.argv[3];
	const number = process.argv[4];
	addPerson(name, number);
} else if (process.argv.length === 3) {
	listPersons();
} else {
	console.log("Invalid number of arguments");
	mongoose.connection.close();
}
