from flask import Flask, json
from flask import jsonify
from flask import request
from flask_cors import CORS
import pickle as pk
import json

app = Flask(__name__)
cors = CORS(app)

@app.route('/model', methods=['POST', 'GET'])
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

@app.route("/")
def loadModel():
    return "Hello, World!"

if __name__ == "__main__":
    app.run(debug=True)