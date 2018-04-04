const cityRoutes = require('./city_routes');
const orderRoutes = require('./orders_routes');
const userRoutes = require('./user_routes');;
const messageRoutes = require('./messages_routes');
const threadRoutes = require('./thread_routes');

module.exports = function(app){
    cityRoutes(app);
    orderRoutes(app);
    userRoutes(app);
    messageRoutes(app);
    threadRoutes(app);
};