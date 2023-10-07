const mongoose = require("mongoose");

if (process.argv.length < 3) {
    console.log("Give password as argument");
    process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://fullstack:${password}@cluster0.qvy0v63.mongodb.net/?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const phonebookSchema = new mongoose.Schema({
    name: String,
    number: String,
});

const PhonebookPerson = mongoose.model("PhonebookPerson", phonebookSchema);

const person = new PhonebookPerson({
    name: process.argv[3],
    number: process.argv[4],
});

person.save().then((res) => {
    console.log(`Added ${res.name} number ${res.number} to phonebook`);
    mongoose.connection.close();
});

PhonebookPerson.find({}).then((res) => {
    res.forEach((person) => {
        console.log(person);
    });
    mongoose.connection.close();
});
