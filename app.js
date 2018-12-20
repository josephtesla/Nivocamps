var express = require("express");
var app = express();
var path = require("path");
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session')
var flash = require('connect-flash')
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
const {seedData} = require('./models/function');
var users = require('./routes/users')
var routes = require('./routes/index');
var camps = require('./routes/camps');
var route2 =  require('./routes/comments');
var route3 =  require('./routes/route');

//seedData();
app.set("view engine","ejs");
app.use(express.static(path.join('public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

//express-session middleware
app.use(session({
    secret:'secret',
    saveUninitialized:true,
    resave:true
}))

//passport middleware
app.use(passport.initialize())
app.use(passport.session());


//connnect-flash
app.use(flash());
app.use(function(req, res,  next){
    res.locals.messages = require('express-messages')(req, res);
    next();
})

//express-validator middleware
app.use(expressValidator({
    errorFormatter: function(param, msg, value){
        var namespace = param.split('.')
        , root = namespace.shift()
        ,  formParam = root;

        while(namespace.length){
            formParam = '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

//store user details accross all pages
app.get('*', (req, res, next) => {
    res.locals.user = req.user || null;
    next();
})

app.use('/',routes);
app.use('/users', users)
app.use('/campgrounds', camps);
app.use('/campgrounds/comments', route2);
app.use('/replies/comments', route3);


app.listen(process.env.PORT || 3000, (req, res) => {
    console.log("server started!");
})