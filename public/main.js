
$("#form").hide();
$("#tell").hide();
$("#main").hide();
$("#pageone").hide();
$("#loginform").hide();
$("nav").hide();
$(window).load(function(){
	$("#loading").fadeOut(500);
	$("nav").fadeIn(500);
	$("#pageone").fadeIn(1000);
	var socket = io();
	var identification;

	$("#signin").click(function(){
		$("#pageone").fadeOut(1000);
		$("#loginform").fadeIn(2000);
	});

	$("#loginuser").submit(function(){
		socket.emit("login", $("#usern").val(), $("#passw").val(), function(check, id){
			if(check === true){
			identification = id;
			socket.emit('get', identification);
			$("#loginform").fadeOut(1000);
			$("#main").fadeIn(4000);
			}
			else{
				alert("Wrong Username/Password");
			}
		});
		return false;
	});


	$("#register").click(function(){ // User is signing up for a new account
		$("#pageone").fadeOut(1000);
		$("#form").fadeIn(2000);
	});

	$("#target").submit(function(){
		socket.emit('register', $("#username").val(), $("#password").val(), $("#first").val(), $("#last").val(), $("#email").val(), function(id, verify){
			if(verify === true){
			identification = id;
			$("#form").fadeOut(1000);
			$("#tell").fadeIn(2000);
			}
			else{
				alert("That username is already taken");
			}
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
			console.log('got to start data: ' + data);
		data.interests.forEach(function(item){
				console.log(item);
				$.getJSON('https://www.googleapis.com/customsearch/v1?key=AIzaSyBXtEoqtV9NPkbmxgFXpeKnokzyPMRKxIk&cx=004477128878591810569:azzlpvtod_s&q=' + item, function(data){
					console.log(data);
					//console.log("Image location: " + data.items[1].pagemap.article[0].articlebody);
					console.log(data.items[0].pagemap.cse_thumbnail[0].src.length);
					$("#main").append("<div class='box'> <a href=" + data.items[0].link + " target='_blank'> <img src=" + data.items[0].pagemap.cse_thumbnail[0].src + " /> <div id='text'>  <div id='title'>   <h2>" + data.items[0].title + "</h2> </div> <div class='snippet'> <p>" + data.items[0].snippet +  "</p> </div> </div> </a> </div>");
				});
			});
		}
	});
});