function DialogManager(){
	this.dispatcher = new EventDispatcher(this);
	document.getElementById('dialog_new').onmousedown = function(e){ dialog_manager.dispatcher.dispatchEvent('NewDialog', {x: e.offsetX, y : e.offsetY, b: e.button}); return false;};
	document.getElementById('dialog_save').onmousedown = function(e){ dialog_manager.dispatcher.dispatchEvent('SaveDialog', {x: e.offsetX, y : e.offsetY, b: e.button}); return false;};
	document.getElementById('dialog_add_reply').onmousedown = function(e){ dialog_manager.dispatcher.dispatchEvent('AddReply', {x: e.offsetX, y : e.offsetY, b: e.button}); return false;};
	document.getElementById('dialog_dialog').onmousedown = function(e){ dialog_manager.dispatcher.dispatchEvent('DialogPressed', {x: e.offsetX, y : e.offsetY, b: e.button}); return false;};
	document.getElementById('dialog_c_valider').onmousedown = function(e){ dialog_manager.dispatcher.dispatchEvent('Valider', {x: e.offsetX, y : e.offsetY, b: e.button}); return false;};
	document.getElementById('dialog_list').onchange = function(e){ dialog_manager.dispatcher.dispatchEvent('dialogChanged', this.value); return false;};
	document.getElementById('dialog_condition').onchange = function(e){ dialog_manager.dispatcher.dispatchEvent('conditionChanged', this.value); return false;};
	
	this.dialogs = [];
	this.replies = [];
	this.condition = [];
	
	this.selected_dialog = -1;
	
	this.dispatcher.addEventListener(this, 'NewDialog', this.NewDialog);
	this.dispatcher.addEventListener(this, 'SaveDialog', this.save);
	this.dispatcher.addEventListener(this, 'AddReply', this.addReply);
	this.dispatcher.addEventListener(this, 'DialogPressed', this.DialogPressed);
	reply_manager.dispatcher.addEventListener(this, 'replySelected', this.replySelected);
	this.dispatcher.addEventListener(this, 'dialogListReceived', this.dialogListReceived);
	this.dispatcher.addEventListener(this, 'Valider', this.ValiderPressed);
	this.dispatcher.addEventListener(this, 'dialogChanged', this.dialogChanged);
	this.dispatcher.addEventListener(this, 'dialogSaveSuccess', this.dialogSaveSuccess);
	this.dispatcher.addEventListener(this, 'conditionChanged', this.conditionChanged);
	
	this.updateDialogList();
}


DialogManager.prototype={
	dialogSaveSuccess: function(e){
		this.updateDialogList();
		
		$("#dialog_id").val(e.datas.id);
	},
	conditionChanged: function(){
		this.checkCondition();
	},
	checkCondition: function(){
		$("#dialog_condition_control").removeClass("error");
		$("#dialog_condition_control").removeClass("success");
		var cond = $("#dialog_condition").val().trim();
		if(cond != ""){
			var c = new ConditionParser(cond);
			if(!c.isValid()){
				//Condition invalide
				$("#dialog_condition_control").addClass("error");
				$("#dialog_condition_help").html(c.getError());
				return;
			}
			else{
				this.condition = c.getCondition();
				$("#dialog_condition_control").addClass("success");
			}
		}
		else this.condition = [];
		$("#dialog_condition_help").html("");
	},
	save: function(e){
		//Sauvegarde du dialog
		var id = $("#dialog_id").val();
		if(id == "") id = -1;
		var text = $("#dialog_text").val();
		var condition = $('#dialog_condition').val();
		$.ajax({
			url:"action.php",
			type:'post',
			dataType:'json',
			data:{
				action:'dialog_save',
				id: id,
				text: text,
				dialog: this.selected_dialog,
				replies: this.replies,
				condition: condition,
				condition_array: this.condition,
			},
			success: function(e){
				dialog_manager.dispatcher.dispatchEvent('dialogSaveSuccess', e);
			}
		})
	},
	selectDialog: function(id){
		this.selected_dialog = id;
		if(id == -1) $('#dialog_dialog_view').html("Aucun");
		else $('#dialog_dialog_view').html(this.dialogs[id].id+" - "+this.dialogs[id].text);
	},
	dialogChanged: function(e){
		//Changement de Dialog sélectionné
		var dialog = this.dialogs[e.datas];
		if(!dialog) return;
		//On a bien un dialog correspondant
		$('#dialog_id').val(dialog.id);
		$('#dialog_text').val(dialog.text);
		$('#dialog_condition').val(dialog.condition);
		this.checkCondition();
		this.selectDialog(dialog.dialog);
		this.replies = dialog.replies;
		this.updateReplies();
	},
	dialogListReceived: function(e){
		this.dialogs = e.datas;
		
		//On recrée la liste
		var html = "";
		for(var i in this.dialogs){
			html += "<option value='"+this.dialogs[i].id+"'>"+this.dialogs[i].id+" - "+this.getDialogSummary(i)+"</option>";
		}
		
		$("#dialog_c_list").html("<option value='-1'>Aucun</option>"+html);
		$("#dialog_list").html(html);
	},
	updateDialogList: function(){
		$.ajax({
			url:"action.php",
			type:'post',
			dataType:'json',
			data:{action:'dialog_list'},
			success: function(e){
				dialog_manager.dispatcher.dispatchEvent('dialogListReceived', e);
			}
		});
	},
	NewDialog:function(){
		$('#dialog_id').val(-1);
		$('#dialog_text').val('');
		$('#dialog_condition').val('');
		this.checkCondition();
		this.selectDialog(-1);
		this.replies = [];
		this.updateReplies();
	},
	addReply: function(){
		reply_manager.openDialog();
	},
	replySelected: function(data){
		this.replies[this.replies.length] = data.datas;
		this.updateReplies();
	},
	updateReplies: function(){
		var html = "";
		for(var i in this.replies){
			html += "<div><span class='delete' onClick='dialog_manager.removeReply("+i+")'>x</span><span>"+this.replies[i]+" - "+reply_manager.getReply(this.replies[i]).text+"</span></div>";
		}
		$("#dialog_replies").html(html);
	},
	removeReply: function(index){
		if(!this.replies[index]) return;
		this.replies.splice(index,1);
		this.updateReplies();
	},
	DialogPressed:function(){
		this.openDialog(this.selected_dialog);
		this.setDialogListener(this, this.DialogSelected);
	},
	setDialogListener: function(obj, callback){
		this.dispatcher.setEventListener(obj, 'dialogChange', callback);
	},
	getDialogSummary: function(id){
		var d = this.dialogs[id];
		if(!d) return "";
		if(d.text.length < 30) return d.text;
		else return d.text.substring(0,25)+"...";
	},
	DialogSelected: function(e){
		this.selectDialog(e.datas);
		
	},
	ValiderPressed: function(){
		$("#DialogModal").modal('hide');
		var id = parseInt($("#dialog_c_list").val());
		this.dispatcher.dispatchEvent('dialogChange', id);
	},
	openDialog: function(value){
		if(value != undefined) $("#dialog_c_list").val(value);
		$("#DialogModal").modal('show');
	}
};