function ReplyManager(){
	
	this.dispatcher = new EventDispatcher(this);
	
	document.getElementById('reply_effect_add').onmousedown = function(e){ reply_manager.dispatcher.dispatchEvent('addEffectPressed', {x: e.offsetX, y : e.offsetY, b: e.button}); return false;};
	document.getElementById('reply_new').onmousedown = function(e){ reply_manager.dispatcher.dispatchEvent('newReplyPressed', {x: e.offsetX, y : e.offsetY, b: e.button}); return false;};
	document.getElementById('reply_save').onmousedown = function(e){ reply_manager.dispatcher.dispatchEvent('replySavePressed', {x: e.offsetX, y : e.offsetY, b: e.button}); return false;};
	document.getElementById('reply_c_valider').onmousedown = function(e){ reply_manager.dispatcher.dispatchEvent('replyValiderPressed', {x: e.offsetX, y : e.offsetY, b: e.button}); return false;};
	document.getElementById('reply_list').onchange = function(e){ reply_manager.dispatcher.dispatchEvent('replyChanged', this.value); return false;};
	this.GE = [];
	
	this.reply_list = [];
	
	this.current_ge = -1;
	
	this.dispatcher.addEventListener(this, 'addEffectPressed', this.addEffect);
	this.dispatcher.addEventListener(this, 'newReplyPressed', this.newReply);
	this.dispatcher.addEventListener(this, 'replyListReceived', this.newReplyList);
	this.dispatcher.addEventListener(this, 'replySavePressed', this.save);
	this.dispatcher.addEventListener(this, 'replySaveSuccess', this.saveSuccess);
	this.dispatcher.addEventListener(this, 'replyChanged', this.replyChanged);
	this.dispatcher.addEventListener(this, 'replyValiderPressed', this.validerPressed);
	
	this.updateGameEffects();
	this.updateReplyList();
}

ReplyManager.prototype={
	updateGameEffects: function(no_update){
		var html = "";
		for(var i in this.GE){
			if(!no_update) this.GE[i].update(i);
			html += this.GE[i].getHtml(i);
		}
		$("#reply_effects").html(html);
	},
	replyChanged: function(datas){
		var id = datas.datas;
		if(!this.reply_list[id]) return;
		var r = this.reply_list[id];
		$("#reply_id").val(r.id);
		$("#reply_text").val(r.text);
		this.loadGE(r.ge);
	},
	saveSuccess: function(e){
		$("#reply_id").val(e.datas.id);
		this.updateReplyList();
	},
	save:function(){
		//Sauvegarde de la réponse actuelle
		var id = $("#reply_id").val();
		if(id == "") id = -1;
		var text = $("#reply_text").val();
		$.ajax({
			url:"action.php",
			type:'post',
			dataType:'json',
			data:{
				action:'reply_save',
				id: id,
				text: text,
				ge: this.saveGE(),
			},
			success: function(e){
				reply_manager.dispatcher.dispatchEvent('replySaveSuccess', e);
			}
		})
	},
	newReplyList: function(e){
		this.reply_list = e.datas;
		//On recrée la liste
		var html = "";
		for(var i in this.reply_list){
			html += "<option value='"+this.reply_list[i].id+"'>"+this.reply_list[i].id+" - "+this.reply_list[i].text+"</option>";
		}
		
		$("#reply_list").html(html);
		$("#reply_c_list").html(html);
	},
	updateReplyList: function(){
		$.ajax({
			url:"action.php",
			type:'post',
			dataType:'json',
			data:{action:'reply_list'},
			success: function(e){
				reply_manager.dispatcher.dispatchEvent('replyListReceived', e);
			}
		});
	},
	newReply: function(id){
		this.GE = [];
		this.updateGameEffects();
		$("#reply_id").val(-1);
		$("#reply_text").val("");
	},
	removeEffect: function(id){
		//Suppression d'un effet
		for(var i in this.GE){
			this.GE[i].update(i);
		}
		this.GE.splice(id,1);
		var html = "";
		for(var i in this.GE){
			html += this.GE[i].getHtml(i);
		}
		$("#reply_effects").html(html);
	},
	saveGE: function(){
		var save = new Array();
		for(var i in this.GE){
			this.GE[i].update(i);
			if(!this.GE[i].isValid()) continue;
			save[save.length] = this.GE[i].getData();
		}
		return save;
	},
	loadGE: function(object){
		this.GE = [];
		for(var i in object){
			this.GE[i] = new GameEffect(object[i][0], object[i][1]);
		}
		this.updateGameEffects(true);
	},
	getReply: function(id){
		return this.reply_list[id];
	},
	openDialog: function(){
		$("#ReplyModal").modal('show');
		$('#reply_c_list').val(1);
	},
	validerPressed: function(){
		$("#ReplyModal").modal("hide");
		var id = parseInt($("#reply_c_list").val());
		this.dispatcher.dispatchEvent('replySelected', id);
	},
	addReplyListener: function(context, callback){
		this.dispatcher.addEventListener(context, 'replySelected', callback);
	},
	addEffect: function(){
		var id = parseInt($("#reply_effect_types").val());
		var nge;
		if(id == GE_MONNEY) nge = new GameEffect(id, [0]);
		else if(id == GE_GIVE_ITEM) nge = new GameEffect(id, [0,0]);
		else if(id == GE_DIALOG) nge = new GameEffect(id, [-1]);
		else return;
		this.GE[this.GE.length] = nge;
		this.updateGameEffects();
	},
	selectDialog: function(ge_index){
		this.current_ge = ge_index;
		dialog_manager.setDialogListener(this, this.dialogSelected);
		dialog_manager.openDialog(this.GE[ge_index].getValue(0));
	},
	dialogSelected: function(e){
		$("#reply_gr_"+this.current_ge+"_view").html(e.datas==-1?"Aucun":e.datas+" - "+dialog_manager.getDialogSummary(e.datas));
		this.GE[this.current_ge].setValue(0, e.datas);
		
	}
};


