/**
   Copyright 2014 AlchemyAPI

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/


var express = require('express');
var consolidate = require('consolidate');

var app = express();
var server = require('http').createServer(app);

//Create the AlchemyAPI object
var AlchemyAPI = require('./alchemyapi');
var alchemyapi = new AlchemyAPI();

// all environments
app.use(express.static(__dirname + '/public'));
app.set('port', process.env.PORT || 3000);
app.use(express.favicon());
app.use(express.logger('dev'));
var MongoClient = require('mongodb').MongoClient; // MONGO DB
var io = require('socket.io')(server);
// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}




var port = process.env.PORT || 3000;
server.listen(port, function(){
	console.log('Express server listening on port ' + port);
});

MongoClient.connect('MongoDB connection string', function(err, db){

	console.log("Got to callback");
	io.on('connection', function(socket){
		socket.on('register', function(username, password, first, last, email, callback){
			var auth = Math.round(new Date().getTime()/1000.0)
			db.collection('users').insert({_id: auth, username: username, password: password, first: first, last: last, email: email, interests: []});
			db.collection('users').findOne({username: username}, function(err, doc){
				if(doc === null){
					callback(auth, true);
				}
				else{
					callback(auth, false);
				}
			});
		}); // register

		socket.on('login', function(username, password, callback){
					db.collection('users').findOne({username: username}, function(err, doc){
						if(doc === null){
							console.log('false');
							callback(false, doc._id);

						}
						else if(doc.password === password){
							console.log('true');
							callback(true, doc._id);
						}
						else{
							console.log('password mismatch');
							callback(false, doc._id);
						}
					});
		});
		socket.on('process', function(text, auth){
	alchemyapi.entities('text', text,{ 'sentiment':1 }, function(response) {
		console.log(response);
		response.entities.forEach(function(item){
					console.log(item.text);
					db.collection('users').update({_id: auth}, { $push: { interests: item.text }});
				});
			find(auth);
			}); // AlchemyAPI callback
		}); // process

		socket.on('get', function(id){
			console.log('got to get');
			find(id);
		}); // get

			function find(id){
				setTimeout(function(){
					db.collection('users').findOne({_id: id}, function(err, doc){
					console.log(doc);	
					io.emit('start', doc);
					});
				}, 1000);
		}
	}); // SocketIO connection


}); // MongoDB

