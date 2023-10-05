const express = require("express");
const morgan = require("morgan");
const app = express();
const cors = require("cors");

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

morgan.token("req-body", (req) => JSON.stringify(req.body));

app.use(express.json());
app.use(cors());
app.use(
    morgan(
        ":method :url :status :res[content-length] :response-time ms  :req-body"
    )
);
app.use(express.static("dist"));

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

app.get("/", (req, res) => {
    res.send("Hello world");
});

app.get("/info", (req, res) => {
    const currentTime = new Date().toString();
    res.send(`
    <p>Phonebook has info for ${data.length} people</p>
    <p>${currentTime}</p>`);
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

    res.status(204).end();
});

const generateRandomId = (max) => Math.floor(Math.random() * (max + 1));

app.post("/api/persons", (req, res) => {
    const body = req.body;

    if (!body.name || !body.number) {
        return res.status(400).json({
            error: "Name or number is missing",
        });
    } else if (persons.some((person) => person.name === body.name)) {
        return res.status(400).json({
            error: "Name must be unique",
        });
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateRandomId(999),
    };

    persons = persons.concat(person);

    res.json(persons);
});
