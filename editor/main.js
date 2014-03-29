var tilesets;
var loaded=0;
var T_WIDTH = 32;
var T_HEIGHT = 32;

var T_MAX = 8;

var maps = false;

window.onload = function(){
	this.tilesets = new TilesetManager(T_WIDTH, T_HEIGHT);
	this.tilesets.addTileset("tileset/tile1.png");
	this.tilesets.onload = function(){
		alert("coucou");
	}
	this.tilesets.init();
	new_map();
}


function new_map(){
	maps = new Map(10,10);
}
function loadImages(){
	var i;
	tilesets_images = [];
	for(i=0;i<tilesets.length;i++){
		tilesets_images[i] = new Image();
		tilesets_images[i].onload = function(){
			loaded++;
			if(loaded == tilesets.length){
				initTile();
				initMap();
			}
		}
		tilesets_images[i].src = tilesets[i];
	}
}
function initMap(){
	var canvas = document.getElementById("map");
	canvas.onclick = function(e){
		var x = Math.floor(e.offsetX/T_WIDTH);
		var y = Math.floor(e.offsetY/T_HEIGHT);
		var id = selected[0]+selected[1]*T_MAX;
			maps.getCell(x,y).setC1(id);
			drawMap();
		if(maps.length < y && maps[y].length < x){
			console.log(id);
		}
	}
	drawMap();
}
function initTile(){
	var canvas = document.getElementById("tiles");
	canvas.onclick=function(e){
		var x = Math.floor(e.offsetX/T_WIDTH);
		var y = Math.floor(e.offsetY/T_HEIGHT);
		selected = [x,y];
		drawTile();
	}
	drawTile();
}
function drawTile(){
	var canvas = document.getElementById("tiles");
	canvas.height = tilesets_images[0].height;
	var ctx = canvas.getContext("2d");
	ctx.clearRect(0,0,250,600);
	for(y=0;y<tilesets_images[0].height/T_HEIGHT;y++){
		for(x=0;x<T_MAX;x++){
			ctx.drawImage(tilesets_images[0], T_WIDTH*x, T_HEIGHT*y, T_WIDTH, T_HEIGHT, T_WIDTH*x, T_HEIGHT*y, T_WIDTH, T_HEIGHT);
		}
	}
	ctx.beginPath();
	ctx.rect(T_WIDTH*selected[0], T_HEIGHT*selected[1], T_WIDTH, T_HEIGHT);
	ctx.stroke();
}
function drawMap(){
	var canvas = document.getElementById("map");
	var ctx = canvas.getContext("2d");
	var x = 0;
	var y = 10;
	var x1 = 2;
	var y1 = 2;
	for(y=0;y<maps.getHeight();y++){
		for(x=0;x<maps.getWidth();x++){
			x1 = maps.getCell(x,y).getC1()%8;
			y1 = Math.floor(maps.getCell(x,y).getC1()/8);
			ctx.drawImage(tilesets_images[0], T_WIDTH*x1, T_HEIGHT*y1, T_WIDTH, T_HEIGHT, T_WIDTH*x, T_HEIGHT*y, T_WIDTH, T_HEIGHT);
		}
	}
}
