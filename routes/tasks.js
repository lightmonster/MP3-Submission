var express = require('express'),
router = express.Router(),
task = require('../models/task');

router.get('/', function(req, res){
    var query = task.find({});
    if (req.query.hasOwnProperty('where')) query = query.find(JSON.parse(req.query.where));
    if (req.query.hasOwnProperty('skip')) query = query.skip(JSON.parse(req.query.skip));
    if (req.query.hasOwnProperty('limit')) query = query.limit(JSON.parse(req.query.limit));
    if (req.query.hasOwnProperty('sort')) query = query.sort(JSON.parse(req.query.sort));
    if (req.query.hasOwnProperty('select')) query = query.select(JSON.parse(req.query.select));
    if (req.query.hasOwnProperty('count')) query = query.count(JSON.parse(req.query.count));
    
    // var query = task.find(JSON.parse(req.query.where)).limit(req.query.limit).sort(req.query.sort).select(req.query.select).skip(req.query.skip);
    query.exec(function(err, tasks) {
            if (err) {
                res.status(500).send({
                    massage: err,
                    data: []
                });
            }else{
                res.status(200).send({
                    message: 'OK',
                    data: tasks
                });
            }
        });
});

router.post('/', function(req, res){
    var taskPost = {
        name: req.body.name,
        description: req.body.description,
        deadline: req.body.deadline,
        completed: req.body.completed,
        assignedUser: req.body.assignedUser,
        assignedUserName: req.body.assignedUserName,
    }
    task.create(taskPost, function(err, tasks){
        if (err){
            res.status(500).send({
                message: err,
                data: []
            });
        }else{//sucess
            res.status(201).send({
            message: 'OK',
            data: tasks 
            });
        }
    });
});

router.get('/:id', function(req, res){
    var query = task.findById(req.params.id);
    if (req.query.hasOwnProperty('where')) query = query.find(JSON.parse(req.query.where));
    if (req.query.hasOwnProperty('skip')) query = query.skip(JSON.parse(req.query.skip));
    if (req.query.hasOwnProperty('limit')) query = query.limit(JSON.parse(req.query.limit));
    if (req.query.hasOwnProperty('sort')) query = query.sort(JSON.parse(req.query.sort));
    if (req.query.hasOwnProperty('select')) query = query.select(JSON.parse(req.query.select));
    if (req.query.hasOwnProperty('count')) query = query.count(JSON.parse(req.query.count));
    query.exec(function(err, tasks) {
    // task.findById(req.params.id, function(err, tasks){
        if (err){
            res.status(404).send({
                message: err,
                data: []
            });
        }else if (!tasks){
            res.status(404).send({
                message: "Invalid ID",
                data: []
            });
        }else{
            res.status(200).send({
                message: 'OK',
                data: tasks
            });
        }
    });
});

router.put('/:id', function(req, res){
    var taskPost = {
        name: req.body.name,
        description: req.body.description,
        deadline: req.body.deadline,
        completed: req.body.completed,
        assignedUser: req.body.assignedUser,
        assignedUserName: req.body.assignedUserName,
    }
    task.findOneAndUpdate(req.params.id, taskPost, function(err, tasks){
        if (err){
            res.status(404).send({
                message: err,
                data: []
            });
        }
        else if (!task.length){
            res.status(404).send({
                message: "Invalid ID",
                data: []
            });
        }
        else{
            res.status(200).send({
                message:'OK',
                data: tasks
            });
        }
    });
});

//TODO: Delete
router.delete('/:id', function(req, res){
    task.findByIdAndRemove({ _id: req.params.id}, function(err, tasks){
    // task.remove({ _id: req.params.id}, function(err, tasks){
        if(err){
            res.status(404).send({
                message: err,
                data: []
            });
        }else if (!tasks){
            res.status(404).send({
                message: "Invalid ID",
                data: []
            });
        }else{
            res.status(200).send({
                message: 'resource deleted.',
                data: []
            });
        }
    });
});


module.exports = router;