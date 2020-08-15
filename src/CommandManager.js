class CommandManager {
	
	constructor(player){
		this.player = player;
	}

	go(args){
		console.log(args);
		if(["north", "west", "south", "east"].includes(args[0]) && args.length < 2){
			if(this.player.currentRoom.walls[args[0]] !== undefined){
				this.player.setRoom(this.player.currentRoom.walls[args[0]]);
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

	resolveCommand(command){

		var sp = command.split(" ");

		switch(sp[0]){


			case "go": this.go(sp.slice(1, sp.length)); break;
			case "help": help(sp.slice(1, sp.length)); break;

			default: console.log("Unrecognized command");

		}

	}

}