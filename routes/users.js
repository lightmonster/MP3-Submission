var express = require('express'),
    router = express.Router(),
    user = require('../models/user');

router.get('/', function(req, res){
    //check what does query has, at here
    // var query = user.find( Object.keys(req.query.where).length === 0 ? JSON.parse(req.query.where):{}).limit(Object.keys(req.query.limit).length === 0?JSON.parse(req.query.limit):{}).sort(Object.keys(req.query.sort).length === 0?JSON.parse(req.query.sort):{}).select(Object.keys(req.query.select).length === 0?JSON.parse(req.query.select):{}).skip(Object.keys(req.query.skip).length === 0?JSON.parse(req.query.skip):{});
    var query = user.find({});
    if (req.query.hasOwnProperty('where')) query = query.find(JSON.parse(req.query.where));
    if (req.query.hasOwnProperty('skip')) query = query.skip(JSON.parse(req.query.skip));
    if (req.query.hasOwnProperty('limit')) query = query.limit(JSON.parse(req.query.limit));
    if (req.query.hasOwnProperty('sort')) query = query.sort(JSON.parse(req.query.sort));
    if (req.query.hasOwnProperty('select')) query = query.select(JSON.parse(req.query.select));
    if (req.query.hasOwnProperty('count')) query = query.count(JSON.parse(req.query.count));
    query.exec(function(err, users) {
    // user.find({}, function(err, users) {
        if (err) {
            res.status(404).send({
                massage: err,
                data: []
            });
        }else{
            res.status(200).send({
                message: 'OK',
                data: users
            });
        }
    });
});

router.post('/', function(req, res){
    var userPost = {
        name: req.body.name,
        email: req.body.email,
        pendingTasks: req.body.pendingTasks
    }
    user.create(userPost, function(err, users){
        if (err){
            res.status(500).send({
                message: err,
                data: []
            });
        }else{//sucess
            res.status(201).send({
               message: 'OK',
               data: users 
            });
        }
    });
});

router.get('/:id', function(req, res){
    var query = user.findById(req.params.id);
    if (req.query.hasOwnProperty('where')) query = query.find(JSON.parse(req.query.where));
    if (req.query.hasOwnProperty('skip')) query = query.skip(JSON.parse(req.query.skip));
    if (req.query.hasOwnProperty('limit')) query = query.limit(JSON.parse(req.query.limit));
    if (req.query.hasOwnProperty('sort')) query = query.sort(JSON.parse(req.query.sort));
    if (req.query.hasOwnProperty('select')) query = query.select(JSON.parse(req.query.select));
    if (req.query.hasOwnProperty('count')) query = query.count(JSON.parse(req.query.count));
    query.exec(function(err, users) {
    // user.findById(req.params.id, function(err, users){
        if (err){
            res.status(404).send({
                message: err,
                data: []
            });
        }else if (!users){
            res.status(404).send({
                message: "Invalid ID",
                data: []
            });
        }else{
            res.status(200).send({
                message: 'OK',
                data: users
            });
        }
    });
});

router.put('/:id', function(req, res){
    var userPost = {
        name: req.body.name,
        email: req.body.email,
        pendingTasks: (!req.body.pendingTasks?[]:req.body.pendingTasks)
    }
    user.findOneAndUpdate(req.params.id, userPost,{new : true}, function(err, users){
        if (err){
            res.status(404).send({
                message: err,
                data: []
            });
        }
        else if (!user.length){
            res.status(404).send({
                message: "Invalid ID",
                data: []
            });
        }
        else{
            res.status(200).send({
                message:'OK',
                data: users
            });
        }
    });
    // user.findById(req.params.id, function(err, users){
    //     if(err){
    //         res.status(404).send({
    //             message: err,
    //             data: []
    //         });
    //     }else if (!users){
    //         res.status(404).send({
    //             message: 'Update Invalid data',
    //             data: []
    //         });
    //     }else{
    //         // user.update({ _id: req.params.id},userPost,function(err){
    //         //     if(err){
    //         //         res.status(500).send({
    //         //             message: err,
    //         //             data: []
    //         //         });
    //         //     }else{
    //         //         res.status(200).send({
    //         //             message: 'OK',
    //         //             data: users
    //         //         });
    //         //     }
    //         // });
    //         users.set(userPost);
    //         users.save(function(err){
    //             if(err){
    //                 res.status(500).send({
    //                     message: err,
    //                     data: []
    //                 });
    //             }else{
    //                 res.status(200).send({
    //                     message: 'OK',
    //                     data: users
    //                 });
    //             }
    //         });            
    //     }
    // });
});

//TODO: Delete
router.delete('/:id', function(req, res){
    user.find({ _id: req.params.id},function(err, users){
        if(err){
            res.status(404).send({
                message: err,
                data: []
            });
        }else if (!users.length){
            res.status(404).send({
                message: 'Delete Invalid data',
                data: []
            });
        }else{
            user.remove({ _id: req.params.id},function(err){
                if(err){
                    res.status(500).send({
                        message: err,
                        data: []
                    });
                }else{
                    res.status(200).send({
                    message: 'resource deleted.',
                    data: []
                    });
                }
            });
        }
    });
});


module.exports = router;