
$("#form").hide();
$("#tell").hide();
$("#main").hide();
$(document).ready(function(){
	var socket = io();
	var identification;


	$("#register").click(function(){ // User is signing up for a new account
		$("#pageone").fadeOut(1000);
		$("#form").fadeIn(2000);
	});

	$("#target").submit(function(){
		socket.emit('register', $("#username").val(), $("#password").val(), $("#first").val(), $("#last").val(), $("#email").val(), function(id){
			identification = id;
			$("#form").fadeOut(1000);
			$("#tell").fadeIn(2000);
		});
		return false;

	});

	$("#interests").submit(function(){ // User submitted personal info
		socket.emit('process', $("#info").val(), identification);
		$("#tell").fadeOut(1000);
		$("#main").fadeIn(4000);
		return false;
	});



	socket.on('start', function(data){
		if(data._id === identification){ // Authentication
		data.interests.forEach(function(item){
				console.log(item);
				$.getJSON('https://www.googleapis.com/customsearch/v1?key=AIzaSyBXtEoqtV9NPkbmxgFXpzKnokzyPMRKxIk&cx=004477168878591810569:azzlpvtod_s&q=' + item, function(data){
					console.log(data);
					//console.log("Image location: " + data.items[1].pagemap.article[0].articlebody);
					console.log(data.items[0].pagemap.cse_thumbnail[0].src.length);
					$("#main").append("<div class='box'> <a href=" + data.items[0].link + " target='_blank'> <img src=" + data.items[0].pagemap.cse_thumbnail[0].src + " /> <div id='text'>  <div id='title'>   <h2>" + data.items[0].title + "</h2> </div> <div class='snippet'> <p>" + data.items[0].snippet +  "</p> </div> </div> </a> </div>");
				});
			});
		}
	});
});