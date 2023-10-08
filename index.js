require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const app = express();
const cors = require("cors");
const Person = require("./models/person");

morgan.token("req-body", (req) => JSON.stringify(req.body));

app.use(express.static("dist"));
app.use(express.json());
app.use(cors());
app.use(
    morgan(
        ":method :url :status :res[content-length] :response-time ms  :req-body"
    )
);

app.get("/", (req, res) => {
    res.send("Hello world");
});

app.get("/info", (req, res) => {
    const currentTime = new Date().toString();

    Person.find({}).then((persons) => {
        res.send(`
            <p>Phonebook has info for ${persons.length} people</p>
            <p>${currentTime}</p>`);
    });
});

app.get("/api/persons", (req, res) => {
    Person.find({}).then((persons) => res.json(persons));
});

app.get("/api/persons/:id", (req, res) => {
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
    Person.findByIdAndDelete(req.params.id)
        .then((result) => {
            if (!result) {
                console.log("Person to delete not found");
                return res
                    .status(404)
                    .send({ error: "Person to delete not found" });
            }
            res.status(204).end();
        })
        .catch((error) => next(error));
});

app.post("/api/persons", (req, res, next) => {
    const body = req.body;

    if (!body.name || !body.number) {
        return res.status(400).json({
            error: "Name or number is missing",
        });
    }

    Person.findOne({ name: body.name })
        .then((existingPerson) => {
            if (existingPerson) {
                return res.status(400).json({
                    error: "Name must be unique",
                });
            }

            const person = new Person({
                name: body.name,
                number: body.number,
            });

            person
                .save()
                .then((savedPerson) => {
                    console.log(
                        `Added ${savedPerson.name} number ${savedPerson.number} to phonebook`
                    );
                    res.json(savedPerson);
                })
                .catch((error) => next(error));
        })
        .catch((error) => next(error));
});

app.put("/api/persons/:id", (req, res, next) => {
    const body = req.body;

    const person = {
        name: body.name,
        number: body.number,
    };

    Person.findByIdAndUpdate(req.params.id, person, { new: true })
        .then((updatePerson) => {
            res.json(updatePerson);
        })
        .catch((error) => next(error));
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: "unknown endpoint" });
};

// handler of requests with unknown endpoint
app.use(unknownEndpoint);

const errorHandler = (error, req, res, next) => {
    console.error(error.message);

    if (error.name === "CastError") {
        return res.status(400).send({ error: "malformatted id" });
    }

    next(error);
};

// handler of requests with result to errors
app.use(errorHandler);
