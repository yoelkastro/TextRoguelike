class CommandManager {
	
	constructor(){
		this.currentInteractable = [];
	}

	go(args){
		console.log(args);
		if(directions.includes(args[0]) && args.length < 2){
			if(player.currentRoom.walls[args[0]] !== undefined){
				player.setNextMoveDirection(args[0]);
				player.setMoveTarget("room");
			}
			else{
				console.log("No passage in direction " + args[0]);
			}
		}
		else{
			console.log("Not a valid direction");
		}

	}

	help(args){

	}

	inventory(){
		console.log("You have: ");
		var inv = player.inventory;
		Object.keys(inv).forEach(function(key){
			console.log(inv[key] + " x " + key);
		})
	}

	open(args){

		for(var a = 0; a < args.length; a ++){
			try{
				args[a].open();
				break;
			}
			catch{}
		}

	}

	resolveCommand(command){

		var sp = command.split(" ");
		//this.currentInteractable = concat(player.currentRoom.interactables);

		switch(sp[0]){


			case "go": 			this.go(sp.slice(1, sp.length)); 	break;
			case "help": 		this.help(sp.slice(1, sp.length)); 	break;
			case "inventory": 	this.inventory(); 					break;
			case "open": 		this.open(sp.slice(1, sp.length));	break;

			default: console.log("Unrecognized command");

		}

	}

}