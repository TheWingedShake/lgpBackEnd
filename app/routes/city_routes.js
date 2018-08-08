const City = require('../models/City');
module.exports = function(app){
    app.get('/cities', (req, res) => {
        try{
            const query = City.find();
            query.sort('name');
            query.exec((err, result) => {
                if(err){
                    res.send({'error': 'Error with cities.'});
                }else{
                    res.send(result);
                }
            });
        }catch(exception){
            res.send({'error': 'There is an exception with cities.'});
        }
    });
    app.get('/cities/:id', (req, res) => {
        const id = req.params.id;
        try{
            City.findById(id)
            .exec((err, item) => {
                if(err){
                    res.send({'error': 'Something went wrong'});
                }else{
                    res.send(item);
                }
            });
        }catch(exception){
            res.send({'error': 'There is an exception'});
        }
        
    })
}