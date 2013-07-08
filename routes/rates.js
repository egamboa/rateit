var mongo = require('mongodb');

var Server = mongo.Server,
	Db = mongo.Db,
	BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('ratedb', server);

db.open(function(err, db){
	if(!err){
		console.log("Connect to 'ratedb' database");
		db.collection('rates', {strict:true}, function(err, collection){
			if(err){
				console.log("The 'rates' collection doesn't exist. Creating it with sample data...");
				populateDB();
			}
		});
	}
});

exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving rate: ' + id);
    db.collection('rates', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};

exports.findAll = function(req, res) {
    db.collection('rates', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.addRate = function(req, res) {
    var rate = req.body;
    console.log('Adding rate: ' + JSON.stringify(rate));
    db.collection('rates', function(err, collection) {
        collection.insert(rate, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred with rate:'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
}

exports.updateRate = function(req, res) {
    var id = req.params.id;
    var rate = req.body;
    console.log('Updating rate: ' + id);
    console.log(JSON.stringify(rate));
    db.collection('rates', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, rate, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating rate: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(rate);
            }
        });
    });
}

exports.deleteRate = function(req, res) {
    var id = req.params.id;
    console.log('Deleting rate: ' + id);
    db.collection('rates', function(err, collection) {
        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
}

/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.
var populateDB = function() {
 
    var rates = [
    {
        name: "CHATEAU DE SAINT COSME",
        date: "2009",
        country: "France",
        category: "Vinos",
        description: "The aromas of fruit and spice...",
        picture: "argiano.jpg"
    },
    {
        name: "LAN RIOJA CRIANZA",
        date: "2006",
        country: "Spain",
        category: "Vinos",
        description: "A resurgence of interest in boutique vineyards...",
        picture: "lan_rioja.jpg"
    }];
 
    db.collection('rates', function(err, collection) {
        collection.insert(rates, {safe:true}, function(err, result) {});
    });

    console.log('Iniciatilized');
 
};
