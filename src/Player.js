
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

		this.health = 100;
		this.attack = 10;
		this.defense = 10;
	}

	draw(gc, entitySize){
		gc.fillStyle = this.color;
		gc.fillRect((this.defaultPos[0] + this.deltaPos[0]) - (entitySize / 2), (this.defaultPos[1] + this.deltaPos[1]) - (entitySize / 2), entitySize, entitySize);
	}

	attack(target, baseDamage){
		// Tweak
		var totalDamage = baseDamage * this.attack / target.defense;
		target.health -= totalDamage;
		return totalDamage;
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
			if(isCorridor(this.currentRoom) && !this.currentRoom.enemy.active){
				this.currentRoom.walls[this.headingDirection].walls[directions[(this.facingDirection + 2) % 4]] = this.currentRoom.walls[directions[(this.facingDirection + 2) % 4]];
				this.currentRoom.walls[directions[(this.facingDirection + 2) % 4]].walls[this.headingDirection] = this.currentRoom.walls[this.headingDirection];
			}
			this.currentRoom = room;
			this.currentRoom.visited = true;
			if(isCorridor(this.currentRoom)){ initiateCombat(); this.inCombat = true;}
			else							 this.inCombat = false;
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

	fight(){
		return "You dealt " + super.attack(this.currentRoom.enemy, 10) + " damage to " + this.currentRoom.enemy.name + ".";
	}

}