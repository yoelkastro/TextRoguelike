class Item {

	static open(){
		return "This item can't be opened";
	}

	static check(){
		return this.description;
	}

	static look(){
		return this.description;
	}

}	
Item.description = "An item";

class Map extends Item {

	static open(){
		viewingMap = true;
		return "Opened map.";
	}

	static close(){
		viewingMap = false;
		return "Closed map.";
	}

}
Map.itemName = "map";
Map.description = "A map. Reveals the layout of the dungeon.";