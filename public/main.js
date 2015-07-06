$(document).ready(function(){
	var socket = io();
	var identification;
	$("#target").submit(function(){
		socket.emit('register', $("#username").val(), $("#password").val(), $("#first").val(), $("#last").val(), $("#email").val(), $("#phone").val(), function(id){
			identification = id;
		});
		return false;

	});

	$("#interests").submit(function(){ // User submitted personal info
		socket.emit('process', $("#info").val(), identification);
		return false;
	});



	socket.on('start', function(data){
		if(data._id === identification){ // Authentication
		data.interests.forEach(function(item){
				console.log(item);
				$.getJSON('https://www.googleapis.com/customsearch/v1?key=AIzaSyBXtEoqtV9NPkbmxgFXpzKnokzyPMRKxIk&cx=004477168878591810569:azzlpvtod_s&q=' + item, function(data){
					console.log(data);
					//console.log("Image location: " + data.items[1].pagemap.article[0].articlebody);
					$("#main").append("<div class='box'> <div class='title'> <h2>" + data.items[1].title + "</h2> </div> <div class='snippet'> <p>" + data.items[1].snippet + " </p> </div>" +"</div>");
				});
			});
		}
	});
});