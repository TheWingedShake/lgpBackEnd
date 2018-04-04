const Thread = require('../models/Thread');
const Order = require('../models/Order');
const User = require('../models/User');
const mongoose = require('mongoose');
module.exports = function(app){
    
    app.get('/thread', (req, res) => {
        if(!req.session.userId){
            res.status(403).send();
            return;
        }
        /*mongoose.model('Thread').aggregate([
            {
                $match: {
                    "users" : {
                        $in: [mongoose.Types.ObjectId(req.session.userId)]
                    }
                },
            },
            {
                $lookup: {
                    "from": "messages",
                    "localField": "_id",
                    "foreignField": "thread",
                    "as": "relatedMessages"
                }
            },
            { $unwind: "$relatedMessages" },
            {
                $match: {
                    "relatedMessages.user" : {
                        $ne: mongoose.Types.ObjectId(req.session.userId)
                    },
                    "relatedMessages.isRead" : false
                }
            }
        ]).exec( (err, result) => {
            if(err){
                console.log('error', err);
            }else{
                console.log('result', result);
            }
        });*/
        const query = Thread.find();
        query.where('users').in([req.session.userId]);
        query.populate('order', 'name');
        query.exec((err, result) => {
            if(err){
                res.send({error: 'Error with threads.'})
            }else{
                res.send(result);
            }
        });
    })

    app.get('/thread/:id', (req, res) => {
        const id = req.params.id;
        if(!req.session.userId){
            res.status(403).send();
            return;
        }
        const isBelongToUser = function(element){
            return element._id == req.session.userId;
        }
        const query = Thread.findById(id);
        query.populate('order');
        query.populate('users', 'firstName lastName');
        query.exec((err, item) => {
            if(err){
                res.status(500).send({error: 'Error with thread finding.'});
            }else{
                if(!item || !item.users.findIndex(isBelongToUser) < 0){
                    res.status(404).send({error: 'Thread not found'});
                }else{
                    Thread.getMessages(id)
                    .then((data) => {
                        res.send({thread: item, messages: data});
                    })
                    .catch(error => {
                        res.status(500).send({error});
                    });
                }
            }
        });
    });

}