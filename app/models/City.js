const mongoose = require('mongoose');
const CitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    postcode: {
        type: String
    }
}, {collection: 'cities'});
const City = mongoose.model('City', CitySchema);
module.exports = City;