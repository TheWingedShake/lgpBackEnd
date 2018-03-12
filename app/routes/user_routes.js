const ObjectID = require('mongodb').ObjectID;
const User = require('../models/User');
module.exports = function(app, db){

    app.post('/users/signup', (req, res) => {
        const body = req.body;
        if(body.firstName && body.lastName && body.email && body.password && (body.password == body.repeat)){
            const userData = {
                email: body.email,
                firstName: body.firstName,
                lastName: body.lastName,
                password: body.password
            };
            User.create(userData, (err, user) => {
                let result = {};
                if(err){
                    result.error = err;
                }else{
                    result.message = 'Ok';
                }
                res.send(result);
            });
        }else{
            res.send({error: 'Data invalid'});
        }
        
    });

    app.post('/users/signin', (req, res) => {
        if(req.body.email && req.body.password){
            User.authenticate(req.body.email, req.body.password, function(error, user){
                if(error || !user){
                    res.send({error: 'Wrong login data.'});
                }else{
                    req.session.userId = user._id;
                    console.log(req.session);
                    res.send({userId: user._id, firstName: user.firstName, lastName: user.lastName});
                }
            });
        }else{
            res.send({error: 'Some field is missing.'});
        }
    });

    app.get('/users/logout', (req, res) => {
        if(req.session){
            req.session.destroy( err => {
                if(err){
                    res.send({error: 'Something went wrong.'});
                }else{
                    res.send({message: 'ok'});
                }
            });
        }
    });

    app.get('/users/current', (req, res) => {
        const id = req.session.userId;
        User.findById(id).exec((err, user) => {
            if(err){
                res.send({error: 'Something went wrong'});
            }else{
                if(user === null){
                    res.status(403).send({error: 'Not authorized.'});
                }else{
                    res.send({userId: user._id, firstName: user.firstName, lastName: user.lastName});
                }
            }
        });
    });

};