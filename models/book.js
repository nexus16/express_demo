var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BookSchema = new Schema({
    isbn: {
        type: String,
        required: true
    },
    title: {
        type: string,
        required: true
    },
    author: {
        type: string,
        required: true
    },
    publisher: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Book', BookSchema);