//var socket = io("http://localhost:3000");
const socket = io();

console.log('hello');

function getData() {
    console.log('getting data..');

    /*
    var created_at = [];
    var data = [];

    MongoClient.connect(connectionString, function(err, client) {
        assert.equal(null, err);

        const db = client.db("bk-iot-test");

        var cursor = db.collection('bk-iot-soil').find().sort({"created_at":-1});

        cursor.forEach(function(doc, err) {
            assert.equal(null, err);
            console.log(doc.value);

            created_at.push(doc.created_at);
            data.push(JSON.parse(doc.value).data);

        }, function() {
            client.close();
            console.log(created_at);
            console.log(data);
        });
    });
    */
};

socket.on('index', function(ele1, ele2, ele3, ele4) {
    console.log('chart data soil:', ele1);
    console.log('label data soil:', ele2);
    console.log('chart data light:', ele3);
    console.log('label data light:', ele4);
});

/*
var chartData = rows;

console.log(chartData);

getData();
*/