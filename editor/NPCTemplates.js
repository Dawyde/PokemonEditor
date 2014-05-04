function NPCTemplates(){
	this.dispatcher = new EventDispatcher(this);
	this.element = document.getElementById('npc_charset');
	this.ctx = this.element.getContext('2d');
	this.ctx.webkitImageSmoothingEnabled = false;
	this.element.d = this.dispatcher;
	this.npc_list = new Array();
	
	this.element.onmousedown = function(e){ this.d.dispatchEvent('canvasdown', {x: e.offsetX, y : e.offsetY, b: e.button}); return false;};
	document.getElementById('npc_dialog').onmousedown = function(e){ npc_manager.dispatcher.dispatchEvent('opendialogselection', {x: e.offsetX, y : e.offsetY, b: e.button}); return false;};
	document.getElementById('npc_new').onmousedown = function(e){ npc_manager.dispatcher.dispatchEvent('newnpc', {x: e.offsetX, y : e.offsetY, b: e.button}); return false;};
	document.getElementById('npc_save').onmousedown = function(e){ npc_manager.dispatcher.dispatchEvent('npc_save', {x: e.offsetX, y : e.offsetY, b: e.button}); return false;};
	document.getElementById('npc_c_valider').onmousedown = function(e){ npc_manager.dispatcher.dispatchEvent('modal_valid', {x: e.offsetX, y : e.offsetY, b: e.button}); return false;};
	document.getElementById('npc_list').onchange = function(e){ npc_manager.dispatcher.dispatchEvent('selection_change', this.value); return false;};
	
	this.dispatcher.addEventListener(this, 'canvasdown', this.canvasdown);
	this.dispatcher.addEventListener(this, 'npclistupdated', this.npclistupdated);
	this.dispatcher.addEventListener(this, 'newnpc', this.newnpc);
	this.dispatcher.addEventListener(this, 'opendialogselection', this.opendialogselection);
	this.dispatcher.addEventListener(this, 'npc_save', this.save);
	this.dispatcher.addEventListener(this, 'npc_saved', this.saveSuccess);
	this.dispatcher.addEventListener(this, 'modal_valid', this.modalValid);
	this.dispatcher.addEventListener(this, 'selection_change', this.selectionChange);
	charset_manager.addCharacterListener(this, this.characterchanged);
	
	this.updateNPCList();
	
	this.selected_id = -1;
	this.selected_dialog = -1;
}

NPCTemplates.prototype={
	addChangeListener: function(context, callback){
		this.dispatcher.addEventListener(context, "changeNPC", callback);
	},
	characterchanged: function(e){
		this.selectCharacter(e.datas.id);
	},
	selectCharacter: function(id){
		this.selected_id = id;
		this.ctx.fillStyle = "white";
		this.ctx.fillRect(0,0,100,150);
		charset_manager.drawTileRect(id, 0, 0, 100, 150, this.ctx);
	},
	selectDialog: function(id){
		this.selected_dialog = id;
		if(id == -1) $("#npc_dialog_view").html("Aucun");
		else $("#npc_dialog_view").html("Dialog "+id);
	},
	selectionChange: function(e){
		if(this.npc_list[e.datas]){
			//On change de PNJ
			$("#npc_id").val(this.npc_list[e.datas].id);
			$("#npc_name").val(this.npc_list[e.datas].name);
			this.selectDialog(this.npc_list[e.datas].dialog);
			this.selectCharacter(this.npc_list[e.datas].character);
		}
	},
	save: function(){
		//Sauvegarde du PNJ actuel
		var id = $("#npc_id").val();
		if(id == "") id = -1;
		var name = $("#npc_name").val();
		if(this.selected_id == -1){
			alert("Vous devez choisir une apparence valide");
			return;
		}
		$.ajax({
			url:"action.php",
			type:'post',
			dataType:'json',
			data:{
				action:'npc_tmp_save',
				id: id,
				name: name,
				character: this.selected_id,
				dialog: this.selected_dialog
			},
			success: function(e){
				npc_manager.dispatcher.dispatchEvent('npc_saved', e);
			}
		})
	},
	saveSuccess: function(e){
		$("#npc_id").val(e.datas.id);
		this.updateNPCList();
	},
	opendialogselection: function(){
	
	},
	canvasdown: function(){
		charset_manager.open();
	},
	newnpc:function(){
		//Nouveau PNJ
		$("#npc_id").val(-1);
		$("#npc_name").val("");
		this.selectDialog(-1);
		this.selectCharacter(-1);
	},
	npclistupdated: function(data){
		this.npc_list = data.datas;
		//On recrée la liste
		var html = "";
		for(var i in this.npc_list){
			html += "<option value='"+this.npc_list[i].id+"'>"+this.npc_list[i].id+" - "+this.npc_list[i].name+"</option>";
		}
		
		$("#npc_list").html(html);
		$("#npc_c_list").html(html);
	},
	updateNPCList: function(){
		$.ajax({
			url:"action.php",
			type:'post',
			dataType:'json',
			data:{action:'npc_tmp_list'},
			success: function(e){
				npc_manager.dispatcher.dispatchEvent('npclistupdated', e);
			}
		});
	},
	openDialog: function(){
		$("#NPCModal").modal("show");
	},
	modalValid: function(){
		$("#NPCModal").modal("hide");
		this.dispatcher.dispatchEvent("changeNPC", parseInt($("#npc_c_list").val()));
	}
};