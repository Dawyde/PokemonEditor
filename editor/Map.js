function Map(width, height){
	this.width = width;
	this.height = height;
	this.cells = new Array();
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
	getWidth: function(){ return this.width; },
	getHeight: function(){ return this.height; }

}

function Cell(){
	this.c1 = false;
	this.c2 = false;
	this.c3 = false;
}
Cell.isSame = function(c1, c2){
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
	getC:function(id) {
		if(id == 1) return this.c1;
		else if(id==2) return this.c2;
		else if(id ==3) return this.c3;
		return false;
	},
	setC: function(id, value){
		if(id == 1) this.c1 = value;
		else if(id==2) this.c2 = value;
		else if(id ==3) this.c3 = value;
		else return false;
		return true;
	}
}