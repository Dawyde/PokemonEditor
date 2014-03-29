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

Cell.prototype={
	getC1:function(){ return this.c1; },
	setC1:function(id){ this.c1 = id; },
	getC2:function(){ return this.c2; },
	setC2:function(id){ this.c2 = id; }
}