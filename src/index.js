
var resolution = 6/8; // Ratio of the Canvas

// gameBoard is the object that has the canvas
var gameBoard = {
	
	canvas : document.createElement("canvas"),
	textField : document.createElement("p"),
	inputField : document.createElement("input"),
	command : "",
	// Initialize the gameBoard
	initialize : function(){
		// Initialize the canvas
		this.canvas.setAttribute("style", "float: left; display: table-cell");
		document.body.appendChild(this.canvas);

		this.textField.innerHTML = "test";
		this.textField.setAttribute("style", `@import url(https://fonts.googleapis.com/css?family=Roboto+Slab&display=swap); font-family: 'Roboto Slab'; 
															font-size: 36px; display: table-cell; color: #FFFFFF; background: transparent;  outline: none; margin-left: 25px; padding-left: 25px`);
		document.body.appendChild(this.textField);

		this.inputField.setAttribute("style", `@import url(https://fonts.googleapis.com/css?family=Roboto+Slab&display=swap); font-family: 'Roboto Slab'; 
															font-size: 36px; display: table-cell; color: #FFFFFF; background: transparent;  border: none; outline: none; margin-left: 25px;
															position: absolute; left: 0px; top: 0px; width: 0px; height: 54px`);// border: none;
		this.inputField.setAttribute("placeholder", ">>");
		document.body.appendChild(this.inputField);

		this.gc = this.canvas.getContext("2d");

		this.desiredWidth = function() {return window.innerWidth / 2};
		this.desiredHeight = function() {return window.innerHeight - 20};

		this.canvas.width = this.desiredWidth;
		this.canvas.height = this.desiredHeight;

		this.keys = [];
		// Add action listeners for the mouse and keyboard
		window.addEventListener('mousemove', function (e) {
     		gameBoard.mouseX = e.pageX;
      		gameBoard.mouseY = e.pageY;
    	});
    	window.addEventListener('keyup', function (e) {
     		gameBoard.keys = gameBoard.keys.filter(item => item != e.keyCode);
    	});
    	window.addEventListener('keydown', function (e) {
    		if(!gameBoard.keys.includes(e.keyCode)){
     			gameBoard.keys.push(e.keyCode);
     		}
    	});
	},
	// Set the desired resolution for the canvas, in width over height
	setResolution : function(res){
		this.resolution = res;
	},
	// Draw static objects; There are currently no static objects
	draw : function(){
		this.gc.fillStyle = "#000000";
		this.gc.fillRect(0, 0, this.canvas.width, this.canvas.height)
	},
	// Resize the canvas depending on how much space is available
	resize : function(){
		// If the width to height ratio is larger than desired, use height as the basis for size
		if((this.desiredWidth() / this.desiredHeight()) < this.resolution){
			this.canvas.width = this.desiredWidth();
			this.canvas.height = this.desiredWidth() / this.resolution;
		}
		// If the width to height ratio is smaller than desired, use width as the basis for size
		else if((this.desiredWidth() / this.desiredHeight()) > this.resolution){
			this.canvas.width = this.desiredHeight() * this.resolution;
			this.canvas.height = this.desiredHeight();
		}
		// If the width to height ratio is the same as the desired ratio, both can be used
		else{
			this.canvas.width = this.desiredWidth();
			this.canvas.height = (this.desiredHeight() - 20);
		}

		console.log(this.inputField.style.height);
		this.inputField.style.width = ((window.innerWidth - this.canvas.width) - 75).toString() + "px"; 
		this.inputField.style.left = (this.canvas.width + 25).toString() + "px";
		this.inputField.style.top = ((this.canvas.height + Number(this.inputField.style.height.substring(0, this.inputField.style.height.length - 2))) - 150).toString() + "px";

		this.textField.style.height = (this.inputField.style.top.substring(0, this.inputField.style.top.length - 2) - 25).toString() + "px";
		this.textField.style.width = this.inputField.style.width;

	},
	// Clear all the drawing in the gameBoard
	clear : function(){
		this.gc.clearRect(0, 0, this.canvas.width, this.canvas.height);
	},

	// Returns the size of the canvas
	getSize : function(){
		return [this.canvas.width, this.canvas.height]
	},

	// Updates the canvas
	update : function(){
		if(this.keys.includes(13)){ // Enter pressed
			this.command = this.inputField.value;
			this.inputField.value = "";
		}
		this.inputField.focus();
		this.clear();
		this.resize();
		// this.draw();
	}

}

function drawDungeon(floorMap, gc){

	let drawnRooms = new Array();
	gc.fillStyle = "#FFFFFF";

	function drawRooms(room, x, y){
		var roomSize = 60;

		gc.fillRect(x - roomSize / 2, y - roomSize / 2, roomSize, roomSize);
		drawnRooms.push(room);

		if(room === player.currentRoom){
			gc.fillStyle = "#FF0000";
			gc.fillRect(x - roomSize / 4, y - roomSize / 4, roomSize / 2, roomSize / 2);
			gc.fillStyle = "#FFFFFF";
		}

		if(typeof room.walls.north !== 'undefined' && !drawnRooms.includes(room.walls.north)){ // To-Do: Rewrite !!
			drawRooms(room.walls.north, x, y - roomSize * 1.2);
		}
		if(typeof room.walls.south !== 'undefined' && !drawnRooms.includes(room.walls.south)){
			drawRooms(room.walls.south, x, y + roomSize * 1.2);
		}
		if(typeof room.walls.west !== 'undefined' && !drawnRooms.includes(room.walls.west)){
			drawRooms(room.walls.west, x - roomSize * 1.2, y);
		}
		if(typeof room.walls.east !== 'undefined' && !drawnRooms.includes(room.walls.east)){
			drawRooms(room.walls.east, x + roomSize * 1.2, y);
		}

	}

	drawRooms(floorMap[0], gameBoard.canvas.width / 2, gameBoard.canvas.height / 2);

}

var frames = 0;

gameBoard.initialize(); // Initialize the gameBoard
gameBoard.setResolution(resolution); // Set the resolution

var d = new Dungeon();
var floor = d.generateFloor(0);

var player = new Player();
player.setRoom(floor[0]);
var commandManager = new CommandManager(player);


/*
	update: Update the gameBoard and entities
*/
function update(){

	frames++;
	gameBoard.update();
	gameBoard.draw();
	if(gameBoard.keys.includes(37)){
		console.log('left')
		floor = d.generateFloor(0);
		player.setRoom(floor[0]);
	}
	drawDungeon(floor, gameBoard.gc);
	if(gameBoard.command != ""){
		commandManager.resolveCommand(gameBoard.command);
		gameBoard.command = "";
	}
	//commandManager.resolveCommand(prompt("dir", ""));

}

setInterval(update, 10) // Update the game every 10 milliseconds

