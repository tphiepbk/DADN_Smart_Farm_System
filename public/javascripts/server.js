var express= require("express"),
http= require("http"),
bodyparser= require("body-parser"),
mongo= require("mongodb");

var app= express(), 
db = new mongo.Db("newapp", new mongo.Server("localhost", "27017"), {safe:true}, {auto_reconnect: true});

app.use(bodyparser.urlencoded({extended: true}));

db.open(function(err, db){
    if(err)
        console.log(err);

    people= db.collection("bk-iot-light");

    app.get("/", function(req, res){
        var cursor= people.find();
        cursor.toArray(function(err, docs){
            if(err) 
                throw err;
            res.render("index.jade", {people: docs});   
        });
    });

    app.post("/", function(req, res){
        people.insert({name: req.body.name, job: req.body.job}, 
            function(err, doc){
                    if(err)
                        throw err;
                    res.redirect("/");
            });
    });

        app.get("/update/:id", function(req, res){
        people.findOne({_id: new mongo.ObjectID(req.params.id)}, 
            function(err, doc){
                    if(err) 
                        throw err;
                    res.render("update.jade", {person: doc});
            });
    });

    app.post("/update/:id", function(req, res){
        people.update({_id: new mongo.ObjectID(req.params.id)},{
                    name: req.body.name,
                    job: req.body.job
            }, function(err, item){
                    if(err)
                        throw err;
                    res.redirect("/");
            });
    });

    app.get("/delete/:id", function(req, res){
        people.remove({_id: new mongo.ObjectID(req.params.id)},
            function(err){
            if(err)
                throw err;
            res.redirect("/");
            });
    });
});

app.listen(3000, function(){
    console.log("Now Listening on port: 3000");
});
