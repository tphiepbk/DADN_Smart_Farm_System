from flask import Flask, json
from flask import jsonify
from flask import request
from flask_cors import CORS
import pickle as pk
import json

app = Flask(__name__)
cors = CORS(app)

@app.route('/linear_regression', methods=['POST', 'GET'])
def process():
    if request.method == "POST":
        my_json = request.data.decode('utf8').replace("'", '"')
        print(type(my_json))

        jsonData = json.loads(my_json)

        print(type(jsonData))
        print(jsonData.keys())
        print(jsonData['input'])
        print(type(jsonData['input']))

        inputVar = jsonData['input']

        infile = open('model.pkl', 'rb')
        model = pk.load(infile)
        infile.close()
        result = model.predict([[inputVar]])
        result = result[0][0]
        return jsonify (
            author='tphiepbk',
            type='LinearRegression',
            result=result
        )

@app.route('/arima', methods=['POST', 'GET'])
def arima():
    if request.method == "POST":
        my_json = request.data.decode('utf8').replace("'", '"')

        jsonData = json.loads(my_json)

        inputVar = jsonData['input']

        infile_rainfall = open('ARIMA_rainfall.pkl', 'rb')
        model_rainfall = pk.load(infile_rainfall)
        infile_rainfall.close()
        predictions, se, conf = model_rainfall.forecast((inputVar - 2020) * 12)
        predictionsStr_rainfall = ""
        for element in predictions:
            predictionsStr_rainfall += (str(element) + ',')
        print(predictionsStr_rainfall)

        infile_avgtemp = open('ARIMA_avgtemp.pkl', 'rb')
        model_avgtemp = pk.load(infile_avgtemp)
        infile_avgtemp.close()
        predictions, se, conf = model_avgtemp.forecast((inputVar - 2020) * 12)
        predictionsStr_avgtemp = ""
        for element in predictions:
            predictionsStr_avgtemp += (str(element) + ',')
        print(predictionsStr_avgtemp)

        return jsonify (
            author='tphiepbk',
            type='ARIMA',
            year=inputVar,
            rainfall=predictionsStr_rainfall,
            avgtemp=predictionsStr_avgtemp
        )

@app.route("/")
def loadModel():
    return "Hello, World!"

if __name__ == "__main__":
    app.run(debug=True)