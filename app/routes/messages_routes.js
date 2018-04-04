const Order = require('../models/Order');
const Thread = require('../models/Thread');
const Message = require('../models/Message');
const mongoose = require('mongoose');
module.exports = function(app){
    app.post('/message', (req, res) => {
        const body = req.body;
        if(!req.session.userId){
            res.status(403).send();
        }
        if(!body.content){
            res.status(400).send();
        }
        if(body.orderId){
            Thread.getByOrderAndUser(body.orderId, req.session.userId)
            .then((item) => {
                const messageData = {
                    user: req.session.userId,
                    thread: item._id,
                    content: body.content
                };
                Message.createMessage(messageData)
                .then(message => {
                    res.send(message);
                })
                .catch(error => {
                    res.status(500).send({error})
                });
            })
            .catch((error) => {
                console.log('error', error);
                res.status(500).send({error});
            })
        }else if(body.threadId){
            Thread.findById(body.threadId, (err, thread) => {
                if(err){
                    console.log(err);
                    res.status(500).send({error: 'Error with thread.'});
                }else if(!thread){
                    res.status(404).send({error: 'Thread not found.'});
                }else{
                    if(thread.users.indexOf(req.session.userId) < 0){
                        res.status(404).send({error: 'Thread not found.'});
                    }else{
                        const messageData = {
                            user: req.session.userId,
                            thread: thread._id,
                            content: body.content
                        };
                        Message.createMessage(messageData)
                        .then(item => {
                            Message.populate(item, {
                                    path: 'user',
                                    select: 'firstName lastName'
                                },
                                (err, message) => {
                                    if(err){
                                        res.status(500).send();
                                    }else{
                                        res.send(message);
                                    }
                                }
                            );
                        })
                        .catch(error => {
                            res.status(500).send({error})
                        });
                    }
                }
            });
        }else{
            res.status(400).send();
        }
    });
    app.get('/message/recent', (req, res) => {
        if(!req.session.userId){
            res.status(403).send();
            return;
        }
        mongoose.model('Message').aggregate([
            {
                $match : {
                    "user" : {
                        $ne: mongoose.Types.ObjectId(req.session.userId)
                    },
                    "isRead" : false
                }
            },
            {
                $lookup : {
                    "from": "threads",
                    "localField": "thread",
                    "foreignField": "_id",
                    "as": "relatedThread"
                }
            },
            { $unwind : "$relatedThread"},
            {
                $match : { 
                    "relatedThread.users": { 
                        $in: [ mongoose.Types.ObjectId(req.session.userId) ] 
                    } 
                }
            }
        ]).exec((err, results) => {
            if(err){
                res.status(500).send({error: 'Error with recent messages'});
            }else{
                res.send({count: results.length});
            }
        });
    });
};