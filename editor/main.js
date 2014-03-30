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
	editor.getMapUI().addEventListener(false, 'layoutchange', layoutChange);
	editor.getMapUI().addEventListener(false, 'hiddenlayoutchange', hiddenLayoutChange);
	editor.addEventListener(false, 'toolchange', toolChange);
}

function toogleHiddenLayout(id){
	editor.getMapUI().toogleHiddenLayout(id)
}
function setCalque(id){
	editor.getMapUI().setCurrentCalque(id);
}
function setTool(id){
	editor.setTool(id);
}

//Gestion event
function layoutChange(e){
	$("#active_calque button").removeClass('active');
	$("#active_calque #c"+e.datas.id).addClass('active');
}
function hiddenLayoutChange(e){
	if(e.datas.active) $("#layout_h"+e.datas.id).addClass("active");
	else $("#layout_h"+e.datas.id).removeClass("active");
}
function toolChange(e){
	$("#tools button").removeClass('active');
	$("#tools #tool_"+e.datas.id).addClass('active');
}