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
	
	this.selected_npc = -1;
	
	this.hidden_layout = {1:true, 2:true, 3:true, 4:true};
	
	this.current_element = false;
	
}

MapUI.prototype = {
	init: function(){
		this.element.d = this.dispatcher;
		this.element.onmousedown = function(e){ this.d.dispatchEvent('mousedown', {x: e.offsetX, y : e.offsetY, b: e.button, c: e.ctrlKey}); return false;};
		this.element.oncontextmenu = function(e){ return false;};
		this.element.onmousemove = function(e){ this.d.dispatchEvent('mousemove', {x: e.offsetX, y : e.offsetY} );};
		this.mapchange();
		this.draw();
	},
	setSelectedNPC: function(id){
		this.selected_npc = id;
	},
	mapchange: function(){
		var map = this.editor.getMap();
		if(!map) return;
		console.log(map);
		
		this.element.width = map.getWidth()*T_WIDTH;
		this.element.height = map.getHeight()*T_HEIGHT;
	},
	toogleHiddenLayout: function(id){
		this.hidden_layout[id] = !this.hidden_layout[id];
		this.draw();
		this.dispatcher.dispatchEvent('hiddenlayoutchange', {id:id, active:this.hidden_layout[id]} );
		return this.hidden_layout[id];
	},
	setCurrentCalque:function(id){
		if(this.current_layout == id) return false;
		this.current_layout = id;
		this.draw();
		this.dispatcher.dispatchEvent('layoutchange', {id:id} );
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
		this.drawNPC(this.ctx);
		this.drawCalque(this.ctx, 3);
		this.drawTypeCalque(this.ctx);
		this.drawICCalque(this.ctx);
		
		
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
		
		var selected = this.editor.getICManager().getSelected();
		if(selected != false){
			this.ctx.fillStyle="rgba(255,125,0,0.6)";
			this.ctx.fillRect(selected.x*T_WIDTH, selected.y*T_HEIGHT, T_WIDTH, T_HEIGHT);
		}
		
		
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
	drawNPC: function(ctx){
		var npc_list = this.editor.getMap().getNPC();
		for(var i in npc_list){
			var npc = npc_list[i];
			if(i == this.editor.getMap().getSelectedNPC()){
				ctx.fillStyle = '#FFFFFF';
				ctx.globalAlpha = 0.5;
				ctx.fillRect(npc.getX()*T_WIDTH, npc.getY()*T_WIDTH, T_WIDTH, T_WIDTH);
				ctx.globalAlpha = 1;
			}
			npc.getCharset().draw(ctx, npc.getX()*T_WIDTH, npc.getY()*T_WIDTH);
		}
	},
	drawTypeCalque: function(ctx){
		if(!this.hidden_layout[4]) return ;
		if(this.current_layout != 4) ctx.globalAlpha = 0.3;
		else ctx.globalAlpha = 0.5
		var x, y;
		var map = this.editor.getMap();
		for(y=0;y<map.getHeight();y++){
			for(x=0;x<map.getWidth();x++){
				var c = map.getCell(x,y).getT();
				if(c == 0) continue;
				var colors = [0,"#FF0000", "#00AAFF", "#00FF00"];
				ctx.fillStyle=colors[c];
				ctx.fillRect(x*T_WIDTH, y*T_HEIGHT, T_WIDTH, T_HEIGHT);
			}
		}
		ctx.globalAlpha = 1;
	},
	drawICCalque: function(ctx){
		var x, y;
		var map = this.editor.getMap();
		for(y=0;y<map.getHeight();y++){
			for(x=0;x<map.getWidth();x++){
				var c = map.getCell(x,y);
				if(c.ic){
					ctx.fillStyle="rgba(255,255,0,0.5)";
					ctx.fillRect(x*T_WIDTH, y*T_HEIGHT, T_WIDTH, T_HEIGHT);
				}
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
	addEventListener: function(callbackObj, event_name, callback){
		this.dispatcher.addEventListener(callbackObj, event_name, callback);
	},
	mousedown: function(e){
		if(e.datas.c && e.datas.b == 2){
			//Sélections de l'IC
			var x = Math.floor(e.datas.x/T_WIDTH);
			var y = Math.floor(e.datas.y/T_HEIGHT);
			this.editor.getICManager().setSelectedCell(x,y);
			this.draw();
			return;
		}
		if(this.selected_npc != -1){
			var x = Math.floor(e.datas.x/T_WIDTH);
			var y = Math.floor(e.datas.y/T_HEIGHT);
			this.editor.getMap().addNPC(new NPC(this.selected_npc, x, y));
			this.selected_npc = -1;
			this.draw();
			this.dispatcher.dispatchEvent('npcAdded', false);
			return;
		}
		if(this.editor.getTool() == 1){//Crayon
			if(e.datas.b == 1) return;
			this.isdown = e.datas.b==0?1:2;
			//Enregistrement de l'historique (pour le Ctrl+Z, Ctrl+Y)
			this.current_element = new Element();
			var x = Math.floor(e.datas.x/T_WIDTH);
			var y = Math.floor(e.datas.y/T_HEIGHT);
			this.position = {x: x, y:y};
			if(this.isdown == 2 && this.editor.getTilesetManager().clearCell(this.editor.getMap(), x, y, this.current_layout, this.current_element)) this.draw();
			else if(this.isdown == 1 && this.editor.getTilesetManager().applySelection(this.editor.getMap(), x, y, this.current_layout, this.current_element)) this.draw();
		}
		else if(this.editor.getTool() == 2){//Pipette
			var value;
			var x = Math.floor(e.datas.x/T_WIDTH);
			var y = Math.floor(e.datas.y/T_HEIGHT);
			if(this.current_layout == 1) value = this.editor.getMap().getCell(x, y).getC1();
			else if(this.current_layout == 2) value = this.editor.getMap().getCell(x, y).getC2();
			else if(this.current_layout == 3) value = this.editor.getMap().getCell(x, y).getC3();
			else if(this.current_layout == 4){
				value = this.editor.getMap().getCell(x, y).getT();
				this.editor.setSelectedType(value);
				//Puis on retourne à la pipette
				this.editor.setTool(1);
				return;
			}
			else return;
			if(value){
				//On enregistre la sélection
				this.editor.getTilesetManager().setSelectionById(value.id);
				//Puis on retourne à la pipette
				this.editor.setTool(1);
			}
		}
		else if(this.editor.getTool() == 3){//Peinture
			var value;
			var x = Math.floor(e.datas.x/T_WIDTH);
			var y = Math.floor(e.datas.y/T_HEIGHT);
			var element = new Element();
			if(this.editor.getTilesetManager().applyPainting(this.editor.getMap(), x, y, this.current_layout, element)){
				this.draw();
				this.editor.getHistory().addElement(element);
			}
		}
	},
	mouseup: function(e){
		if(!this.isdown) return;
		if(this.current_element){
			this.editor.getHistory().addElement(this.current_element);
			this.current_element = false;
		}
		this.isdown = false;
	},
	mousemove: function(e){
		if(!this.isdown) return;
		var x = Math.floor(e.datas.x/T_WIDTH);
		var y = Math.floor(e.datas.y/T_HEIGHT);
		if(x == this.position.x && y == this.position.y) return;
		this.position = {x: x, y:y};
		if(this.isdown == 2 && this.editor.getTilesetManager().clearCell(this.editor.getMap(), x, y, this.current_layout, this.current_element)) this.draw();
		else if(this.isdown == 1 && this.editor.getTilesetManager().applySelection(this.editor.getMap(), x, y, this.current_layout, this.current_element)) this.draw();
	}
};



function TilesetUI(editor, canvas_id, tileset_manager){
	this.element = document.getElementById(canvas_id);
	this.editor = editor;
	this.ctx = this.element.getContext('2d');
	this.manager = tileset_manager;
	this.manager.addEventListener(this, 'tilesetchange', this.tilesetChange);
	this.manager.addEventListener(this, 'selectionchange', this.selectionChange);
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
	selectionChange:function(){
		this.draw();
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