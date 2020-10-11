/*
	Generic representation of an item
*/
class Item {

	static open(){
		return "Not an openable item.";
	}

	static check(){
		return this.description;
	}

	static look(){
		return this.description;
	}

	static getItemName(item){
		return item.itemName;
	}

}	
Item.description = "An item";

/*
	A map. Can only have one.
*/
class Map extends Item {

	isOpen = false;

	static open(){
		if(!player.inCombat){
			this.isOpen = true;
			viewingMap = true;
			return "Opened map.";
		}
		return "Can't open map during combat.";
	}

	static close(){
		this.isOpen = false;
		viewingMap = false;
		return "Closed map.";
	}

}
Map.itemName = "map";
Map.description = "A map. Reveals the layout of the dungeon.";