var GE_MONNEY = 1;
var GE_GIVE_ITEM = 2;
var GE_DIALOG = 3;

function GameEffect(type, args){
	this.type = type;
	this.args = args;
}

GameEffect.prototype={
	getHtml: function(id){
		var hid = 'reply_gr_'+id;
		var html = "<div id='"+hid+"'><span class='delete' onClick='reply_manager.removeEffect("+id+")'>x</span><span class='title'>";
		if(this.type == GE_MONNEY){
			html += "Ajouter/Retirer Argent</span><p><label>Somme : </label><input type='number' id='"+hid+"_v1' value='"+this.args[0]+"'/></p>";
		}
		else if(this.type == GE_GIVE_ITEM){
			html += "Ajouter/Retirer Objet</span><p><label>Id Objet : </label><input type='number' id='"+hid+"_v1' value='"+this.args[0]+"'/><br/><label>Quantité : </label><input type='number' id='"+hid+"_v2' value='"+this.args[1]+"'/></p>";
		}
		else if(this.type == GE_DIALOG){
			html += "Nouveau dialog</span><p><div class='input-append' style='margin:0px;padding:0px;'><span class='input-xlarge uneditable-input' id='"+hid+"_view'>";
			if(this.args[0] == -1) html += "Aucun";
			else html += this.args[0]+" - "+dialog_manager.getDialogSummary(this.args[0]);
			html+= "</span><button class='btn' onClick='reply_manager.selectDialog("+id+");'>Parcourir</button></div></p>";
		}
		
		html += "</div>";
		return html;
	},
	getValue: function(id){
		return this.args[id];
	},
	setValue: function(id, value){
		this.args[id] = value;
	},
	isValid: function(){
		return this.type == GE_MONNEY || this.type == GE_GIVE_ITEM || this.type == GE_DIALOG;
	},
	update: function(id){
		var hid = 'reply_gr_'+id;
		//Récupération des valeurs
		if(this.type == GE_MONNEY){
			if(document.getElementById(hid+"_v1")) this.args = [parseInt($("#"+hid+"_v1").val())];
		}
		else if(this.type == GE_GIVE_ITEM){
			if(document.getElementById(hid+"_v2")) this.args = [parseInt($("#"+hid+"_v1").val()), parseInt($("#"+hid+"_v2").val())];
		}
		else if(this.type == GE_DIALOG){
		}
	},
	getData: function(){
		return [this.type, this.args];
	}
};