const mongoose = require("mongoose");


const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    publishDate:{
        type: Date,
        required: true,
    }
}, {timestamps: true},)

module.exports = mongoose.model("Book", bookSchema)