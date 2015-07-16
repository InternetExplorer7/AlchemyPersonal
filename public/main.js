
$(document).ready(function(){
	var socket = io();

	$("#loginuser").submit(function(){
		socket.emit("login", $("#usern").val(), $("#passw").val(), function(check, id){
			if(check === true){
			localStorage.setItem('uid', id);
			window.location.replace('profile.html');
			}
			else{
				alert("Wrong Username/Password");
			}
		});
		return false;
	});

	$("#target").submit(function(){
		socket.emit('register', $("#username").val(), $("#password").val(), $("#first").val(), $("#last").val(), $("#email").val(), function(id, verify){
			console.log("Verify ==== " + verify);
			if(verify === true){
			localStorage.setItem('uid', id);
			console.log("ID in first: " + localStorage.getItem('uid'));
		    window.location.replace("write.html");

			}
			else{
				alert("That username is already taken");
			}
		});
		return false;
	});

	$("#interests").submit(function(){ // User submitted personal info
		console.log("Sending UID: " + localStorage.getItem('uid'));
		socket.emit('process', $("#info").val(), localStorage.getItem('uid'));
		window.location.replace("/profile.html");
		return false;
	});


	socket.on('start', function(data){
		if(data._id === parseInt(localStorage.getItem('uid'))){ // Authentication
			console.log('got to start data: ' + data);
			data.interests.forEach(function(item){
				console.log(item);
				$.getJSON('https://www.googleapis.com/customsearch/v1?key=AIzaSyBXt9o4tV9NP3bmxgFXpzKnokzyPMRKxIk&cx=004477161878521810569:azzlpvtod_s&q=' + item + " news", function(data){
					console.log(data.items[0].link);
					console.log(data.items[0].title); 
					console.log(data.items[0].snippet);
					$("#overview").prepend("<section class='section--center mdl-grid mdl-grid--no-spacing mdl-shadow--2dp'>             <div class='mdl-card mdl-cell mdl-cell--12-col'> <div class='mdl-card__supporting-text'> <h4>" + data.items[0].title + "</h4>" + data.items[0].snippet + "</div> <div class='mdl-card__actions'> <a href=' " + data.items[0].link + " ' class='mdl-button' target='_blank'>Read full article</a> </div> </div> </section>"); // Left off here 
				}); 
			});
		}
	});
});