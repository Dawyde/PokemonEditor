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
	
	this.current_tool = 1;
	
	this.history = new History(this.map);
	
	
	
}

EditorManager.prototype={
	cancel: function(){
		if(this.history.cancel()){
			this.map_ui.draw();
		}
	},
	restore: function(){
		if(this.history.restore()){
			this.map_ui.draw();
		}
	},
	getHistory: function(){
		return this.history;
	},
	editorReady:function(){
		this.tileset_ui.init();
		this.map_ui.init();
	},
	setTool: function(id){
		if(this.current_tool == id) return false;
		this.current_tool = id;
		this.dispatcher.dispatchEvent('toolchange', {id:id} );
		return true;
	},
	getTool: function(){
		return this.current_tool;
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
	},
	save: function(){
		//var name = prompt("Nom de la map : ", "");
		var s = this.map.save();
		console.log(s);
		$.ajax({
			url:'save.php',
			type:'post',
			data: {map:s},
			success: function(e){
			}
		});
	}
}