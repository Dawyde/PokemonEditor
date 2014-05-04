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
	
	this.dispatcher.addEventListener(this, 'mapload', this.mapload);
	
	
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
	open: function(){
		var name = prompt("Entrez le nom de la carte à ouvrir : ", "");
		if(!name) return;
		$.ajax({
			url:'action.php',
			type:'post',
			dataType:'json',
			data: {name:name},
			success: function(e){
				if(e.error) alert("Carte introuvable");
				else{
					$("#map_name").val(e.name);
					//On charge la map
					editor.dispatcher.dispatchEvent("mapload", e);
				}
			}
		});
	},
	save: function(){
		var name = $("#map_name").val();
		if(name == ""){
			alert("Vous devez entrer un nom à la carte");
			$("#map_name").focus();
			return;
		}
		var save = this.map.getSave();
		save.name = name;
		$.ajax({
			url:'action.php',
			type:'post',
			
			data: {data:JSON.stringify(save)},
			success: function(e){
				alert("Enregistrement réussi");
			}
		});
	},
	mapload: function(data){
		data = data.datas;
		this.map = new Map(data.w, data.h);
		console.log(data);
		var x, y;
		var id = this.tilesets.getCurrentTileset().getId();
		for(y=0;y<data.h;y++){
			for(x=0;x<data.w;x++){
				var cell = this.map.getCell(x,y);
				if(cell && data.cells[y][x]){
					cell.setC(1, {tileset:id, id:data.cells[y][x].l1});
					cell.setC(2, {tileset:id, id:data.cells[y][x].l2});
					cell.setC(3, {tileset:id, id:data.cells[y][x].l3});
					cell.setC(4, data.cells[y][x].t);
				}
			}
		}
		this.dispatcher.dispatchEvent('mapchange', {});
		this.map_ui.draw();
		this.history = new History(this.map);
	},
	setSelectedType: function(id){
		$("#cell_type").val(id);
	},
	getSelectedType: function(){
		return parseInt($("#cell_type").val());
	}
}