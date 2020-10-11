/*
	General representation of an entity
*/
class Entity {
	constructor(){
		this.facingDirection = 0;
		this.deltaPos = [0, 0];
		this.defaultPos = [0, 0];
		this.combatOffset = [0, 0];
		this.color = "#FF00FF";
	}

	draw(gc, entitySize){
		gc.fillStyle = this.color;
		gc.fillRect((this.defaultPos[0] + this.deltaPos[0]) - (entitySize / 2), (this.defaultPos[1] + this.deltaPos[1]) - (entitySize / 2), entitySize, entitySize);
	}
}

/*
	Character controlled by the player
*/
class Player extends Entity{
	
	constructor(){
		super();

		this.currentRoom = undefined;
		this.headingDirection = "none";
		this.moveTarget = "none";
		this.inCombat = false;
		this.inventory = [[Map], [1]];
		this.color = "#FF0000"
	}

	setRoom(room){
		this.currentRoom = room;
	}

	moveToNextRoom(room){
		if(this.headingDirection != "none" && this.moveTarget == "room"){
			this.currentRoom = room;//this.currentRoom.walls[this.headingDirection];
			this.currentRoom.visited = true;
			this.setMoveTarget("center");
		}
	}

	setNextMoveDirection(dir){
		this.headingDirection = dir;

		if(dir != "none"){
			this.facingDirection = directions.findIndex(d => d == dir);
		}
	}

	setMoveTarget(target){
		this.moveTarget = target;
	}

	update(){
		if(this.headingDirection != "none"){
			var dirId = directions.findIndex(d => d == this.headingDirection);
			this.deltaPos[((dirId) + 1) % 2] += ((Math.floor(dirId / 2) * 2) - 1) * 1.5 * (roomSize / 200);
		}

		if(this.inCombat){
			this.defaultPos = [roomCenter[0] - (this.combatOffset[0]), roomCenter[1] - (this.combatOffset[1])]
		}
		else{
			this.defaultPos = roomCenter;
			this.combatOffset = [0, 0];
		}
	}

	

}