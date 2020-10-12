
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
		if(viewingMap){
			return "Can't move while looking at map.";
		}
		if(directions.includes(args[0]) && args.length < 2){
			if(isRoom(player.currentRoom.walls[args[0]])){
				if(player.inCombat && args[0] == directions[(player.currentRoom.enemy.facingDirection + 2) % 4] && player.currentRoom.enemy.active && !debug){
					return "Passage to the " + args[0] + " is blocked by an enemy.";
				}
				player.setNextMoveDirection(args[0]);
				player.setMoveTarget("room");
				return "Went " + args[0] + ".";
			}
			else{
				return "No passage in direction " + args[0] + ".";
			}
		}
		else if(args[0] == "down" && this.currentInteractable.includes(Stairs)){
			return Stairs.use();
		}
		else{
			return "Not a valid direction." + args[0];
		}

	}

	escape(){

		if(player.inCombat){
			return this.go([directions[enemy.facingDirection]]);
		}
		return "Nothing to escape from.";

	}

	inventory(){
		var result = ""
		result += "You have:";

		for(var i = 0; i < player.inventory[0].length; i ++){
			result += "<br>" + player.inventory[0][i].itemName + " x " + player.inventory[1][i];
		}

		return result
	}

	open(args){

		for(var a = 0; a < args.length; a ++){
			for(var i = 0; i < this.currentInteractable.length; i ++){
				if(this.currentInteractable[i].name.toLowerCase() == args[a]){
					try{
						if(!this.currentInteractable[i].isOpen){
							return this.currentInteractable[i].open();
						}
						else{
							return "That is already open.";
						}
					} catch{}
				}
			}
		}
		return "Can't open that.";
	}

	close(args){

		for(var a = 0; a < args.length; a ++){
			for(var i = 0; i < this.currentInteractable.length; i ++){
				if(this.currentInteractable[i].name.toLowerCase() == args[a]){
					try{
						if(this.currentInteractable[i].isOpen){
							return this.currentInteractable[i].close();
						}
						else{
							return "That is already closed.";
						}
					} catch{}
				}
			}
		}
		return "Can't close that.";
	}

	use(args){

		for(var a = 0; a < args.length; a ++){
			for(var i = 0; i < this.currentInteractable.length; i ++){
				if(this.currentInteractable[i].name.toLowerCase() == args[a]){
					try{
						return this.currentInteractable[i].use();
					} catch{}
				}
			}
		}
		return "Can't use that.";
	}

	resolveCommand(command){

		var res = "";

		var sp = command.toLowerCase().split(" ");
		this.currentInteractable = player.inventory[0].concat(player.currentRoom.interactables);

		switch(sp[0]){


			case "go": 			res += this.go(sp.slice(1, sp.length)); 	break;
			case "help": 		res += this.help(sp.slice(1, sp.length)); 	break;
			case "inventory": 	res += this.inventory(); 					break;
			case "open": 		res += this.open(sp.slice(1, sp.length));	break;
			case "use": 		res += this.use(sp.slice(1, sp.length));	break;
			case "close": 		res += this.close(sp.slice(1, sp.length));	break;
			case "escape":
			case "run": 		res += this.escape();						break;

			default: res += "Unrecognized command.";

		}

		return res;

	}

}