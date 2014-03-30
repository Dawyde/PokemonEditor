function EditorManager(sets){
	
	this.dispatcher = new EventDispatcher(this);
	this.map = new Map(29,40);
	
	this.tilesets = new TilesetManager(T_WIDTH, T_HEIGHT);
	//On ajoute les tilesets
	var i;
	for(i=0;i<sets.length;i++) this.tilesets.addTileset(sets[i]);
	//Puis on charge
	this.tilesets.addEventListener(this, 'load', this.editorReady);
	this.tilesets.init();
	
	this.map_ui = new MapUI(this, 'map');
	this.tileset_ui = new TilesetUI(this, 'tiles', this.tilesets);
	
	
}

EditorManager.prototype={
	editorReady:function(){
		this.tileset_ui.init();
		this.map_ui.init();
	},
	addEventListener: function(callbackObj, event_name, callback){
		this.dispatcher.addEventListener(callbackObj, event_name, callback);
	},
	mouseUp: function(e){
		this.dispatcher.dispatchEvent("mouseup", {x: e.offsetX, y: e.offsetY});
	},
	getMap: function(){
		return this.map;
	},
	getTilesetManager: function(){
		return this.tilesets;
	},
	getMapUI: function(){
		return this.map_ui;
	}
}