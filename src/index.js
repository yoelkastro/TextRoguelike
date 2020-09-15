
//var resolution = 6/8; // Ratio of the Canvas

var directions = ["north", "west", "south", "east"];

// gameBoard is the object that has the canvas
var gameBoard = {
	
	canvas : document.createElement("canvas"),
	textFieldDiv : document.createElement("div"),
	textField : document.createElement("p"),
	textFieldLast : document.createElement("span"),
	inputField : document.createElement("input"),
	command : "",
	// Initialize the gameBoard
	initialize : function(){
		// Initialize the canvas
		this.canvas.setAttribute("style", "float: left; display: table-cell");
		document.body.appendChild(this.canvas);

		this.textFieldDiv.setAttribute("style", `display: table-cell; position: relative;`);
		document.body.appendChild(this.textFieldDiv);

		this.textField.setAttribute("style", `@import url(https://fonts.googleapis.com/css?family=Roboto+Slab&display=swap); font-family: 'Roboto Slab'; 
															font-size: 36px; display: table-cell; color: #FFFFFF; background: transparent;  outline: none;
															position: absolute; bottom: 0; left: 42px`);
		this.textFieldDiv.appendChild(this.textField);

		this.textFieldLast.setAttribute("style", `@import url(https://fonts.googleapis.com/css?family=Roboto+Slab&display=swap); font-family: 'Roboto Slab'; 
															font-size: 36px; display: table-cell; color: #FFFFFF; background: transparent;  outline: none;
															position: absolute; bottom: 0; left: 42px`);
		this.textField.appendChild(this.textFieldLast);
		

		this.inputField.setAttribute("style", `@import url(https://fonts.googleapis.com/css?family=Roboto+Slab&display=swap); font-family: 'Roboto Slab'; 
															font-size: 36px; display: table-cell; color: #FFFFFF; background: transparent;  border: none; outline: none; margin-left: 25px;
															position: absolute; left: 0px; top: 0px; width: 0px; height: 44px`);// border: none;
		this.inputField.setAttribute("placeholder", ">>");
		document.body.appendChild(this.inputField);

		this.gc = this.canvas.getContext("2d");

		this.desiredWidth = function() {return window.innerWidth / 3.5};
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
		roomSize = window.innerWidth / 7;

		if(!viewingMap){
			roomCenter = [roomSize / 2 + 80, roomSize / 2 + 60];
		}
		else{
			roomCenter = [roomSize / 2 + 80, roomSize / 2 + 60];
		}
		
		
		player.defaultPos = roomCenter;

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

		this.inputField.style.width = ((window.innerWidth - this.canvas.width) - 75).toString() + "px"; 
		this.inputField.style.left = (this.canvas.width + 25).toString() + "px";
		this.inputField.style.top = ((this.canvas.height + Number(this.inputField.style.height.substring(0, this.inputField.style.height.length - 2))) - 150).toString() + "px";

		this.textFieldDiv.style.height = (this.inputField.style.top.substring(0, this.inputField.style.top.length - 2) - 25).toString() + "px";
		this.textFieldDiv.style.width = this.inputField.style.width;

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

function drawDungeon(gc){

	let drawnRooms = new Array();
	gc.fillStyle = "#FFFFFF";

	// Draw entire dungeon

	function drawRooms(room, x, y){

		if(room.visited){
			gc.fillRect(x - mapRoomSize() / 2, y - mapRoomSize() / 2, mapRoomSize(), mapRoomSize());

			for(var i = 0; i < directions.length; i ++){

				if(room.walls[directions[i]] !== undefined){
					room.walls[directions[i]].drawAsWall(gc, i, mapRoomSize(), [x, y]);
				}

			}
		}
		drawnRooms.push(room);

		if(room === player.currentRoom){
			gc.fillStyle = "#FF0000";
			gc.fillRect(x - mapRoomSize() / 4, y - mapRoomSize() / 4, mapRoomSize() / 2, mapRoomSize() / 2);
			gc.fillStyle = "#FFFFFF";
		}

		
		for(var i = 0; i < directions.length; i ++){

			if(room.walls[directions[i]] !== undefined && !drawnRooms.includes(room.walls[directions[i]])){
				drawRooms(room.walls[directions[i]], x + (mapRoomSize() * 1.2 * (i % 2) * (i - 2)), y + (mapRoomSize() * 1.2 * ((i + 1) % 2) * ((i + 1) - 2)))
			}

		}

	}

	drawRooms(player.currentRoom, gameBoard.canvas.width / 2 + mapShift[0], gameBoard.canvas.height / 2 + mapShift[1]);

}

function drawPlayerView(gc){

	gc.fillStyle = "#FFFFFF";

	gc.fillRect(roomCenter[0] - (roomSize / 2), roomCenter[1] - (roomSize / 2), roomSize, roomSize);

	for(var i = 0; i < directions.length; i ++){

		if(player.currentRoom.walls[directions[i]] !== undefined){
			player.currentRoom.walls[directions[i]].drawAsWall(gc, i, roomSize, roomCenter);
		}

	}
}

var viewingMap = false;

var roomSize = 200;
var mapRoomSize = function() {return roomSize / 10};
var roomCenter = [roomSize / 2 + 80, roomSize / 2 + 60]
var mapShift = [0, 0];

var frames = 0;

gameBoard.initialize(); // Initialize the gameBoard
//gameBoard.setResolution(resolution); // Set the resolution

var d = new Dungeon();
var floor = d.generateFloor(6);

var player = new Player();
player.setRoom(floor[0]);
floor[0].visited = true;
player.defaultPos = roomCenter;

var commandManager = new CommandManager(player);


/*
	update: Update the gameBoard and entities
*/
function update(){

	frames++;
	gameBoard.update();
	gameBoard.draw();

	if((Math.abs(player.deltaPos[0]) >= roomSize / 2 || Math.abs(player.deltaPos[1]) >= roomSize / 2) && player.moveTarget == "room"){
		player.moveToNextRoom();
		var dir = directions.findIndex(d => d == player.headingDirection);
		player.deltaPos[0] *= -1;
		player.deltaPos[1] *= -1;
	}

	if(Math.abs(player.deltaPos[0]) <= 3 && Math.abs(player.deltaPos[1]) <= 3 && player.moveTarget == "center"){
		player.setMoveTarget("none");
		player.setNextMoveDirection("none");
		player.deltaPos = [0, 0];

	}

	player.update();

	//drawDungeon(floor, gameBoard.gc);
	if(!viewingMap){
		drawPlayerView(gameBoard.gc);
		player.draw(gameBoard.gc, roomSize / 6);
	}
	else{
		if(gameBoard.keys.includes(37)){
			mapShift[0] += 1;
		}
		if(gameBoard.keys.includes(38)){
			mapShift[1] += 1;
		}
		if(gameBoard.keys.includes(39)){
			mapShift[0] -= 1;
		}
		if(gameBoard.keys.includes(40)){
			mapShift[1] -= 1;
		}
		drawDungeon(gameBoard.gc);
	}
	//console.log(roomCenter[0] - player.canvasCoords);
 	if(gameBoard.command != ""){
 		gameBoard.textField.innerHTML = gameBoard.textField.innerHTML + "<br><br>" + commandManager.resolveCommand(gameBoard.command);
		gameBoard.command = "";
	}
	//commandManager.resolveCommand(prompt("dir", ""));

}

setInterval(update, 10) // Update the game every 10 milliseconds

