class Room {
	
	constructor(){
		this.walls = {north: undefined, west: undefined, south: undefined, east: undefined};
		this.interactables = [];
		this.visited = false;
	}

	initializeWallEvents(){

	}

	drawAsWall(gc, dir, roomSize, roomCenter){

		gc.fillStyle = "#F0F0F0";

		var corridorWidth = roomSize * 0.8;
		var corridorHeigth = roomSize / 10;

		gc.fillRect(roomCenter[0] + ((dir % 2) * ((roomSize / 2) * (dir - 2)) - ((dir == 1)? (corridorHeigth):0)) - (((dir + 1) % 2) * (corridorWidth / 2)),
					roomCenter[1] + (((dir + 1) % 2) * ((roomSize / 2) * (dir - 1)) - ((dir == 0)? (corridorHeigth):0)) - ((dir % 2) * (corridorWidth / 2)),
					(((dir + 1) % 2) * corridorWidth) + ((dir % 2) * corridorHeigth),
					((dir % 2) * corridorWidth) + (((dir + 1) % 2) * corridorHeigth)
					
			);

	}	

}

class Dungeon {

	constructor(){
		this.curFloor = new Array()
	}

	generateFloor(floorNo){
		this.curFloor = new Array();

		var totalRooms = 5 + (Math.pow(floorNo, 2));
		var numFloors = 1;

		let floor = Array.from(Array(totalRooms * 2 + 1), () => new Array(totalRooms * 2 + 1));

		function generateRooms(x, y, curFloor){

			var nextX, nextY;

			var toGenerate = Math.floor((Math.random() * 30) / 9);
			if(toGenerate == 0){toGenerate = 1}

			for(var n = 0; n < toGenerate; n ++){

				numFloors ++;
				var dir = Math.floor(Math.random() * 4); // 0: north, 1: west, 2: south, 3: east
				let triedDirs = new Array();

				while(floor[x + ((dir % 2) * (dir - 2))][y + (((dir + 1) % 2) * (dir - 1))] !== undefined){
					triedDirs.push(dir);
					dir = Math.floor(Math.random() * 4);
					if(triedDirs.length > 3){

						for(var x = 0; x < floor.length; x ++){
							var done = false;
							for(var y = 0; y < floor.length; y ++){

								if(floor[x][y] !== undefined){
									generateRooms(x, y, curFloor);
									done = true;
									break;
								}

							}
							if(done){
								break;
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

			if(numFloors < totalRooms){
				generateRooms(nextX, nextY, curFloor);
			}

		}

		floor[totalRooms][totalRooms] = new Room();
		this.curFloor.push(floor[totalRooms][totalRooms]);

		generateRooms(totalRooms, totalRooms, this.curFloor);

		function checkForNeighbors(x, y){

			for(var dir = 0; dir < 4; dir ++){
				if(floor[x + ((dir % 2) * (dir - 2))][y + (((dir + 1) % 2) * (dir - 1))] !== undefined){
					switch(dir){
						case 0: floor[x][y].walls.north = floor[x + ((dir % 2) * (dir - 2))][y + (((dir + 1) % 2) * (dir - 1))]; break;
						case 1: floor[x][y].walls.west = floor[x + ((dir % 2) * (dir - 2))][y + (((dir + 1) % 2) * (dir - 1))]; break;
						case 2: floor[x][y].walls.south = floor[x + ((dir % 2) * (dir - 2))][y + (((dir + 1) % 2) * (dir - 1))]; break;
						case 3: floor[x][y].walls.east = floor[x + ((dir % 2) * (dir - 2))][y + (((dir + 1) % 2) * (dir - 1))]; break;
					}
				}
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
		return this.curFloor;

	}

}