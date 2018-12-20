const express = require('express');
const router  = express.Router()
const {createReply} = require('../models/function')

router.use(express.static('public'));
const ensureAuthenticated = (req, res, next) => {
   if (req.isAuthenticated()){
       return next();
   }
   req.flash('success', 'You must login to proceed!')
   res.location('/users/login');
   res.redirect('/users/login');
}
router.post('/:id/:cid',ensureAuthenticated, createReply)

module.exports  = router;