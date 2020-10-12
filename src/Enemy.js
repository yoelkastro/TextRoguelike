/*
	The enemy.
*/
class Enemy extends Entity {
	
	constructor() {
		super();
		this.active = true;
	}

	updatePositions(){
		this.defaultPos = [roomCenter[0] - (this.combatOffset[0]), roomCenter[1] - (this.combatOffset[1])];
	}

	draw(gc, entitySize){
		if(this.active) super.draw(gc, entitySize);
	}

}