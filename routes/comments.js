const express = require('express');
const router  = express.Router()
const {createComment} = require('../models/function')

const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()){
        return next();
    }
    req.flash('success', 'You must login to proceed!')
    res.location('/users/login');
    res.redirect('/users/login');
}

router.use(express.static('public'));   

router.post('/:id',ensureAuthenticated, createComment
    /**
     * look for campground using ID from req.params.id
     * Create comment
     * connect new comment to campground
     * redirect to show page
     */

)



module.exports  = router;