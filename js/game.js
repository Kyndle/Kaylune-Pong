var canvasw = 640;
var canvash = 480;

var canvas;
var stage;
var gamestate;

//GAME SETTINGS
var paddlelength 	= 150;
var paddlewidth 	= 50;
var ballsize 		= 40;
var fps 			= 60;
var winscore		= 3;

//IMAGES
var background;

//	MENU
var title;
var menubackground;
var playbutton;
var easybutton;
var mediumbutton;
var hardbutton;

//	CREDITS
var creditsscreen;

//	GAME
var playerpaddle;
var easypaddle;
var mediumpaddle;
var hardpaddle;
var ball;
var cpupaddle;
var win;
var lose;

var playerscore;
var cpuscore;
var cpuspeed = 3;

var xspeed;
var yspeed;
var speedcap = 30;

var difficulty;

//RENDERER
var ticker = new Object;
var preloader
var manifest;
var totalloaded = 0;

//CONTAINERS
var titleview = new createjs.Container();
var loadingscreen = new createjs.Container();

function init() {
	//link 
	stage = new createjs.Stage("gameCanvas");
	stage.mouseEventsEnabled = true;
	
	showLoadingScreen(true);
	preload();
	
	//stage.addEventListener(stage);
}

function showLoadingScreen(bool) {
	console.log("showLoadingScreen("+bool+")");
	if(bool) {
		var rect = new createjs.Shape();
		rect.graphics.beginFill("#000").drawRect(0, 0, canvasw, canvash);
		
		var text = new createjs.Text('Loading...', 'bold 40px Arial', '#FFF');
		text.x = canvasw/2 - 50;
		text.y = canvash/2 - 20;
		
	} else {
		loadingscreen.removeAllChildren();
	}
}

//BEGIN PRELOADER
function preload() {
	
	//Files to load
	manifest = [
		{src:"images/background.png", 		id:"background"},
		{src:"images/title.png", 			id:"title"},
		{src:"images/menubackground.png", 	id:"menubackground"},
		{src:"images/playbutton.png",		id:"playbutton"},
		{src:"images/easybutton.png",		id:"easybutton"},
		{src:"images/mediumbutton.png",		id:"mediumbutton"},
		{src:"images/hardbutton.png",		id:"hardbutton"},
		{src:"images/paddleeasy.png", 		id:"playerpaddle"},
		{src:"images/paddleeasy.png", 		id:"easypaddle"},
		{src:"images/paddlemedium.png", 	id:"mediumpaddle"},
		{src:"images/paddlehard.png", 		id:"hardpaddle"},
		{src:"images/paddlehard.png", 		id:"cpupaddle"},
		{src:"images/ball.png", 			id:"ball"},
		{src:"images/win.png",				id:"win"},
		{src:"images/lose.png", 			id:"lose"}
    ];	
	
	//Define preloader and set handler functions
    preloader = new createjs.LoadQueue(true);        
    preloader.on("fileload", handleFileLoad);
    preloader.on("progress", handleProgress);
    preloader.on("complete", handleComplete);
    //preloader.on("error", loadError);
	
	//load the above manifest
	preloader.loadManifest(manifest);
}

function handleProgress(event) {
	//use event.loaded to get the percentage of the loading
	//progress bar can go here
}

function handleComplete(event) {
	//triggered when all loading is complete
	console.log("handleComplete()");
	showLoadingScreen(false);
	addTitleView();
}

function handleFileLoad(event) {
	//triggered when an individual file completes loading
	
	console.log("Loaded Image: " + event.item.id);
	
	//Assign each loaded image to a variable when loaded
	switch(event.item.id) {
		case "background":
			background = new createjs.Bitmap(event.result);		
		case "title":
			title = new createjs.Bitmap(event.result);
		case "menubackground":
			menubackground = new createjs.Bitmap(event.result);
		case "playbutton":
			playbutton = new createjs.Bitmap(event.result);		
		case "easybutton":
			easybutton = new createjs.Bitmap(event.result);		
		case "mediumbutton":
			mediumbutton = new createjs.Bitmap(event.result);		
		case "hardbutton":
			hardbutton = new createjs.Bitmap(event.result);
		case "playerpaddle":
			playerpaddle = new createjs.Bitmap(event.result);		
		case "easypaddle":
			easypaddle = new createjs.Bitmap(event.result);		
		case "mediumpaddle":
			mediumpaddle = new createjs.Bitmap(event.result);		
		case "hardpaddle":
			hardpaddle = new createjs.Bitmap(event.result);
		case "cpupaddle":
			cpupaddle = new createjs.Bitmap(event.result);
		case "ball":
			ball = new createjs.Bitmap(event.result);
		case "win":
			win = new createjs.Bitmap(event.result);
		case "lose":
			lose = new createjs.Bitmap(event.result);
	}

}

