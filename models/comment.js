var mongoose = require('mongoose');


var commentSchema = new mongoose.Schema({
    title: String,
    author: String,
    date_posted: String,
    replies: Array

});

module.exports = mongoose.model('Comment', commentSchema);