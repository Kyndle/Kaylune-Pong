var canvasw = 640;
var canvash = 480;

var canvas;
var stage;
var gamestate;

//GAME SETTINGS
var paddlelength 	= 150;
var paddlewidth 	= 50;
var ballsize 		= 40;

//IMAGES
var background;

//	MENU
var menubackground;
var playbutton;
var creditsbutton;

//	CREDITS
var creditsscreen;

//	GAME
var playerpaddle;
var ball;
var cpupaddle;
var win;
var lose;

var playerscore;
var cpuscore;
var cpuspeed = 6;

var xspeed = 5;
var yspeed = 5;

//RENDERER
var ticker = new Object;
var preloader
var manifest;
var totalloaded = 0;

//CONTAINERS
var titleview;

function Main() {
	//link 
	stage = new createjs.Stage("gameCanvas");
	stage.mouseEventsEnabled = true;
	
	preload();
	
	ticker.framerate = 30;
	//stage.addEventListener(stage);
}


//BEGIN PRELOADER
function preload() {
	
	manifest = [
			//background
            {src:"images/background.png", id:"background"},
			{src:"images/background.png", id:"menubackground"},		//CHANGE
			//buttons
			{src:"images/playbutton.png", id:"playbutton"},
			//game objects
			{src:"images/paddle.png", id:"playerpaddle"},
			{src:"images/paddle.png", id:"cpupaddle"},
            {src:"images/ball.png", id:"ball"},
			//effects
			{src:"images/win.png", id:"win"},
			{src:"images/lose.png", id:"lose"}
    ];	
	
    preloader = new createjs.LoadQueue(true);        
    preloader.on("fileload", handleFileLoad);
    preloader.on("progress", handleProgress);
    preloader.on("complete", handleComplete);
    //preloader.on("error", loadError);
    preloader.loadManifest(manifest);
}

function handleProgress(event) {
	//use event.loaded to get the percentage of the loading
	//progress bar can go here
}

function handleComplete(event) {
	//triggered when all loading is complete
	//probably wont use?
}

function handleFileLoad(event) {
	//triggered when an individual file completes loading
	//image loaded
	var img = new Image();
	img.src = event.src;
	img.onload = handleLoadComplete;
	window[event.id] = new createjs.Bitmap(img);
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
	titleview = new Container();
	startbutton.x = canvasw/2;
	startbutton.y = canvash/2;
	startbutton.name = "startbutton";
	
	
	titleview.addChild(menubackground, startbutton);
	stage.addcChild(background, titleview);
	stage.update();
	
	startbutton.onPress = tweenTitleView;
}

//Move away the main menu with some pazazz
function tweenTitleView() {
	Tween.get(TitleView).to({y:-320}, 300).call(addGameView);
}

function addGameView() {
	//kill the main menu
	stage.removeChild(titleview);
	TitleView = null;
	
	//add the game view
	playerpaddle.x = canvasw/10
	playerpaddle.y = canvash/2;
	cpupaddle.x = (canvasw/10) * 9;
	cpupaddle.y = canvash/2;
	ball.x = canvasw/2 - 15;
	ball.y = canvash/2 - 15;
	
	//score stuff
	playerscore = new Text('0', 'bold 20px Arial', '#A3FF24');
    playerscore.x = canvasw/2 - 50;
    playerscore.y = 20;
     
    cpuscore = new Text('0', 'bold 20px Arial', '#A3FF24');
    cpuscore.x = canvasw/2 + 50;
    cpuscore.y = 20;
	
	//add stuff to stage
	stage.addChild(playerscore, cpuscore, playerpaddle, cpupaddle, ball);
	stage.update();
	
	//start listener
	background.onPress = startGame;
}

function startGame(e)
{
    background.onPress = null;
    stage.onMouseMove = movePaddle;
     
    Ticker.addListener(ticker, false);
    tkr.tick = update;
}