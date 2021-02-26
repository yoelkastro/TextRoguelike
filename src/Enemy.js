/*
	The enemy.
*/
class Enemy extends Entity {
	
	constructor() {
		super();
		this.active = true;
		this.name = "Enemy";
		this.health = 30;
	}

	updatePositions(){
		this.defaultPos = [roomCenter[0] - (this.combatOffset[0]), roomCenter[1] - (this.combatOffset[1])];
	}

	draw(gc, entitySize){
		if(this.health <= 0) this.active = false;
		if(this.active) super.draw(gc, entitySize);
	}

	fight(){
		return this.name + " dealt " + super.attack(player, 5) + " damage.";
	}

}