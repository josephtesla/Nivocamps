var mongoose = require('mongoose');

var campSchema = new mongoose.Schema({
    name: String,
    image: String,
    author: String,
    description: String,
    date_posted: String,
    comments : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"Comment"
        }
    ]
})

module.exports = mongoose.model('Campground', campSchema)