const mongoose = require('mongoose');
const OrderSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true,
        trim: true
    },
    created : {
        type: Date,
        default: Date.now
    },
    updated : {
        type: Date,
        default: Date.now
    },
    type : {
        type: String,
        required: true
    },
    destinationFrom : {
        type: mongoose.Schema.ObjectId,
        index: true,
        required: true,
        ref: 'City'
    },
    destinationTo : {
        type: mongoose.Schema.ObjectId,
        index: true,
        required: true,
        ref: 'City'
    },
    user : {
        type: mongoose.Schema.ObjectId,
        index: true,
        required: true,
        ref: 'User'
    },
    dateStart : {
        type: Date,
        required: true
    },
    isCompleted : {
        type: Boolean,
        default: false
    },
    description: {
        type: String,
        trim: true
    }
});
OrderSchema.statics.populateFromRequest = function(body){
    var orderData = {},
        editableFields = ['isCompleted', 'description', 'destinationFrom', 'destinationTo', 'dateStart'];
    for(let i in body){
        if(editableFields.indexOf(i) > -1){
            orderData[i] = body[i];
        }
    }
    return orderData;
};
const Order = mongoose.model('Order', OrderSchema);
module.exports = Order;