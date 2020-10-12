// Checks if an object is a room
function isRoom(obj){

	if(obj !== undefined){
		return obj.hasOwnProperty("walls");
	}

	return false;

}

// Checks if an object is a corridor
function isCorridor(obj){
	return isRoom(obj) && obj.hasOwnProperty("enemy");
}

/*
	General abstract class for structures in the dungeon
*/
class Construction {

	constructor(){
		
	}


	// Draw the representation of the room when it is a wall in another room
	drawAsWall(gc, dir, roomSize, roomCenter){

		gc.fillStyle = this.color;

		var corridorWidth = roomSize * 0.6;
		var corridorHeigth = roomSize / 7.5;

		gc.fillRect(roomCenter[0] + ((dir % 2) * ((roomSize / 2) * (dir - 2)) - ((dir == 1)? (corridorHeigth):0)) - (((dir + 1) % 2) * (corridorWidth / 2)),
					roomCenter[1] + (((dir + 1) % 2) * ((roomSize / 2) * (dir - 1)) - ((dir == 0)? (corridorHeigth):0)) - ((dir % 2) * (corridorWidth / 2)),
					(((dir + 1) % 2) * corridorWidth) + ((dir % 2) * corridorHeigth),
					((dir % 2) * corridorWidth) + (((dir + 1) % 2) * corridorHeigth)
					
			);

	}

}

/*
	Regular room, makes up most of the dungeon
*/
class Room extends Construction {
	
	constructor(){
		super();
		this.walls = {north: undefined, west: undefined, south: undefined, east: undefined};
		this.interactables = [];
		this.visited = false;
		this.color = "#F0F0F0";
	}

	initializeWallEvents(){

	}

	// Draw the room as itself
	draw(gc, roomSize, roomCenter){

		gc.fillStyle = "#FFFFFF";

		gc.fillRect(roomCenter[0] - (roomSize / 2), roomCenter[1] - (roomSize / 2), roomSize, roomSize);

		for(var i = 0; i < directions.length; i ++){

			if(this.walls[directions[i]] !== undefined){
				this.walls[directions[i]].drawAsWall(gc, i, roomSize, roomCenter);
			}

		}

	}

}

/*
	Room where combat encounters happen, isn't represented on the map
*/
class Corridor extends Room {

	constructor(entranceDir, exitedRoom){
		super()
		this.walls[directions[(directions.findIndex(d => d == entranceDir) + 2) % 4]] = exitedRoom;
		this.walls[entranceDir] = exitedRoom.walls[entranceDir];
		this.enemy = new Enemy();
	}

	draw(gc, roomSize, roomCenter){

		gc.fillStyle = "#F0F0F0";

		var combatRoomWidth = roomSize * 0.6;
		var combatRoomHeight = roomSize + roomSize / 3.75;

		var drawHeight = (player.facingDirection % 2) * combatRoomWidth + ((player.facingDirection + 1) % 2) * combatRoomHeight;
		var drawWidth = ((player.facingDirection + 1) % 2) * combatRoomWidth + (player.facingDirection % 2) * combatRoomHeight;

		gc.fillRect(roomCenter[0] - drawWidth / 2, roomCenter[1] - drawHeight / 2, drawWidth, drawHeight);

		this.enemy.draw(gc, roomSize / 6);

	}

	drawAsWall(gc, dir, roomSize, roomCenter){

		if(this.visited || debug) this.color = "#FF0000";
		else			 		  this.color = "#F0F0F0";

		super.drawAsWall(gc, dir, roomSize, roomCenter);

	}

}

/*
	Used to move to the next room. Functions have to be static since it is also an interactable.
*/
class Stairs extends Construction {

	static drawAsWall(gc, dir, roomSize, roomCenter){

		gc.fillStyle = "#00F000";

		var corridorWidth = roomSize * 0.6;
		var corridorHeigth = roomSize / 7.5;

		gc.fillRect(roomCenter[0] + ((dir % 2) * ((roomSize / 2) * (dir - 2)) - ((dir == 1)? (corridorHeigth):0)) - (((dir + 1) % 2) * (corridorWidth / 2)),
					roomCenter[1] + (((dir + 1) % 2) * ((roomSize / 2) * (dir - 1)) - ((dir == 0)? (corridorHeigth):0)) - ((dir % 2) * (corridorWidth / 2)),
					(((dir + 1) % 2) * corridorWidth) + ((dir % 2) * corridorHeigth),
					((dir % 2) * corridorWidth) + (((dir + 1) % 2) * corridorHeigth)
					
			);
	}

