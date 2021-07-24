function reqListenerModel() {
    var res = JSON.parse(this.responseText);
    console.log(res);
}

function proceedSoilData () {

    var value = parseInt(document.getElementById('soil_value').value);
    console.log(value);

    var obj = new Object();
    obj.author = "tphiepbk";
    obj.type  = "LinearRegression";
    obj.input = value;
    var jsonString= JSON.stringify(obj);

    const modelURL = "http://127.0.0.1:5000/model";
    var modelXmlHttpReq = new XMLHttpRequest();
    modelXmlHttpReq.onload = reqListenerModel;
    modelXmlHttpReq.open("POST", modelURL, true);
    modelXmlHttpReq.send(jsonString);
}