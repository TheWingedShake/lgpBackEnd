const Order = require('../models/Order');
const City = require('../models/City');
module.exports = function(app){

    app.get('/orders', (req, res) => {
        try{
            const query = Order.find();
            if(req.query && req.query['city']){
                query.where('destinationFrom').equals(req.query['city']);
            }
            query.populate('destinationFrom', 'name').populate('destinationTo', 'name');
            query.exec((err, result) => {
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
            Order.findById(id)
            .populate('destinationFrom')
            .populate('destinationTo')
            .exec((err, item) => {
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
            dateStart: body.dateStart,
            description: body.description
        };
        const userId = req.session.userId;
        if(!userId){
            res.status(403).send({error: 'Not authorized'});
            return;
        }
        if(body){
            orderData.type = 'client';
            orderData.userId = userId;
            orderData.dateStart = Date.now();
            Order.create(orderData, (err, order) => {
                let result = {}
                if(err){
                    result.error = 'Creating an order returned an error';
                }else{
                    result._id = order._id;
                }
                res.send(result);
            });
        }else{
            res.send({error: 'Body is empty'});
        }
    });

    app.put('/orders/:id', (req, res) => {
        const id = req.params.id;
        const orderData = {
            name: req.body.name,
            destinationFrom: req.body.destinationFrom,
            destinationTo: req.body.destinationTo,
            //dateStart: req.body.dateStart,
            description: req.body.description
        };
        Order.findById(id, (err, item) => {
            if(err){
                res.send({error: 'Order does not exists'});
            }else{
                item.set(orderData);
                item.save((error, updatedItem) => {
                    if(error){
                        res.send({error: 'Updating order returned an error.'});
                    }else{
                        res.send({message: 'Updated successfully.'});
                    }
                });
            }
        });
    });

    app.delete('/orders/:id', (req, res) => {
        const id = req.params.id;
        Order.remove({_id: id}, err => {
            if(err){
                res.send({error: 'Deleting order returned en error.'});
            }else{
                res.send({data: 'Order '+id+' deleted successfully.'});
            } 
        });
    });

}