//This function is used to check when it is okay to show the main menu
function handleLoadComplete() {
	totalloaded++;
	if(manifest.length==totalloaded) { //if manifest is loaded, load main menu
		addTitleView();
	}
}
//END

//Create the main menu
function addTitleView() {
	console.log("Loading Main Menu...");
	
	title.x = canvasw/2 - 310;
	title.y = canvash/2 - 50;
	
	playbutton.x = canvasw/2 + 50;
	playbutton.y = canvash/2 - 20;
	
	easybutton.x = canvasw/2 + 75;
	easybutton.y = canvash/2 - 60;	
	easybutton.visible = false;
	
	mediumbutton.x = canvasw/2 + 75;
	mediumbutton.y = canvash/2;
	mediumbutton.visible = false;
	
	hardbutton.x = canvasw/2 + 75;
	hardbutton.y = canvash/2 + 60;
	hardbutton.visible = false;
	
	titleview.addChild(menubackground, title, playbutton, easybutton, mediumbutton, hardbutton);
	stage.addChild(background, titleview);
	stage.update();
	console.log("Loaded Main Menu.");
	
	//playbutton.addEventListener("click", function() { tweenTitleView() });
	playbutton.addEventListener("click", function() { 
		playbutton.visible 		= false;
		easybutton.visible 		= true;
		mediumbutton.visible	= true;
		hardbutton.visible		= true;
		stage.update();
	});
	
	easybutton.addEventListener("click", 	function() {difficulty = 1; addGameView(); } );
	mediumbutton.addEventListener("click", 	function() {difficulty = 2; addGameView(); } );
	hardbutton.addEventListener("click",	function() {difficulty = 3; addGameView(); } );
}

function tweenTitleView() {
	//createjs.Tween.get(stage).to({alpha: 0.4}, 1000).call( addGameView() );
}

function addGameView() {
	//kill the main menu
	stage.removeChild(titleview);
	console.log("difficulty = " + difficulty);
	switch(difficulty) {
		case 1:
			playerpaddle.image = easypaddle.image;
			cpupaddle.image = easypaddle.image;
			break;
		case 2:
			playerpaddle.image = mediumpaddle.image;
			cpupaddle.image = mediumpaddle.image;
			xspeed *= difficulty;
			yspeed *= difficulty;
			break;
		case 3:
			playerpaddle.image = hardpaddle.image;
			cpupaddle.image = hardpaddle.image;
			xspeed *= difficulty;
			yspeed *= difficulty;
			break;
	}
	
	//add the game view
	playerpaddle.x = canvasw/10
	playerpaddle.y = canvash/2 - 50;
	cpupaddle.x = (canvasw/10) * 9;
	cpupaddle.y = canvash/2 - 50;
	ball.x = canvasw/2 - 15;
	ball.y = canvash/2 - 15;
	
	//score stuff
	playerscore = new createjs.Text('0', 'bold 40px Arial', '#A3FF24');
    playerscore.x = canvasw/2 - 50;
    playerscore.y = 20;
     
    cpuscore = new createjs.Text('0', 'bold 40px Arial', '#A3FF24');
    cpuscore.x = canvasw/2 + 50;
    cpuscore.y = 20;
	
	//add stuff to stage
	stage.addChild(playerscore, cpuscore, playerpaddle, cpupaddle, ball);
	stage.update();
	
	//start listener
	background.addEventListener("click", startGame);
}

//Start the game and Ticker
function startGame(event) {
	console.log("Game Started.");
	setRandomServe();
	background.removeEventListener("click", startGame);
	//document.getElementById('gameCanvas').style.cursor = "none";
	createjs.Ticker.addEventListener("tick", update);
	createjs.Ticker.addEventListener("tick", movePaddle);
	createjs.Ticker.framerate = fps;
	//createjs.Ticker.timingMode = createjs.Ticker.RAF;

}

//Reset the paddles and ball
function reset() {
	ball.x = canvasw/2 - 15;
	ball.y = canvash/2 - 15;
	playerpaddle.y = canvash/2 - 50;
	cpupaddle.y = canvash/2 - 50;
	
	setRandomServe();

	createjs.Ticker.removeAllEventListeners();
	background.addEventListener("click", startGame);
}

function movePaddle() {
	playerpaddle.y= stage.mouseY - (playerpaddle.image.height/2);
}

