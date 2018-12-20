var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
const campRoute = require('../models/function');
mongoose.connect("mongodb://josephtesla:tesla98@ds123919.mlab.com:23919/nivocamps")
.then((conn) => {
   console.log("connected!")
}).catch(err => {
   console.log(err)
});
var route = require('./comments');

const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()){
        return next();
    }
    req.flash('success', 'You must login to proceed!')
    res.location('/users/login');
    res.redirect('/users/login');
}

router.use(':id/comments', route);
router.use(express.static('public'));

router.get("/", campRoute.getCampground)
router.get('/new', ensureAuthenticated, function (req, res) {
    res.render('new');
})
router.post('/', ensureAuthenticated, campRoute.addCampground)
router.get('/:id', campRoute.campgroundById)

module.exports = router;
