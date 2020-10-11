//var resolution = 6/8; // Ratio of the Canvas

var directions = ["north", "west", "south", "east"];
var debug = false;

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

// Draw entire dungeon, used for map drawing
function drawDungeon(gc){

	let drawnRooms = new Array();
	gc.fillStyle = "#FFFFFF";

	function drawRooms(room, x, y){

		gc.fillStyle = "#FFFFFF";

		if(room.visited || debug){ // Draw all rooms if in debug mode, else only draw the visited ones

			room.draw(gc, mapRoomSize(), [x, y])

		}
		drawnRooms.push(room);

		if(room === player.currentRoom){
			gc.fillStyle = "#FF0000";
			gc.fillRect(x - mapRoomSize() / 4, y - mapRoomSize() / 4, mapRoomSize() / 2, mapRoomSize() / 2);
			gc.fillStyle = "#FFFFFF";
		}

		// Draw neighbouring walls
		for(var i = 0; i < directions.length; i ++){

			if(isRoom(room.walls[directions[i]]) && !drawnRooms.includes(room.walls[directions[i]])){
				drawRooms(room.walls[directions[i]], x + (mapRoomSize() * 1.2 * (i % 2) * (i - 2)), y + (mapRoomSize() * 1.2 * ((i + 1) % 2) * ((i + 1) - 2)))
			}
		}

	}

	drawRooms(player.currentRoom, gameBoard.canvas.width / 2 + mapShift[0], gameBoard.canvas.height / 2 + mapShift[1]);

}

// Only draws the room the player is in, used outside of map
function drawPlayerView(gc){

	player.currentRoom.draw(gc, roomSize, roomCenter);

}

var viewingMap = false;

var roomSize = 200;

var combatOffset = roomSize / 3; // /* Tweak */

var mapRoomModifier = 10;
var mapRoomSize = function() {return roomSize / mapRoomModifier};

var roomCenter = [roomSize / 2 + 80, roomSize / 2 + 60]

var mapShift = [0, 0];

var frames = 0;

gameBoard.initialize(); // Initialize the gameBoard
//gameBoard.setResolution(resolution); // Set the resolution

var curFloorNo = 0;
var d = new Dungeon();
var floor; // Array representation of all rooms on the floor, index 0 is the starting room

var player = new Player();
player.defaultPos = roomCenter;

var enemy = new Enemy;

var commandManager = new CommandManager(player);

// Generate and move to the next floor
function nextFloor(){
	curFloorNo ++;
	floor = d.generateFloor(curFloorNo);
	player.setRoom(floor[0]);
	floor[0].visited = true;
}

// Starts a combat encounter
function initiateCombat(){
	player.inCombat = true;
	player.combatOffset[0] = [combatOffset * (player.facingDirection % 2) * (player.facingDirection - 2)]
	player.combatOffset[1] = [combatOffset * ((player.facingDirection + 1) % 2) * (player.facingDirection - 1)]

	enemy = new Enemy();
	enemy.facingDirection = (player.facingDirection + 2) % 4;
	enemy.combatOffset[0] = [combatOffset * (enemy.facingDirection % 2) * (enemy.facingDirection - 2)];
	enemy.combatOffset[1] = [combatOffset * ((enemy.facingDirection + 1) % 2) * (enemy.facingDirection - 1)];
	enemy.updatePositions();
	enemy.active = true;
}


nextFloor();

/*
	update: Update the gameBoard and entities
*/
function update(){

	frames++;
	gameBoard.update();
	gameBoard.draw();

	/*
		Animate the player
	*/
	if((Math.abs(player.deltaPos[0]) >= roomSize / 2 || Math.abs(player.deltaPos[1]) >= roomSize / 2) && player.moveTarget == "room"){
		if(Math.floor(Math.random() * 0) == 0 && !player.inCombat){
			initiateCombat();
			player.moveToNextRoom(new Corridor(player.headingDirection, player.currentRoom));
		}
		else{
			player.inCombat = false;
			player.moveToNextRoom(player.currentRoom.walls[player.headingDirection]);
		}
		
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

	if(!viewingMap){ // Draw player view
		drawPlayerView(gameBoard.gc);
		player.draw(gameBoard.gc, roomSize / 6);
		if(enemy.active){
			enemy.draw(gameBoard.gc, roomSize / 6);
		}
	}

	else{ // Draw map and check map controls (arrow keys to move and zoom)
		if(!gameBoard.keys.includes(16)){
			if(gameBoard.keys.includes(37)){
				mapShift[0] += 1 * (10 / mapRoomModifier);
			}
			if(gameBoard.keys.includes(38)){
				mapShift[1] += 1 * (10 / mapRoomModifier);
			}
			if(gameBoard.keys.includes(39)){
				mapShift[0] -= 1 * (10 / mapRoomModifier);
			}
			if(gameBoard.keys.includes(40)){
				mapShift[1] -= 1 * (10 / mapRoomModifier);
			}
		}
		else{
			if(gameBoard.keys.includes(38) && mapRoomModifier != 1){
				mapRoomModifier -= 1;
			}
			if(gameBoard.keys.includes(40) && mapRoomModifier != 25){
				mapRoomModifier += 1;
			}
		}
		drawDungeon(gameBoard.gc);
	}

	if(!player.inCombat) enemy.active = false;

 	if(gameBoard.command != ""){ // Get the next command
 		gameBoard.textField.innerHTML = gameBoard.textField.innerHTML + "<br><br>" + commandManager.resolveCommand(gameBoard.command);
		gameBoard.command = "";
	}

}

setInterval(update, 10) // Update the game every 10 milliseconds

