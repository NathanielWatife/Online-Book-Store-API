const mongoose = require("mongoose");


const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: [250, "Title cannot exceed 250"]
    },
    author: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true
    },
    isbn: {
        type: String,
        require: [true, "Please add ISBN"],
        unique: true
    },
    genre: {
        type: [String],
        required: [true, 'Please add genre'],
        enum: [
            'Fiction', 'Non-Ficton', 'Science Fiction', 'Fantasy', 'Mystery', 'Thriller', 'Romance', 'Biography', 'History', 'Self-Help', 'Science', 'Technology', 'Business', 'Poetry', 'Drama', 'Horro', 'Children'
        ]
    },
    price: {
        type: Number,
        require: true,
        min: [0, 'Price is required']
    },
    pages: {
        type: Number,
        min: [1, "Book must be atleast 1 page"]
    },
    publishDate:{
        type: Date,
    },
    publisher: {
        type: String,
        required: true
    },
    coverImage: {
        type: String,
        default: 'no-photo.jpg'
    },
    stock: {
        type: Number,
        required: [true, "Please add stock quantity"],
        default: 0,
        min: 0
    },
    ratings: {
        type: [Number],
        min: 1,
        max: 5
    },
    averageRating: {
        type: Number,
        min: 1,
        max: 5
    },
    embeddings: {
        type: [Number],
        select: false
    },
    createAt: {
        type: Date,
        default: Date.now
    }
}, {timestamps: true},);

bookSchema.pre('save', function(next) {
    if (this.ratings && this.ratings.length > 0) {
        this.averageRating = this.ratings.reduce((a, b) => a + b, 0) / this.ratings.length;
    }next();
});

module.exports = mongoose.model("Book", bookSchema);