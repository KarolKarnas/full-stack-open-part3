const mongoose = require('mongoose');

// if (process.argv.length < 3) {
// 	console.log('give password as argument');
// 	process.exit(1);
// }

const url = process.env.MONGODB_URI;

mongoose.set('strictQuery', false);
mongoose
	.connect(url)
	.then((result) => {
		console.log('connected to MongoDB');
	})
	.catch((error) => {
		console.log('error connecting to MongoDB:', error.message);
	});

const personSchema = new mongoose.Schema({
	name: String,
	number: String,
});

// const Person = mongoose.model('Person', personSchema);

// if (process.argv.length === 3) {
// 	console.log('phonebook:');
// 	Person.find({}).then((result) => {
// 		result.forEach((person) => {
// 			console.log(`${person.name} ${person.number}`);
// 		});
// 		mongoose.connection.close();
// 	});
// } else {
// 	const name = process.argv[3];
// 	const number = process.argv[4];

// 	const person = new Person({
// 		name,
// 		number,
// 	});

// 	person.save().then((result) => {
// 		console.log(`added ${name} number ${number} to phonebook`);
// 		mongoose.connection.close();
// 	});
// }

personSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
	},
});

module.exports = mongoose.model('Person', personSchema);
