
function capitalize(str){
	return str.charAt(0).toUpperCase() + str.slice(1);
}

class CommandManager {
	
	constructor(){
		this.currentInteractable = [];
	}

	go(args){
		if(directions.includes(args[0]) && args.length < 2){
			if(player.currentRoom.walls[args[0]] !== undefined){
				player.setNextMoveDirection(args[0]);
				player.setMoveTarget("room");
				return "Went " + args[0] + ".";
			}
			else{
				return "No passage in direction " + args[0] + ".";
			}
		}
		else{
			return "Not a valid direction";
		}

	}

	help(args){

	}

	inventory(){
		var result = ""
		result += "You have: \n";

		for(var i = 0; i < player.inventory[0].length; i ++){
			result += player.inventory[0][i].itemName + " x " + player.inventory[1][i] + "\n";
		}

		return result
	}

	open(args){

		for(var a = 0; a < args.length; a ++){
			for(var i = 0; i < this.currentInteractable.length; i ++){
				if(this.currentInteractable[i].name.toLowerCase() == args[a]){
					try{
						this.currentInteractable[i].open();
						return "Opened " + args[a] + ".";
					}
					catch{}
				}
			}
		}
		return "Can't open that.";

	}

	open(args){

		for(var a = 0; a < args.length; a ++){
			for(var i = 0; i < this.currentInteractable.length; i ++){
				if(this.currentInteractable[i].name.toLowerCase() == args[a]){
					try{
						if(!this.currentInteractable[i].isOpen){
							this.currentInteractable[i].open();
							return "Opened " + args[a] + ".";
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
							this.currentInteractable[i].close();
							return "Closed " + args[a] + ".";
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

	resolveCommand(command){

		var res = "";

		var sp = command.toLowerCase().split(" ");
		this.currentInteractable = player.inventory[0].concat(player.currentRoom.interactables);

		switch(sp[0]){


			case "go": 			res += this.go(sp.slice(1, sp.length)); 	break;
			case "help": 		res += this.help(sp.slice(1, sp.length)); 	break;
			case "inventory": 	res += this.inventory(); 					break;
			case "open": 		res += this.open(sp.slice(1, sp.length));	break;
			case "close": 		res += this.close(sp.slice(1, sp.length));	break;

			default: res += "Unrecognized command";

		}

		return res;

	}

}