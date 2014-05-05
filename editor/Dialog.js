function DialogManager(){
	this.dispatcher = new EventDispatcher(this);
	document.getElementById('dialog_new').onmousedown = function(e){ dialog_manager.dispatcher.dispatchEvent('NewDialog', {x: e.offsetX, y : e.offsetY, b: e.button}); return false;};
	document.getElementById('dialog_save').onmousedown = function(e){ dialog_manager.dispatcher.dispatchEvent('SaveDialog', {x: e.offsetX, y : e.offsetY, b: e.button}); return false;};
	document.getElementById('dialog_add_reply').onmousedown = function(e){ dialog_manager.dispatcher.dispatchEvent('AddReply', {x: e.offsetX, y : e.offsetY, b: e.button}); return false;};
	document.getElementById('dialog_dialog').onmousedown = function(e){ dialog_manager.dispatcher.dispatchEvent('DialogPressed', {x: e.offsetX, y : e.offsetY, b: e.button}); return false;};
	document.getElementById('dialog_c_valider').onmousedown = function(e){ dialog_manager.dispatcher.dispatchEvent('Valider', {x: e.offsetX, y : e.offsetY, b: e.button}); return false;};
	
	this.dialogs = [];
	this.replies = [];
	
	this.selected_dialog = -1;
	
	this.dispatcher.addEventListener(this, 'NewDialog', this.NewDialog);
	this.dispatcher.addEventListener(this, 'SaveDialog', this.save);
	this.dispatcher.addEventListener(this, 'AddReply', this.addReply);
	this.dispatcher.addEventListener(this, 'DialogPressed', this.DialogPressed);
	reply_manager.dispatcher.addEventListener(this, 'replySelected', this.replySelected);
	this.dispatcher.addEventListener(this, 'dialogListReceived', this.dialogListReceived);
	this.dispatcher.addEventListener(this, 'Valider', this.ValiderPressed);
	
	this.updateDialogList();
}


DialogManager.prototype={
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
				condition_array: ''
			},
			success: function(e){
				reply_manager.dispatcher.dispatchEvent('replySaveSuccess', e);
			}
		})
	},
	selectDialog: function(id){
		this.selected_dialog = id;
		if(id == -1) $('#dialog_dialog_view').html("Aucun");
		else $('#dialog_dialog_view').html(this.dialogs[id].id+" - "+this.dialogs[id].text);
	},
	dialogListReceived: function(e){
		this.dialogs = e.datas;
		
		//On recrée la liste
		var html = "";
		for(var i in this.dialogs){
			html += "<option value='"+this.dialogs[i].id+"'>"+this.dialogs[i].id+" - "+this.dialogs[i].text+"</option>";
		}
		
		$("#dialog_c_list").html("<option value='-1'>Aucun</option>"+html);
		$("#dialog_list").html(html);
		//$("#dialog_c_list").html(html);
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
			html += "<li>"+this.replies[i]+" - "+reply_manager.getReply(this.replies[i]).text+"</li>";
		}
		$("#dialog_replies").html(html);
	},
	DialogPressed:function(){
		this.openDialog();
		$("#dialog_c_list").val(this.
		this.dispatcher.setEventListener(this, 'dialogChange', this.DialogSelected);
	},
	DialogSelected: function(e){
		this.selectDialog(e.datas);
		
	},
	ValiderPressed: function(){
		$("#DialogModal").modal('hide');
		var id = parseInt($("#dialog_c_list").val());
		this.dispatcher.dispatchEvent('dialogChange', id);
	},
	openDialog: function(){
		$("#DialogModal").modal('show');
	}
};