var mongoose = require('mongoose');

var postSchema = mongoose.Schema({
    title: String,
    content: String
})

module.exports =  mongoose.model('Post', postSchema);