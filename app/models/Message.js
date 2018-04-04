const mongoose = require('mongoose');
const MessageSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        index: true,
        required: true,
        ref: 'User'
    },
    thread: {
        type: mongoose.Schema.ObjectId,
        index: true,
        required: true,
        ref: 'Thread'
    },
    content: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    isRead: {
        type: Boolean,
        default: false
    }
});
MessageSchema.statics.createMessage = function(data){
    var p1 = new Promise((resolve, reject) => {
        Message.create(data, (err, item) => {
            if(err){
                reject('Error with message creating');
            }else{
                resolve(item);
            }
        });
    });

    return p1;
}
const Message = mongoose.model('Message', MessageSchema);
module.exports = Message;