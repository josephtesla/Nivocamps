var mongoose = require('mongoose');
var userSchema = mongoose.Schema({
    name: String,
    username: String,
    password: String,
    email: String,
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post"
        }
    ]
})

module.exports = mongoose.model('User', userSchema);