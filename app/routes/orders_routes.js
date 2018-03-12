const ObjectID = require('mongodb').ObjectID;
const Order = require('../models/Order');
module.exports = function(app , db){

    app.get('/orders', (req, res) => {
        try{
            let params = {};
            if(req.query && req.query['city']){
                params.destinationFrom = req.query['city'];
            }
            db.collection('orders').find(params).toArray((err, result) => {
                if(err){
                    res.send({'error': 'Error with orders.'});
                }else{
                    res.send(result);
                }
            });
        }catch(exception){
            res.send({'error': 'There is an exception with orders.'});
        }
    });

    app.get('/orders/:id', (req, res) => {
        const id = req.params.id;
        try{
            const details = {'_id': new ObjectID(id)};
            db.collection('orders').findOne(details, (err, item) => {
                if(err){
                    res.send({'error': 'Error with order.'});
                }else{
                    res.send(item);
                }
            })
        }catch(exception){
            res.send({'error': 'There is an exception with order.'});
        }
    });

    app.post('/orders', (req, res) => {
        const body = req.body;
        const orderData = {
            name: body.name,
            destinationFrom: body.destinationFrom,
            destinationTo: body.destinationTo,
            dateStart: body.dateStart
        };
        const userId = req.session.userId;
        if(!userId){
            res.status(403).send({error: 'Not authorized'});
            return;
        }
        if(body){
            orderData.type = 'client';
            orderData.destinationFrom = '5a9dd4540bf4f316a4243729';
            orderData.destinationTo = '5a9dd4840bf4f316a424372a';
            orderData.userId = userId;
            orderData.dateStart = Date.now();

            Order.create(orderData, (err, order) => {
                let result = {}
                if(err){
                    result.error = 'Creating an order returned an error';
                }else{
                    result.message = 'Ok';
                }
                res.send(result);
            });
        }else{
            res.send({error: 'Body is empty'});
        }
    });

    app.put('/orders/:id', (req, res) => {
        const id = req.params.id;
        const details = {'_id': new ObjectID(id)};
        const order = {
            name: req.body.name,
            destinationFrom: req.body.destinationFrom,
            destinationTo: req.body.destinationTo,
            dateStart: req.body.dateStart
        };
        db.collection('orders').update(details, order, (err, result) => {
            if(err){
                res.send({error: 'Updating order returned an error.'});
            }else{
                res.send({data: 'Updated successfully.'});
            }
        });
    });

    app.delete('/orders/:id', (req, res) => {
        const id = req.params.id;
        const details = {'_id': new ObjectID(id)};
        db.collection('orders').remove(details, (err, item) => {
            if(err){
                res.send({error: 'Deleting order returned en error.'});
            }else{
                res.send({data: 'Order '+id+' deleted successfully.'});
            }
        });
    });

}