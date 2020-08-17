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

class Map extends Item {

	isOpen = false;

	static open(){
		this.isOpen = true;
		viewingMap = true;
	}

	static close(){
		this.isOpen = false;
		viewingMap = false;
	}

}
Map.itemName = "map";
Map.description = "A map. Reveals the layout of the dungeon.";