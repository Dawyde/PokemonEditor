function History(map){
	this.current = 0;
	this.max = 20;
	this.history = new Array();
	this.map = map;
}

History.prototype = {
	addElement: function(element){
		if(element.isEmpty()) return;
		this.history.splice(this.current, this.history.length-this.current, element);
		if(this.current >= this.max){
			this.history.shift();
		}
		else{
			this.current++;
		}
	},
	cancel: function(){
		if(this.current == 0) return false;
		this.history[this.current-1].cancel(this.map);
		this.current--;
		return true;
	},
	restore: function(){
		if(this.current == this.history.length) return false;
		this.history[this.current].apply(this.map);
		this.current++;
		return true;
	}
};

function Element(){
	this.datas = new Object();
}
Element.prototype = {
	isEmpty: function(){
		return this.datas.lenght == 0;
	},
	addAction: function(x, y, layout, start, end){
		if(Cell.isSame(start, end)) return;
		if(this.datas[y] == undefined) this.datas[y] = new Object();
		if(this.datas[y][x] != undefined) this.datas[y][x] = {layout: layout, start:this.datas[y][x].start, end:end};
		else this.datas[y][x] = {layout:layout, start:start, end:end};
	},
	cancel:function(map) {
		var x, y;
		for(y in this.datas){
			for(x in this.datas[y]){
				map.getCell(x,y).setC(this.datas[y][x].layout, this.datas[y][x].start);
			}
		}
	},
	apply:function(map) {
		var x, y;
		for(y in this.datas){
			for(x in this.datas[y]){
				map.getCell(x,y).setC(this.datas[y][x].layout, this.datas[y][x].end);
			}
		}
	}
};