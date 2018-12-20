var mongoose = require('mongoose')

var repliesSchema = new mongoose.Schema({
    text: String,
    author: String,
    date_posted:String

});

module.exports = mongoose.model('Reply', repliesSchema);