# Smart Farm System Project

## Technologies
* NodeJs - version 16.1.0  (server)
* ExpressJs - version 4.17.1 (web app)
* Socket.io - version 4.1.2 (transfer data from server to client)
* MongoDB - version 3.6.8 (database)
* CoreUI - version 3.x (UI)
* Flask - version 2.0.1 (machine learning server)
* Google Colab (train machine learning model)

## Features
* Turn on/off light system and water pump system automtically (based on the data fetched from database)
* Draw graphs representing current soil and light values

<ins>***Note***</ins>: Use the small web app in folder "test_send_data" to send data to Adafruit Server

## How to run
* Test model - run this command : **npm run dev**
* Release model - run this command : **npm run start**

## AIO_Key
* When the aio_key on AdaFruit server changes, just change the aio_key variable in file "public/javascripts/aio_key.js" and "db/get_data.js"

## Bonus Feature
* Open another VSCode editor in folder "flask_server", choose Python interpreter then run the server app
* Smart farm system will send data to Flask server, Flask server will use model trained by Google Colab to predict the value

<ins>***Note***</ins>: To run the Prediction server, we have to install the following packages (using pip):

* flask
* flask_cors
* sklearn
* statsmodels
## About

***Powered by FWB Team***:
* Thai Phuc Hiep - [tphiepbk](https://github.com/tphiepbk) (main coder) : 
	+ Base app
	+ UI
	+ Server
	+ Send data to adafruit
	+ Receive data from adafruit
	+ Fetch data and turn on/off light system and water pump system automatically
	+ Statistic feature
	+ Notification feature
	+ Bonus feature
	+ Final report

* Lam Thanh Huy - [lamhuy2214](https://github.com/lamhuy2214) : Login feature
* Le Chung Hoang - [HoangLC19](https://github.com/HoangLC19) : Notification feature
* Nguyen Trong Hoang - [tronghoangbk](https://github.com/tronghoangbk) : Notification feature