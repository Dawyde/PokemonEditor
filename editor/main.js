var editor;
var loaded=0;
var T_WIDTH = 32;
var T_HEIGHT = 32;

var T_MAX = 8;

var TAB_MAP = 1;
var TAB_NPC = 2;
var TAB_DIALOG = 3;
var TAB_REPLY= 4;

var maps = false;
var charset_manager;
var npc_manager;
var reply_manager;
var dialog_manager;
var mode = TAB_MAP;

window.onload = function(){
	/*this.tilesets = new TilesetManager(T_WIDTH, T_HEIGHT);
	this.tilesets.addTileset("tileset/tile1.png");
	this.tilesets.onload = function(){
		alert("coucou");
	}
	this.tilesets.init();
	new_map();*/
	editor = new EditorManager(['tileset/tile1.png']);
	charset_manager = new CharsetManager(152, $('#CharsetModal'));
	npc_manager = new NPCTemplates();
	reply_manager = new ReplyManager();
	dialog_manager = new DialogManager();
	
	$('a[data-toggle="tab"]').on('shown', function (e) {
	  var anchor = e.target.href.substring(e.target.href.indexOf("#")+1);
	  if(anchor == 'npc') mode = TAB_NPC;
	  else if(anchor == 'dialog') mode = TAB_DIALOG;
	  else if(anchor == 'reply') mode = TAB_REPLY;
	  else{
		mode = TAB_MAP;
		editor.getMapUI().draw();
		updateNPCList();
		}
	})
	$(document).mouseup(function(e){ editor.mouseUp(e); });
	$(document).keydown(function(e){
		if(e.ctrlKey && e.keyCode == 90){
			if(mode == TAB_MAP) editor.cancel();
			return false;
		}
		else if(e.ctrlKey && e.keyCode == 89){
			if(mode == TAB_MAP) editor.restore();
			return false;
		}
		else if(e.ctrlKey && e.keyCode == 83){
			if(mode == TAB_MAP) editor.save();
			return false;
		}
		else if(e.ctrlKey && e.keyCode == 79){
			if(mode == TAB_MAP) editor.open();
			return false;
		}
	});
	editor.getMapUI().addEventListener(false, 'layoutchange', layoutChange);
	editor.getMapUI().addEventListener(false, 'hiddenlayoutchange', hiddenLayoutChange);
	editor.getMapUI().addEventListener(false, 'npcAdded', updateNPCList);
	editor.addEventListener(false, 'toolchange', toolChange);
	editor.addEventListener(false, 'mapchange', updateNPCList);
	$("#map_add_npc").click(addNPC);
	$("#map_npc_list").change(mapNPCSelected);
	$("#map_remove_npc").click(removeNPC);
	npc_manager.addChangeListener(false, npcSelected);
}
function npcSelected(e){
	editor.getMapUI().setSelectedNPC(e.datas);
}
function removeNPC(){
	var id = editor.getMap().getSelectedNPC();
	if(id == -1) return;
	editor.getMap().selectNPC(-1);
	editor.getMap().removeNPC(id);
	updateNPCList();
	editor.getMapUI().draw();
}
function addNPC(){
	npc_manager.openDialog();
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
function updateNPCList(){
	var html = "";
	var npc = editor.getMap().getNPC();
	for(var i in npc){
		html += "<option value='"+i+"'>"+npc[i].getNPC().name+"</option>";
	}
	$("#map_npc_list").html(html);
}
function mapNPCSelected(){
	var id = parseInt($(this).val());
	editor.getMap().selectNPC(id);
	editor.getMapUI().draw();
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