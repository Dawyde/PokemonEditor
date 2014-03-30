function MapUI(editor, canvas_id){
	this.editor = editor;
	this.element = document.getElementById(canvas_id);
	this.ctx = this.element.getContext('2d');
	
	this.dispatcher = new EventDispatcher(this);
	this.dispatcher.addEventListener(this, 'mousedown', this.mousedown);
	this.dispatcher.addEventListener(this, 'mousemove', this.mousemove);
	this.editor.addEventListener(this, 'mouseup', this.mouseup);
	this.editor.addEventListener(this, 'mapchange', this.mapchange);
	
	this.isdown = false;
	this.position = false;
	this.current_layout = 1;
	
	this.hidden_layout = {1:true, 2:true, 3:true};
}

MapUI.prototype = {
	init: function(){
		this.element.d = this.dispatcher;
		this.element.onmousedown = function(e){ this.d.dispatchEvent('mousedown', {x: e.offsetX, y : e.offsetY, b: e.button}); return false;};
		this.element.oncontextmenu = function(e){ return false;};
		this.element.onmousemove = function(e){ this.d.dispatchEvent('mousemove', {x: e.offsetX, y : e.offsetY} );};
		this.mapchange();
		this.draw();
	},
	mapchange: function(){
		var map = this.editor.getMap();
		if(!map) return;
		
		this.element.width = map.getWidth()*T_WIDTH;
		this.element.height = map.getHeight()*T_HEIGHT;
	},
	toogleHiddenLayout: function(id){
		this.hidden_layout[id] = !this.hidden_layout[id];
		this.draw();
		return this.hidden_layout[id];
	},
	setCurrentCalque:function(id){
		if(this.current_layout == id) return false;
		this.current_layout = id;
		this.draw();
		return true;
	},
	draw: function(){
		var map = this.editor.getMap();
		if(!map) return;
		this.ctx.fillStyle = "white";
		this.ctx.fillRect(0,0,this.element.width, this.element.height);
		
		//if(!this.calques['grille']) this.drawGrille();
		
		//On dessine le calque 0
		this.drawCalque(this.ctx, 1);
		this.drawCalque(this.ctx, 2);
		this.drawCalque(this.ctx, 3);
		
		var i, j;
		this.ctx.strokeStyle='gray';
		this.ctx.beginPath();
		for(i=0;i<=map.getWidth();i++){
			this.ctx.moveTo(i*T_WIDTH, 0);
			this.ctx.lineTo(i*T_WIDTH, map.getHeight()*T_HEIGHT);
		}
		for(i=0;i<=map.getHeight();i++){
			this.ctx.moveTo(0, i*T_HEIGHT);
			this.ctx.lineTo(map.getWidth()*T_WIDTH, i*T_HEIGHT);
		}
		this.ctx.stroke();
		
		
	},
	drawCalque: function(ctx, id){
		if(!this.hidden_layout[id]) return ;
		if(this.current_layout != id) ctx.globalAlpha = 0.5;
		var x, y;
		var map = this.editor.getMap();
		for(y=0;y<map.getHeight();y++){
			for(x=0;x<map.getWidth();x++){
				var c;
				if(id == 1) c = map.getCell(x,y).getC1();
				else if(id == 2) c = map.getCell(x,y).getC2();
				else c = map.getCell(x,y).getC3();
				this.drawCell(ctx, x*T_WIDTH, y*T_HEIGHT, c);
			}
		}
		ctx.globalAlpha = 1;
	},
	drawCell: function(ctx, x, y, cell){
		if(!cell) return;
		var tileset = this.editor.getTilesetManager().getTileset(cell.tileset);
		var pos = tileset.getPosition(cell);
		ctx.drawImage(tileset.getImage(), pos.x, pos.y, T_WIDTH, T_HEIGHT, x, y, T_WIDTH, T_HEIGHT);
	},
	mousedown: function(e){
		if(e.datas.b == 1) return;
		this.isdown = e.datas.b==0?1:2;
		var x = Math.floor(e.datas.x/T_WIDTH);
		var y = Math.floor(e.datas.y/T_HEIGHT);
		this.position = {x: x, y:y};
		if(this.isdown == 2 && this.editor.getTilesetManager().clearCell(this.editor.getMap(), x, y, this.current_layout)) this.draw();
		else if(this.isdown == 1 && this.editor.getTilesetManager().applySelection(this.editor.getMap(), x, y, this.current_layout)) this.draw();
	},
	mouseup: function(e){
		if(!this.isdown) return;
		this.isdown = false;
	},
	mousemove: function(e){
		if(!this.isdown) return;
		var x = Math.floor(e.datas.x/T_WIDTH);
		var y = Math.floor(e.datas.y/T_HEIGHT);
		if(x == this.position.x && y == this.position.y) return;
		this.position = {x: x, y:y};
		if(this.isdown == 2 && this.editor.getTilesetManager().clearCell(this.editor.getMap(), x, y, this.current_layout)) this.draw();
		else if(this.isdown == 1 && this.editor.getTilesetManager().applySelection(this.editor.getMap(), x, y, this.current_layout)) this.draw();
	}
};



