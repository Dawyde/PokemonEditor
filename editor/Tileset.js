function TilesetManager(t_w, t_h){
	this.tilesets = new Array();
	this.t_w = t_w;
	this.t_h = t_h;
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
		if(this.onload) this.onload();
	},
	init:function(){
		var i;
		for(i=0;i<this.tilesets.length;i++){
			if(!this.tilesets[i].isLoaded()) this.tilesets[i].load();
		}
	},
	getTileWidth: function(){ return this.t_w; },
	getTileHeight: function(){ return this.t_h; }
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
		this.nbw = this.image.height/this.manager.getTileHeight();
		this.manager.load(this);
	},
	isLoaded: function(){ return this.loaded; },
	setId: function(id){ this.id = id; },
	getTilesX: function(){ return this.nbw; },
	getTilesY: function(){ return this.nbh; }
}