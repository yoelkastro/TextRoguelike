
function capitalize(str){
	return str.charAt(0).toUpperCase() + str.slice(1);
}

class CommandManager {
	
	constructor(){
		this.currentInteractable = [];
	}

	help(args){

	}

	go(args){
		var message = "";
		if(viewingMap){
			message = "Can't move while looking at map.";
		}
		if(directions.includes(args[0]) && args.length < 2){
			if(isRoom(player.currentRoom.walls[args[0]])){
				if(player.inCombat && player.currentRoom.enemy.active && !debug){
					message = "Passage to the " + args[0] + " is blocked by an enemy.", 0;
				}
				else{
					player.setNextMoveDirection(args[0]);
					player.setMoveTarget("room");
					message = "Went " + args[0] + ".";
				}
			}
			else{
				message = "No passage in direction " + args[0] + ".", 0;
			}
		}
		else if(args[0] == "down" && this.currentInteractable.includes(Stairs)){
			message = Stairs.use();
		}
		else{
			message = "Not a valid direction."
		}
		return [message, 0];

	}

	escape(){

		if(player.inCombat){
			return this.go([directions[player.currentRoom.enemy.facingDirection]]);
		}
		return ["Nothing to escape from.", 0];

	}

	inventory(){
		var result = ""
		result += "You have:";

		for(var i = 0; i < player.inventory[0].length; i ++){
			result += "<br>" + player.inventory[0][i].itemName + " x " + player.inventory[1][i];
		}

		return [result, 0]
	}

	open(args){

		var message = "";
		for(var a = 0; a < args.length; a ++){
			for(var i = 0; i < this.currentInteractable.length; i ++){
				if(this.currentInteractable[i].name.toLowerCase() == args[a]){
					try{
						if(!this.currentInteractable[i].isOpen){
							return [this.currentInteractable[i].open(), 0];
						}
						else{
							return ["That is already open.", 0];
						}
					} catch{}
				}
			}
		}
		return ["Can't open that.", 0];
	}

	close(args){

		for(var a = 0; a < args.length; a ++){
			for(var i = 0; i < this.currentInteractable.length; i ++){
				if(this.currentInteractable[i].name.toLowerCase() == args[a]){
					try{
						if(this.currentInteractable[i].isOpen){
							return [this.currentInteractable[i].close(), 0];
						}
						else{
							return ["That is already closed.", 0];
						}
					} catch{}
				}
			}
		}
		return ["Can't close that.", 0];
	}

	use(args){

		for(var a = 0; a < args.length; a ++){
			for(var i = 0; i < this.currentInteractable.length; i ++){
				if(this.currentInteractable[i].name.toLowerCase() == args[a]){
					try{
						return [this.currentInteractable[i].use(), 1];
					} catch{}
				}
			}
		}
		return ["Can't use that.", 0];
	}

	attack(args){
		return [player.fight(), 1];
	}

	resolveCommand(command){

		var res;
		var message = "";

		var sp = command.toLowerCase().split(" ");
		this.currentInteractable = player.inventory[0].concat(player.currentRoom.interactables);

		switch(sp[0]){


			case "go": 			res = this.go(sp.slice(1, sp.length));  	break;
			case "help": 		res = this.help(sp.slice(1, sp.length)); 	break;
			case "inventory": 	res = this.inventory(); 					break;
			case "open": 		res = this.open(sp.slice(1, sp.length));	break;
			case "use": 		res = this.use(sp.slice(1, sp.length)); 	break;
			case "close": 		res = this.close(sp.slice(1, sp.length));	break;
			case "escape":
			case "run": 		res = this.escape();						break;
			case "fight":
			case "attack": 		res = this.attack();						break;

			default: return "Unrecognized command.";

		}
		message += res[0];

		if(player.inCombat && res[1] > 0){
			message += "<br><span style=\"color:#FF00FF\">" + player.currentRoom.enemy.fight() + "</span>";
		}

		return message;

	}

}