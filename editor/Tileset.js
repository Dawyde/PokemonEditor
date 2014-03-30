function TilesetManager(t_w, t_h){
	this.tilesets = new Array();
	this.t_w = t_w;
	this.t_h = t_h;
	this.current_tile = 0;
	this.selected = {x1:0,x2:0,y1:0,y2:0};
	this.dispatcher = new EventDispatcher(this);
}

TilesetManager.prototype={
	addTileset:function(url){
		var tileset = new Tileset(url, this);
		tileset.setId(this.tilesets.length);
		this.tilesets[this.tilesets.length] = tileset;
	},
	load:function(tile){
		var i;
		for(i=0;i<this.tilesets.length;i++){
			if(!this.tilesets[i].isLoaded()) return;
		}
		this.dispatcher.dispatchEvent('load');
	},
	init:function(){
		var i;
		for(i=0;i<this.tilesets.length;i++){
			if(!this.tilesets[i].isLoaded()) this.tilesets[i].load();
		}
	},
	getTileWidth: function(){ return this.t_w; },
	getTileHeight: function(){ return this.t_h; },
	addEventListener: function(callbackObj, event_name, callback){
		this.dispatcher.addEventListener(callbackObj, event_name, callback);
	},
	getCurrentTileset: function(){ return this.tilesets[this.current_tile]; },
	getTileset: function(id){
		return this.tilesets[id];
	},
	getSelection: function(){
		return this.selected;
	},
	setSelection: function(x1, y1, x2, y2){
		if(x1 < x2){
			this.selected.x1 = x1;
			this.selected.x2 = x2;
		}
		else{
			this.selected.x1 = x2;
			this.selected.x2 = x1;
		}
		if(y1 < y2){
			this.selected.y1 = y1;
			this.selected.y2 = y2;
		}
		else{
			this.selected.y1 = y2;
			this.selected.y2 = y1;
		}
	},
	clearCell: function(map, s_x, s_y, calque){
		var cell = map.getCell(s_x,s_y);
		if(!cell) return;
		var current_value;
		if(calque == 1) current_value = cell.getC1();
		else if(calque == 2) current_value = cell.getC2();
		else current_value = cell.getC3();
		
		if(current_value == false) return false;
		
		if(calque == 1) cell.setC1(false);
		else if(calque == 2) cell.setC2(false);
		else cell.setC3(false);
		
		return true;
	},
	applySelection: function(map, s_x, s_y, calque){
		//On applique la sélection du tileset à la cellule fournie en parametre
		var changed = false;
		var x,y;
		for(x=0;x<=this.selected.x2-this.selected.x1;x++){
			for(y=0;y<=this.selected.y2-this.selected.y1;y++){
				//On récupere la cellule sélectionnée
				var cell = map.getCell(s_x+x,s_y+y);
				if(!cell) continue;
				//On récupère la valeur sélectionnée
				var value = this.tilesets[this.current_tile].getValue(this.selected.x1+x, this.selected.y1+y);
				if(!value) continue;
				//On vérifie si y'a à appliquer
				var current_value;
				if(calque == 1) current_value = cell.getC1();
				else if(calque == 2) current_value = cell.getC2();
				else current_value = cell.getC3();
				//On vérifie qu'il y a bien modification
				if(!current_value || current_value.tileset != value.tileset ||current_value.id != value.id){
					changed = true;
					if(calque == 1) cell.setC1(value);
					else if(calque == 2) cell.setC2(value);
					else cell.setC3(value);
				}
			}
		}
		return changed;
	}
};

function Tileset(url, manager){
	this.url = url;
	this.image = new Image();
	this.loaded = false;
	this.manager = manager;
	this.onload = false;
	this.nbw = 0;
	this.nbh = 0;
}

Tileset.prototype={
	load:function(){
		this.image.img = this;
		this.image.onload = function(){ this.img.imageLoaded() };
		this.image.src = this.url;
	},
	imageLoaded:function(){
		this.loaded = true;
		this.nbw = this.image.width/this.manager.getTileWidth();
		this.nbh = this.image.height/this.manager.getTileHeight();
		this.manager.load(this);
	},
	getValue:function(x, y){
		return {tileset:this.id, id: y*this.nbw+x};
	},
	getPosition: function(cell){
		var x = (cell.id%this.nbw)*this.manager.getTileWidth();
		var y = Math.floor(cell.id/this.nbw)*this.manager.getTileHeight();
		return {x:x, y:y};
	},
	isLoaded: function(){ return this.loaded; },
	setId: function(id){ this.id = id; },
	getTilesX: function(){ return this.nbw; },
	getTilesY: function(){ return this.nbh; },
	getImage: function(){ return this.image }
}