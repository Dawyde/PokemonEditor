var editor;
var loaded=0;
var T_WIDTH = 32;
var T_HEIGHT = 32;

var T_MAX = 8;

var maps = false;

window.onload = function(){
	/*this.tilesets = new TilesetManager(T_WIDTH, T_HEIGHT);
	this.tilesets.addTileset("tileset/tile1.png");
	this.tilesets.onload = function(){
		alert("coucou");
	}
	this.tilesets.init();
	new_map();*/
	editor = new EditorManager(['tileset/tile1.png']);
	$(document).mouseup(function(e){ editor.mouseUp(e); });
	setCalque(1);
}
function toogleHiddenLayout(id){
	if(editor.getMapUI().toogleHiddenLayout(id)) $("#layout_h"+id).addClass("active");
	else $("#layout_h"+id).removeClass("active");
}
function setCalque(id){
	$("#active_calque button").removeClass('active');
	editor.getMapUI().setCurrentCalque(id);
	$("#active_calque #c"+id).addClass('active');
}