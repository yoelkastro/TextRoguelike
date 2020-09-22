function isRoom(obj){

	if(obj !== undefined){
		if(obj.hasOwnProperty("walls")){
			return true;
		}
	}

	return false;

}

class Construction {

	constructor(){}

	drawAsWall(gc, dir, roomSize, roomCenter){

		gc.fillStyle = "#F0F0F0";

		var corridorWidth = roomSize * 0.6;
		var corridorHeigth = roomSize / 7.5;

		gc.fillRect(roomCenter[0] + ((dir % 2) * ((roomSize / 2) * (dir - 2)) - ((dir == 1)? (corridorHeigth):0)) - (((dir + 1) % 2) * (corridorWidth / 2)),
					roomCenter[1] + (((dir + 1) % 2) * ((roomSize / 2) * (dir - 1)) - ((dir == 0)? (corridorHeigth):0)) - ((dir % 2) * (corridorWidth / 2)),
					(((dir + 1) % 2) * corridorWidth) + ((dir % 2) * corridorHeigth),
					((dir % 2) * corridorWidth) + (((dir + 1) % 2) * corridorHeigth)
					
			);

	}

}

class Room extends Construction {
	
	constructor(){
		super();
		this.walls = {north: undefined, west: undefined, south: undefined, east: undefined};
		this.interactables = [];
		this.visited = false;
	}

	initializeWallEvents(){

	}

	drawAsWall(gc, dir, roomSize, roomCenter){

		gc.fillStyle = "#F0F0F0";

		var corridorWidth = roomSize * 0.6;
		var corridorHeigth = roomSize / 7.5;

		gc.fillRect(roomCenter[0] + ((dir % 2) * ((roomSize / 2) * (dir - 2)) - ((dir == 1)? (corridorHeigth):0)) - (((dir + 1) % 2) * (corridorWidth / 2)),
					roomCenter[1] + (((dir + 1) % 2) * ((roomSize / 2) * (dir - 1)) - ((dir == 0)? (corridorHeigth):0)) - ((dir % 2) * (corridorWidth / 2)),
					(((dir + 1) % 2) * corridorWidth) + ((dir % 2) * corridorHeigth),
					((dir % 2) * corridorWidth) + (((dir + 1) % 2) * corridorHeigth)
					
			);

	}

}

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


		for(var x = 0; x < floor.length; x ++){
			for(var y = 0; y < floor.length; y ++){

				if(floor[x][y] !== undefined){
					checkForNeighbors(x, y);
					floor[x][y].initializeWallEvents();
				}

			}
		}


		for(var i = 0; i < numStairs; i ++){
			var randRoom = availableRooms[Math.floor(Math.random() * availableRooms.length)];

			let availableDirs = []
			for(var dir = 0; dir < 4; dir ++){
				if(randRoom.walls[directions[dir]] === undefined){ availableDirs.push(directions[dir]) }
			}

			var randDir = availableDirs[Math.floor(Math.random() * availableDirs.length)]
			randRoom.walls[randDir] = Stairs;
			console.log(randRoom);
			randRoom.interactables.push(Stairs);
		}

		return this.curFloor;

	}

}

