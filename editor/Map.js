function Map(width, height){
	this.width = width;
	this.height = height;
	this.cells = new Array();
	this.npc = new Array();
	this.selected_npc = -1;
	var x,y;
	for(y=0;y<height;y++){
		this.cells[y] = new Array();
		for(x=0;x<width;x++){
			this.cells[y][x] = new Cell();
		}
	}
}

Map.prototype={
	getCell: function(x, y){
		if(x < 0 || x >= this.width) return false;
		if(y < 0 || y >= this.height) return false;
		return this.cells[y][x];
	},
	selectNPC: function(id){
		this.selected_npc = id;
	},
	getWidth: function(){ return this.width; },
	getHeight: function(){ return this.height; },
	getSave: function(){
		var retour = new Object();
		retour.width = this.width;
		retour.height = this.height;
		retour.cells = new Array();
		var x,y;
		for(y=0;y<this.height;y++){
			retour.cells[y] = new Array();
			for(x=0;x<this.width;x++){
				retour.cells[y][x] = this.cells[y][x].getSave();
			}
		}
		retour.npc = new Array();
		for(x in this.npc){
			retour.npc.push(this.npc[x].getSave());
		}
		return retour;
	},
	//Gestion de PNJ
	getNPC: function(){
		return this.npc;
	},
	addNPC: function(npc){
		this.npc.push(npc);
	},
	removeNPC: function(id){
		this.npc.splice(id, 1);
	},
	getSelectedNPC: function(){
		return this.selected_npc;
	}
}

function Cell(){
	this.c1 = false;
	this.c2 = false;
	this.c3 = false;
	this.t = 0;
}
Cell.isSame = function(calque, c1, c2){
	if(calque == 4) return c1==c2;
	if(c1 == false && c2 == false) return true;
	else if(c1 == undefined || c1.id == undefined || c1.tileset == undefined || c2 == undefined || c2.id == undefined || c2.tileset == undefined) return false;
	return c1.id == c2.id && c1.tileset == c2.tileset;
};
Cell.prototype={
	getC1:function(){ return this.c1; },
	setC1:function(id){ this.c1 = id; },
	getC2:function(){ return this.c2; },
	setC2:function(id){ this.c2 = id; },
	getC3:function(){ return this.c3; },
	setC3:function(id){ this.c3 = id; },
	getT:function(){ return this.t; },
	setT:function(id){ this.t = id; },
	getC:function(id) {
		if(id == 1) return this.c1;
		else if(id==2) return this.c2;
		else if(id ==3) return this.c3;
		else if(id ==4) return this.t;
		return false;
	},
	setC: function(id, value){
		if(id == 1) this.c1 = value;
		else if(id==2) this.c2 = value;
		else if(id ==3) this.c3 = value;
		else if(id ==4) this.t = value;
		else return false;
		return true;
	},
	getSave: function(){
		return {l1: (this.c1)?this.c1.id:-1, l2: (this.c2)?this.c2.id:-1, l3: (this.c3)?this.c3.id:-1, t:this.t};
	}
}