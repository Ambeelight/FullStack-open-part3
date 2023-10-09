const mongoose = require("mongoose");

const url = process.env.MONGODB_URI;

mongoose.set("strictQuery", false);
mongoose
    .connect(url)
    .then((result) => {
        console.log("connected to MongoDB");
    })
    .catch((error) => {
        console.log("error connection to MongoDB", error.message);
    });

const phonebookSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        required: [true, "Person name reuiqred"],
    },
    number: {
        type: String,
        validate: {
            validator: function (v) {
                return /^\d{2,3}-\d{7,}$/.test(v);
            },
            message: (props) =>
                `${props.value} is not a valid phone number. It should be in the format XX-XXXXXXXX.`,
        },
        required: [true, "Person phone number required"],
    },
});

phonebookSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});

module.exports = mongoose.model("PhonebookPerson", phonebookSchema);
