var mongoose = require('mongoose');
var Campground = require('./campground');
var Comment = require('./comment');
var Reply = require('./Reply');

const getTimeStamp = () => {
    var dateString = Date();
    var dateArray = dateString.split(" ");
    var newDate = "";
    for (var i = 1;i < 5;i++) {
        newDate += dateArray[i] + " ";
    }
    return newDate;
}


module.exports = {

    getCampground: (req, res) => {
        Campground.find({}, function(err, campgrounds){
            if (err ){
                console.log(err);
            }
             res.render('campgrounds', {
                 campgrounds:campgrounds
            });
        })
    },

    addCampground: (req, res) => {
        var name = req.body.name;
        var image = req.body.image;
        var description = req.body.description;
    
        req.checkBody('name','Pls enter the name of the campground').notEmpty();
        req.checkBody('image','Pls enter the image url of the campground').notEmpty();
        req.checkBody('description','Pls enter the description of the campground').notEmpty();
    
        var errors = req.validationErrors();
        if (errors){
            res.render('./new',{
                errors:errors
            });
        }
        else{
            var newCamp = new Campground({
                name:name,
                image:image,
                description:description,
                author: req.user.name,
                date_posted: getTimeStamp()
            })
            newCamp.save(function(err, camp){
                if (err){
                    console.dir(err);
                }
            });
    
            res.redirect('/campgrounds')
        }
    },

    campgroundById: (req, res) => {
        Campground.findById(req.params.id).populate('comments').exec(function(err, foundCampground){
            if (err){
                console.log(err);
            }
            else{
                res.render('show',{
                    campground: foundCampground
                    
                });
            }
        });
    },
    seedData: () => {
        //remove all
        Campground.deleteMany({}, function(err, camp){
            if(err){
                console.dir(err)
            }
            else{
                console.log("Cleared!");
            }
        })
        Comment.deleteMany({}, function(err, camp){
            if(err){
                console.dir(err)
            }
            else{
                console.log("Cleared!");
            }
        })
        Reply.deleteMany({}, function(err, camp){
            if(err){
                console.dir(err)
            }
            else{
                console.log("Cleared!");
            }
        })
        //create comment and campgrounds
        var data = [
            {
                name:"Cloud rest",
                image:"img2.jpg",
                description:"Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae."

            },
            {
                name:"Mountain Hill",
                image:"img2.jpg",
                description:"Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae."
                
            },
            {
                name:"Salcon Valley",
                image:"img2.jpg",
                description:"Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae."
            }
        ];

        var replies = {
            text:"Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum",
            author:"Ronaldo"
        }
        
        

        data.forEach(function(seed){
            Campground.create(seed, function(err, campground){
                if(err){
                    console.log(err);
                }
                else{
                    Comment.create({
                        title:"this is a great place but i wish there was internet",
                        author:"Homer"
                    }, function(err, comment){
                        if(err){
                            console.log(err);
                        }
                        else{
                                Reply.create(replies, function(err, reply){
                                    if(err) {
                                        console.log(err)
                                    }
                                    else{
                                        comment.replies.push(reply);
                                        comment.save();
                                        console.log("saved replies")

                                        campground.comments.push(comment);
                                        campground.save();
                                        console.log("saved comment")
                            
                                    }
                                   
                                })
                        }
                    })
                    console.log("Added a campground");
                }
            })
        })
        
    },
    
    addCommentPage: (req, res) => {
        Campground.findById(req.params.id, (err, foundcampground) => {
            if(err){
                console.log(err)
            }
            else{
                res.render("newcomment",{
                    campground:foundcampground
                });
            }
        })
    },

    createComment: (req, res)  =>  {
        Campground.findById(req.params.id, (err, camp) => {
            if (err){
                console.log(err)
            }
            else{

                req.checkBody('comment','Pls enter your comment on this campground').notEmpty();
                var errors = req.validationErrors();
                if (errors){
                    res.render('./show',{
                        errors:errors
                    });
                }else{
                    var newComment = {
                        title:req.body.comment,
                        author: req.user.username,
                        date_posted: getTimeStamp()
                    }
                    Comment.create(newComment, (err, comment) => {
                        if (err){
                            console.log(err)
                        }
                        else{
                            camp.comments.push(comment);
                            camp.save();
                            res.redirect('/campgrounds/' + camp._id);
                        }
                    })
                }

            }
        })
    },

    createReply: (req, res) => {
        Comment.findById(req.params.cid, function (err, comment) {
            if(err){
                console.log(err)
            }
            else{
                    var newReply = {
                        text:req.body.text,
                        author:req.user.username,
                        date_posted: getTimeStamp()
                    }
                    Reply.create(newReply,function (err, reply) {
                        if (err) {
                            console.log(err)
                        }
                        else{
                            comment.replies.push(reply);
                            comment.save();
                            res.redirect('/campgrounds/' + req.params.id)
                        }
                    })
            }
        })
    }

}