	static use(){
		nextFloor();
		return "Went down to floor " + curFloorNo + ".";
	}

}

/*
	Class responsible with dungeon generation
*/
class Dungeon {

	constructor(){
		this.curFloor = new Array()
	}

	generateFloor(floorNo){
		this.curFloor = new Array();

		var totalRooms = Math.round(5 + (Math.log(floorNo) * /** tweak **/ 3 ));
		var numRooms = 1;

		var numStairs = Math.floor(totalRooms / 10) + 1;

		let floor = Array.from(Array(totalRooms * 2 + 1), () => new Array(totalRooms * 2 + 1));
		let availableRooms = new Array();

		// Creates all the rooms on a grid
		function generateRooms(x, y, curFloor){

			var nextX, nextY;

			var toGenerate = Math.floor((Math.random() * 30) / 9);
			if(toGenerate == 0){toGenerate = 1}

			for(var n = 0; n < toGenerate; n ++){

				numRooms ++;
				var dir = Math.floor(Math.random() * 4); // 0: north, 1: west, 2: south, 3: east
				let triedDirs = new Array();

				while(floor[x + ((dir % 2) * (dir - 2))][y + (((dir + 1) % 2) * (dir - 1))] !== undefined){
					triedDirs.push(dir);
					dir = Math.floor(Math.random() * 4);
					if(triedDirs.length > 3){

						for(var x = 0; x < floor.length; x ++){
							for(var y = 0; y < floor.length; y ++){

								if(floor[x][y] !== undefined){
									generateRooms(x, y, curFloor);
									return;
								}

							}
						}
						break;
					}
				}

				floor[x + ((dir % 2) * (dir - 2))][y + (((dir + 1) % 2) * (dir - 1))] = new Room();
				nextX = x + ((dir % 2) * (dir - 2));
				nextY = y + (((dir + 1) % 2) * (dir - 1));

				curFloor.push(floor[nextX][nextY]);

			}

			if(numRooms < totalRooms){
				generateRooms(nextX, nextY, curFloor);
			}

		}

		floor[totalRooms][totalRooms] = new Room();
		this.curFloor.push(floor[totalRooms][totalRooms]);

		generateRooms(totalRooms, totalRooms, this.curFloor);

		// Returns the neighboring rooms of a given point on the grid and adds that room to the walls of the room on the point
		function checkForNeighbors(x, y){

			var available = 0;
			for(var dir = 0; dir < 4; dir ++){
				if(floor[x + ((dir % 2) * (dir - 2))][y + (((dir + 1) % 2) * (dir - 1))] !== undefined){

					floor[x][y].walls[directions[dir]] = floor[x + ((dir % 2) * (dir - 2))][y + (((dir + 1) % 2) * (dir - 1))];
				
					available += dir + 1;
				}
			}

			if(available != 10){
				availableRooms.push(floor[x][y]);
			}

		}

		// Create the graph structure of the dungeon
		for(var x = 0; x < floor.length; x ++){
			for(var y = 0; y < floor.length; y ++){

				if(floor[x][y] !== undefined){
					checkForNeighbors(x, y);
					floor[x][y].initializeWallEvents();
				}

			}
		}

		// Generate stairs
		for(var i = 0; i < numStairs; i ++){
			var randRoom = availableRooms[Math.floor(Math.random() * availableRooms.length)];

			let availableDirs = []
			for(var dir = 0; dir < 4; dir ++){
				if(randRoom.walls[directions[dir]] === undefined){ availableDirs.push(directions[dir]) }
			}

			var randDir = availableDirs[Math.floor(Math.random() * availableDirs.length)]
			randRoom.walls[randDir] = Stairs;
			randRoom.interactables.push(Stairs);
		}

		// Generate combat encounters
		for(var i = 0; i < totalRooms / 2 /* tweak */; i ++){

			var availableWalls = [];
			var randRoom;
			while(availableWalls.length == 0){

				randRoom = this.curFloor[Math.floor(Math.random() * this.curFloor.length)];
				for(var t = 0; t < 4; t ++){
					if(isRoom(randRoom.walls[directions[t]]) && !isCorridor(randRoom.walls[directions[t]])){
						availableWalls.push(t);
					}
				}
			}

			var randDir = availableWalls[Math.floor(Math.random() * availableWalls.length)];
			var corr = new Corridor(directions[randDir], randRoom);
			randRoom.walls[directions[randDir]].walls[directions[(randDir + 2) % 4]] = corr;
			randRoom.walls[directions[randDir]] = corr;

		}

		return this.curFloor;

	}

}

