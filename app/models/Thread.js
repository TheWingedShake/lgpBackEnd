const mongoose = require('mongoose');
const Order = require('./Order');
const Message = require('./Message');
const User = require('./User');
const ThreadSchema = new mongoose.Schema({
    order: {
        type: mongoose.Schema.ObjectId,
        index: true,
        required: true,
        ref: 'Order'
    },
    users : [{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }]
});
ThreadSchema.statics.getByOrderAndUser = function(orderId, userId){
    var p1 = new Promise((resolve, reject) => {
        query = Thread.findOne();
        query.where('order').equals(orderId);
        query.where('users').in([userId]);
        query.exec((err, item) => {
            if(err){
                reject('Error with threads.');
            }else{
                if(item){
                    resolve(item);
                }else{
                    Thread.createByOrderAndUser(orderId, userId)
                    .then(item => resolve(item))
                    .catch(err => reject(err));
                }
            }
        });
    });

    return p1;
};
ThreadSchema.statics.createByOrderAndUser = function(orderId, userId){
    var p1 = new Promise((resolve, reject) => {
        Order.findById(orderId).exec((err, item) => {
            console.log(orderId);
            if(err){
                reject('Error with orders.');
            }else{
                if(item){
                    let threadData = {
                        order: orderId,
                        users: [userId, item.user]
                    };
                    Thread.create(threadData, (err, item) => {
                        if(err){
                            reject('Error with thread creating')
                        }else{
                            resolve(item);
                        }
                    });
                }else{
                    reject('Order not found');
                }
            }
        })
    });

    return p1;
};
ThreadSchema.statics.getMessages = function(threadId){
    var p1 = new Promise((resolve, reject) => {
        const query = Message.find();
        query.where('thread').equals(threadId);
        query.populate('user', 'firstName lastName');
        query.exec((err, items) => {
            if(err){
                reject('Error with messages.')
            }else{
                resolve(items);
            }
        });
    });

    return p1;
};
var Thread = mongoose.model('Thread', ThreadSchema);
module.exports = Thread;