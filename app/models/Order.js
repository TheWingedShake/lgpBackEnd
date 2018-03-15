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
    userId : {
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
const Order = mongoose.model('Order', OrderSchema);
module.exports = Order;