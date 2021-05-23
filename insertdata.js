var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

const { MongoClient } = require("mongodb");

// Replace the following with your Atlas connection string                                                                                                                                        
const url = "mongodb+srv://tphiepbk:hiepit-2992@cluster0.axbkf.mongodb.net/smart_farm?retryWrites=true&w=majority";

var dataUrl = "https://io.adafruit.com/api/v2/tphiepbk/feeds/bk-iot-light-relay/data.json?X-AIO-Key=aio_vjlb21Jsae7D86XwPisWl5WVvud7"

const client = new MongoClient(url);

const dbName = "bk-iot";

async function upload(data, collectionName) {
    try {

        await client.connect();
        console.log("Connected correctly to server");
        const db = client.db(dbName);
        // Use the collection "people"
        const col = db.collection(collectionName);

        // Construct a document                                                                                                                                                              

        let personDocument = { "id": 11, "name": "RELAY", "data": 1, "unit": "" };

        // Insert a single document, wait for promise so we can read it back
        const p = await col.insertOne(data);
        // Find one document
        const myDoc = await col.findOne();
        // Print to the console
        console.log(myDoc);
        } catch (err) {
        console.log(err.stack);
    }

    finally {
        await client.close();
    }
}

function getData() {

    var req = new XMLHttpRequest();
    req.responseType = 'json';
    req.open('GET', dataUrl, true);
    req.onload = function () {

        var jsonResponse = req.response;

        console.log(jsonResponse);

        for (var i = 0 ; i < jsonResponse.length ; i++) {
            upload(JSON.parse(jsonResponse[i].value), 'bk-iot-light-relay').catch(console.dir);
        }

    };
    req.send();
}

getData();