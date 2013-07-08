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
        name: "Chateu de Saint Cosme",
        date: "2009",
        country: "France",
        category: "Vinos",
        description: "The aromas of fruit and spice...",
        picture: "argiano.jpg"
    },
    {
        name: "Puerto Viejo",
        date: "2006",
        country: "Costa Rica",
        category: "Places",
        description: "Beutiful beach place to travel and enjoy",
        picture: "puertoviejo.jpg"
    },
    {
        name: "Volcan Poas",
        date: "2006",
        country: "Costa Rica",
        category: "Places",
        description: "Beutiful Volcan place to travel and enjoy",
        picture: "poas.jpg"
    },
    {
        name: "GTA Vice City",
        date: "2006",
        country: "United States",
        category: "Gaming",
        description: "Action game from Rockstar Games.",
        picture: "gtavc.jpg"
    },
    {
        name: "Chifrijo",
        date: "2006",
        country: "Costa Rica",
        category: "Food",
        description: "Great food with pork, rice and beans.",
        picture: "chifrijo.jpg"
    },
    {
        name: "Lionel Messi",
        date: "2006",
        country: "España",
        category: "Football",
        description: "Best Football player from FIFA.",
        picture: "messi.jpg"
    },
    {
        name: "iPhone 5",
        date: "2006",
        country: "United States",
        category: "Gatgets",
        description: "Smartphone with top technology",
        picture: "iphone.jpg"
    },
    {
        name: "Backcountry",
        date: "2006",
        country: "United States",
        category: "Gear",
        description: "Gear sale company",
        picture: "bc.jpg"
    },
    {
        name: "Mazda Protege 5 2002",
        date: "2002",
        country: "Japan",
        category: "Cars",
        description: "2.0 liters engine, sport look and feel.",
        picture: "protege.jpeg"
    },
    {
        name: "Mario Benedetti",
        date: "2006",
        country: "Uruguay",
        category: "Reading",
        description: "Great novelist and poet from Uruguay.",
        picture: "mario.jpg"
    },
    {
        name: "Studio Ghibli",
        date: "2006",
        country: "Japan",
        category: "Movies",
        description: "Motion studio with great movies.",
        picture: "ghibli.jpg"
    },
    {
        name: "Metal Gear Solid V : Guns of the patriots",
        date: "2006",
        country: "Japan",
        category: "Gaming",
        description: "Great game from konami and Hideo Kojima",
        picture: "metal.jpg"
    },
    {
        name: "Honda CRF 230",
        date: "2006",
        country: "Japan",
        category: "Motorcycles",
        description: "Motocross adventure for sure.",
        picture: "crf.jpg"
    },
    {
        name: "100 years of solitude",
        date: "2006",
        country: "Colombia",
        category: "Reading",
        description: "Best novel written for Gabriel Gacia Marquez.",
        picture: "100.jpg"
    }];
 
    db.collection('rates', function(err, collection) {
        collection.insert(rates, {safe:true}, function(err, result) {});
    });

    console.log('Iniciatilized');
 
};
