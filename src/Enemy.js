/*
	The enemy.
*/
class Enemy extends Entity {
	
	constructor() {
		super();
		this.active = false;
	}

	updatePositions(){
		this.defaultPos = [roomCenter[0] - (this.combatOffset[0]), roomCenter[1] - (this.combatOffset[1])];
	}

}