function TilesetUI(editor, canvas_id, tileset_manager){
	this.element = document.getElementById(canvas_id);
	this.editor = editor;
	this.ctx = this.element.getContext('2d');
	this.manager = tileset_manager;
	this.manager.addEventListener(this, 'tilesetchange', this.tilesetChange);
	this.dispatcher = new EventDispatcher(this);
	this.dispatcher.addEventListener(this, 'mousedown', this.mousedown);
	this.dispatcher.addEventListener(this, 'mousemove', this.mousemove);
	this.editor.addEventListener(this, 'mouseup', this.mouseup);
	
	this.selection = false;
	this.selection_data = false;
}

TilesetUI.prototype={
	init: function(){
		this.element.d = this.dispatcher;
		this.element.onmousedown = function(e){ this.d.dispatchEvent('mousedown', {x: e.offsetX, y : e.offsetY} ); return false;};
		this.element.onmousemove = function(e){ this.d.dispatchEvent('mousemove', {x: e.offsetX, y : e.offsetY} );};
		this.tilesetChange();
		this.draw();
	},
	tilesetChange:function(){
		var t = this.manager.getCurrentTileset();
		var img = t.getImage();
		this.element.width=img.width;
		this.element.height = img.height;
	},
	draw:function(){
		var t = this.manager.getCurrentTileset();
		var img = t.getImage();
		this.ctx.fillStyle = "white";
		this.ctx.fillRect(0,0,img.width, img.height);
		this.ctx.drawImage(img,0 ,0);
		
		var s;
		if(this.selection_data != false){
			s = this.selection_data;
			this.ctx.strokeStyle = "red";
		}
		else{
			s = this.manager.getSelection();
			this.ctx.strokeStyle = "black";
		}
		var x1,x2;
		var y1,y2;
		if(s.x1 < s.x2){
			x1 = s.x1;
			x2 = s.x2;
		}
		else{
			x1 = s.x2;
			x2 = s.x1;
		}
		if(s.y1 < s.y2){
			y1 = s.y1;
			y2 = s.y2;
		}
		else{
			y1 = s.y2;
			y2 = s.y1;
		}
		this.ctx.strokeRect(x1*this.manager.getTileWidth(), y1*this.manager.getTileHeight(), (x2-x1+1)*this.manager.getTileWidth(), (y2-y1+1)*this.manager.getTileHeight());
	},
	//Gestion des évènements
	mousedown: function(e){
		this.selection = true;
		var x = Math.floor(e.datas.x/this.manager.getTileWidth());
		var y = Math.floor(e.datas.y/this.manager.getTileHeight());
		this.selection_data = {x1:x, y1:y, x2:x, y2:y};
		this.draw();
	},
	mousemove: function(e){
		//alert(e.datas.x);
		if(!this.selection) return;
		var x = Math.floor(e.datas.x/this.manager.getTileWidth());
		var y = Math.floor(e.datas.y/this.manager.getTileHeight());
		if(this.selection_data.x2 != x || this.selection_data.y2 != y){
			this.selection_data.x2 = x;
			this.selection_data.y2 = y;
			this.draw();
		}
	},
	mouseup: function(e){
		if(!this.selection) return;
		this.selection = false;
		this.manager.setSelection(this.selection_data.x1, this.selection_data.y1, this.selection_data.x2, this.selection_data.y2);
		this.selection_data = false;
		this.draw();
	}
}