function setRandomServe() {
	//Randomly serve the ball to the left or the right
	if(Math.random() >= 0.5) 
		xspeed = Math.floor(Math.random() * difficulty+3) + difficulty+1  
	else
		xspeed = (Math.floor(Math.random() * difficulty+3) + difficulty+1) * -1
	
	//Randomly serve the ball up or down
	if(Math.random() >= 0.5) 
		yspeed = Math.floor(Math.random() * difficulty*2) + difficulty+1  
	else
		yspeed = (Math.floor(Math.random() * difficulty*2) + difficulty+1) * -1
}

//Update the screen on every tick
function update(event) {
	
	if(!event.paused) {
		
		//BALL MOVEMENT
		ball.x += xspeed;
		ball.y += yspeed;
	
		//CPU PADDLE MOVEMENT (AI)
		if(cpupaddle.y + (cpupaddle.image.height/2) < ball.y) {
			cpupaddle.y += cpuspeed * (difficulty * 0.75);
		} else if(cpupaddle.y + (cpupaddle.image.height/2) > ball.y) {
			cpupaddle.y -= cpuspeed * (difficulty * 0.75) ;
		}
	
		//WALL COLLISION
		if(ball.y < 0) {	yspeed = -yspeed; ball.y++;	}
		if(ball.y + ball.image.height > canvash) {	yspeed = -yspeed; ball.y--;	}

		//SCORE
		//If cpu scores
		if(ball.x < 0) {
			cpuscore.text = parseInt(cpuscore.text + 1); 
			reset();
		}
		//If player scores
		if(ball.x > canvasw - ball.image.width) {
			playerscore.text = parseInt(playerscore.text + 1); 
			reset();
		}
	
		//CPU BALL COLLISION
		if (ball.x + ball.image.width >= cpupaddle.x
			&& ball.y >= cpupaddle.y
			&& ball.y + ball.image.height <= (cpupaddle.y + cpupaddle.image.height)) {
			ball.x = (cpupaddle.x - ball.image.width);  	
			
			if(xspeed <= speedcap && xspeed >= -speedcap) {
				xspeed = -xspeed - 1;
			} else {
				xspeed = -xspeed;
			}

			if(ball.y + (ball.image.height/2) > cpupaddle.y + (cpupaddle.image.height/2)) {
				yspeed = 3.5 + difficulty;
			} else {
				yspeed = -3.5 - difficulty;
			}
		}
	
		//PLAYER BALL COLLISION
		if (ball.x <= (playerpaddle.x + playerpaddle.image.width) 
			&& ball.x + ball.image.width > playerpaddle.x
			&& ball.y >= playerpaddle.y
			&& ball.y + ball.image.height < (playerpaddle.y + playerpaddle.image.height)) {
				
			ball.x = (playerpaddle.x + playerpaddle.image.width)+1;  	
			
			if(xspeed <= speedcap && xspeed >= -speedcap) {
				xspeed = -xspeed + 1;
			} else {
				xspeed = -xspeed;
			}
			
			if(ball.y + (ball.image.height/2) > playerpaddle.y + (playerpaddle.image.height/2)) {
				yspeed = 3.5 + difficulty;
			} else {
				yspeed = -3.5 - difficulty;
			}
		}
		
		//PADDLE BOUNDS CHECK
		if(playerpaddle.y + playerpaddle.image.height > canvash) { playerpaddle.y = canvash - playerpaddle.image.height}
		if(playerpaddle.y < 0) { playerpaddle.y = 0 }
		if(cpupaddle.y + cpupaddle.image.height > canvash) { cpupaddle.y = canvash - cpupaddle.image.height}
		if(cpupaddle.y < 0) { cpupaddle.y = 0 }
	
		//WIN CHECK
		if(playerscore.text == parseInt(winscore)) {
			endgame('win');
		}
	
		if(cpuscore.text == parseInt(winscore)) {
			endgame('lose');
		}
	
		stage.update();
	}
	
	function endgame(event) {
		createjs.Ticker.removeAllEventListeners();
		stage.removeAllEventListeners();
		background.removeAllEventListeners();
		
		if(event == 'win') {
			win.x = canvasw/2 - win.image.width/2;
			win.y = canvash/2 - win.image.height/2;
			stage.addChild(win);
		} else {
			lose.x = canvasw/2 - win.image.width/2;
			lose.y = canvash/2 - win.image.height/2;
			stage.addChild(lose);
		}
		
		stage.addEventListener("click", function() { stage.removeAllChildren(); init(); });
		stage.update();
	}
}