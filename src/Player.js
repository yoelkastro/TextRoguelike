class Player {
	
	constructor(){
		this.currentRoom = undefined;
		this.headingDirection = "none";
		this.moveTarget = "none";
		this.deltaPos = [0, 0];
		this.defaultPos = [0, 0];

		this.inventory = [[Map], [1]];
	}

	setRoom(room){
		this.currentRoom = room;
	}

	moveToNextRoom(){
		if(this.headingDirection != "none" && this.moveTarget == "room"){
			this.currentRoom = this.currentRoom.walls[this.headingDirection];
			this.setMoveTarget("center");
		}
	}

	setNextMoveDirection(dir){
		this.headingDirection = dir;
	}

	setMoveTarget(target){
		this.moveTarget = target;
	}

	update(){
		if(this.headingDirection != "none"){
			var dirId = directions.findIndex(d => d == this.headingDirection);
			this.deltaPos[((dirId) + 1) % 2] += ((Math.floor(dirId / 2) * 2) - 1) * 1.5 * (roomSize / 200);
		}
	}

	draw(gc, playerSize){
		gc.fillStyle = "#FF0000";
		gc.fillRect((this.defaultPos[0] + this.deltaPos[0]) - (playerSize / 2), (this.defaultPos[1] + this.deltaPos[1]) - (playerSize / 2), playerSize, playerSize);
	}

}