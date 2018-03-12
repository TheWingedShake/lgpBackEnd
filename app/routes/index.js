const cityRoutes = require('./city_routes');
const orderRoutes = require('./orders_routes');
const userRoutes = require('./user_routes');;

module.exports = function(app, db){
    cityRoutes(app, db);
    orderRoutes(app, db);
    userRoutes(app, db);
};