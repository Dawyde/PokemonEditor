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
	setSelectionById: function(id){
		var value = this.tilesets[this.current_tile].getTilePosition(id);
		this.setSelection(value.x, value.y, value.x, value.y);
		this.dispatcher.dispatchEvent('selectionchange');
	},
	clearCell: function(map, s_x, s_y, calque, element){
		var cell = map.getCell(s_x,s_y);
		if(!cell) return;
		var current_value;
		if(calque == 1) current_value = cell.getC1();
		else if(calque == 2) current_value = cell.getC2();
		else current_value = cell.getC3();
		
		if(current_value == false) return false;
		element.addAction(s_x, s_y, calque, current_value, false);
		
		if(calque == 1) cell.setC1(false);
		else if(calque == 2) cell.setC2(false);
		else if(calque == 3) cell.setC3(false);
		else cell.setT(0);
		
		return true;
	},
	applySelection: function(map, s_x, s_y, calque, element){
		//On applique la sélection du tileset à la cellule fournie en parametre
		var changed = false;
		var x,y;
		for(x=0;x<=this.selected.x2-this.selected.x1;x++){
			for(y=0;y<=this.selected.y2-this.selected.y1;y++){
				//On récupere la cellule sélectionnée
				var cell = map.getCell(s_x+x,s_y+y);
				if(!cell) continue;
				//On récupère la valeur sélectionnée
				if(calque == 4) var value = editor.getSelectedType();
				else{
					var value =  this.tilesets[this.current_tile].getValue(this.selected.x1+x, this.selected.y1+y);
					if(!value) continue;
				}
				//On vérifie si y'a à appliquer
				if(calque == 4){
					if(cell.getT() != value){
						changed = true;
						element.addAction(s_x+x, s_y+y, calque, cell.getT(), value);
						cell.setT(value);
					}
				}
				else{
					var current_value;
					if(calque == 1) current_value = cell.getC1();
					else if(calque == 2) current_value = cell.getC2();
					else current_value = cell.getC3();
					//On vérifie qu'il y a bien modification
					if(!current_value || current_value.tileset != value.tileset ||current_value.id != value.id){
						changed = true;
						element.addAction(s_x+x,s_y+y, calque, current_value, value);
						if(calque == 1) cell.setC1(value);
						else if(calque == 2) cell.setC2(value);
						else cell.setC3(value);
					}
				}
			}
		}
		return changed;
	},
	applyPainting: function(map, s_x, s_y, calque, element){
		//On va détecter les blocs
		var blocs = new Array();
		var x, y;
		var bloc_id = 1;
		var cell = map.getCell(s_x, s_y);
		if(!cell) return;
		//On cherche la valeur à détecter
		var value = cell.getC(calque);
		
		//On commence la recherche
		for(y=0;y<map.getHeight();y++){
			blocs[y] = new Array();
			for(x=0;x<map.getWidth();x++){
				//On récupère la cellule
				var c = map.getCell(x,y);
				//On regarde si la cellule a la bonne valeur
				if(!Cell.isSame(calque, value, c.getC(calque)))blocs[y][x] = 0;
				else{
					//Si c'est la bonne valeur on l'ajoute au bloc qu'il faut :
					//On regarde si les cellules haute et gauches sont déjà dans un bloc
					var cur_bloc = -1;
					//On regarde à gauche
					if(x > 0 && blocs[y][x-1] > 0){
						cur_bloc = blocs[y][x-1];
					}
					//Puis on regarde en haut
					if(y > 0 && blocs[y-1][x] > 0){
						//Si la cellule de gauche était déjà OK, alors on rejoint les deux blocs
						if(cur_bloc > 0){
							var x2, y2;
							var to_replace = blocs[y-1][x];
							for(y2=0;y2<y;y2++){
								for(x2=0;x2<map.getWidth();x2++){
									if(blocs[y2][x2] == to_replace) blocs[y2][x2] = cur_bloc;
								}
							}
						}
						else{
						//Sinon on rejoint simplement le bloc du haut
							cur_bloc = blocs[y-1][x];
						}
					}
					//On regarde si la cellule actuelle a un bloc
					if(cur_bloc > 0) blocs[y][x] = cur_bloc;
					else{
						//Si elle en a pas on lui en crée un
						blocs[y][x] = bloc_id;
						bloc_id++;
					}
				}
			}
		}
		
		//On regarde le numéro du bloc dans lequel se trouve notre cellule cible
		var target_bloc = blocs[s_y][s_x];
		
		//On récupere la hauteur et largeur de sélection
		var s_w = this.selected.x2-this.selected.x1+1;
		var s_h = this.selected.y2-this.selected.y1+1;
		
		for(x=0;x<map.getWidth();x++){
			for(y=0;y<map.getHeight();y++){
				//On recherche les cellules du bloc
				if(blocs[y][x] != target_bloc) continue;
				var c_x = (x-s_x)%s_w;
				if(c_x<0) c_x += s_w;
				var c_y = (y-s_y)%s_h;
				if(c_y<0) c_y += s_h;
				if(calque == 4) var value = editor.getSelectedType();
				else var value =  this.tilesets[this.current_tile].getValue(this.selected.x1+c_x, this.selected.y1+c_y);
				element.addAction(x, y, calque, map.getCell(x,y).getC(calque), value);
				map.getCell(x,y).setC(calque, value);
			}
		}
		return true;
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
	getTilePosition: function(id){
		return {x:id%this.nbw, y:Math.floor(id/this.nbw)};
	},
	getPosition: function(cell){
		var x = (cell.id%this.nbw)*this.manager.getTileWidth();
		var y = Math.floor(cell.id/this.nbw)*this.manager.getTileHeight();
		return {x:x, y:y};
	},
	isLoaded: function(){ return this.loaded; },
	getId: function(){ return this.id },
	setId: function(id){ this.id = id; },
	getTilesX: function(){ return this.nbw; },
	getTilesY: function(){ return this.nbh; },
	getImage: function(){ return this.image }
}