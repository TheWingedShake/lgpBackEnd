
ObjectID = require('mongodb').ObjectID;
module.exports = function(app, db){
    app.get('/cities', (req, res) => {
        db.collection('cities').find({}).toArray((err, result) => {
            if(err){
                res.send({'error': 'Somethind went wrong'});
            }else{
                res.send(result);
            }
        });
    });
    app.get('/cities/:id', (req, res) => {
        const id = req.params.id;
        try{
            const details = {'_id': new ObjectID(id)};
            db.collection('cities').findOne(details, (err, item) => {
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