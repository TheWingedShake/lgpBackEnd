const User = require('../models/User');
module.exports = function(app){

    app.post('/users/signup', (req, res) => {
        const body = req.body;
        if(body.firstName && body.lastName && body.email && body.password && (body.password == body.repeat)){
            const userData = {
                email: body.email,
                firstName: body.firstName,
                lastName: body.lastName
            };
            User.hashPassword(body.password, (err, hash) => {
                if(err){
                    res.send({error: 'hash error'});
                }else{
                    userData.password = hash;
                    User.create(userData, (err, user) => {
                        let result = {};
                        if(err){
                            result.error = err;
                        }else{
                            result.message = 'Ok';
                        }
                        res.send(result);
                    });
                }
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

    app.get('/users/view/:id', (req, res) => {
        const id = req.params.id;
        User.findById(id).exec((err, user) => {
            if(err){
                res.send({error: 'Error with user retrieving.'});
            }else{
                if(user === null){
                    res.send({error: 'User does not exists.'});
                }else{
                    res.send({
                        id: user._id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        dateEntered: user.dateEntered
                    });
                }
            }
        })
    });

    app.put('/users/:id', (req, res) => {
        const id = req.params.id;
        const userData = {
            firstName: req.body.firstName,
            lastName: req.body.lastName
        };
        if(!id || id != req.session.userId){
            res.status(403).send({error: 'Not authorized.'});
        }
        User.findById(id, (err, item) => {
            if(err){
                res.send({error: 'Error with user retrieving.'});
            }else{
                if(item === null){
                    res.send({error: 'User does not exists.'});
                }else{
                    item.set(userData);
                    item.save((err, updatedItem) => {
                        if(err){
                            res.send({error: 'Error with user updating.'});
                        }else{
                            res.send({message: 'Updated successfully.'});
                        }
                    })
                }
            }
        });
    })

};