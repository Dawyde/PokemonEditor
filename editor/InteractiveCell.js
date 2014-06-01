function InteractiveCellManager(manager){
	this.current_cell = false;
	this.manager = manager;
	
}
InteractiveCellManager.prototype = {
	setSelectedCell: function(x, y){
		//On change la cellule sélectionnée
		this.save();
		
		//On récupere la nouvelle cellule
		var cell = this.manager.getMap().getCell(x, y);
		if(cell.ic) this.current_cell = cell.ic;
		else this.current_cell = new InteractiveCell(x, y);
		
		this.updateView();
	},
	getSelected: function(){
		return this.current_cell;
	},
	updateView: function(){
		var html = "";
		if(this.current_cell != false) html = this.current_cell.getHTML();
		$("#ics").html(html);
	},
	addEffect: function(){
		if(this.current_cell != false){
			this.current_cell.addEffect();
			this.updateView();
		}
	},
	removeEffect: function(id){
		if(this.current_cell != false){
			this.current_cell.removeEffect(id);
			this.updateView(true);
		}
	},
	selectDialog: function(index){
		if(this.current_cell != false) this.current_cell.selectDialog(index);
	},
	save: function(){
		if(this.current_cell != false){
			if(!this.current_cell.isEmpty()) this.manager.getMap().getCell(this.current_cell.x, this.current_cell.y).ic = this.current_cell;
			else this.manager.getMap().getCell(this.current_cell.x, this.current_cell.y).ic = false;
		}
	}
};


function InteractiveCell(x, y){
	this.x = x;
	this.y = y;
	this.type = 1;
	this.next = false;
	this.GE = [];
	this.current_ge = -1;
}
InteractiveCell.prototype = {
	setDatas: function(obj){
		this.type = obj.t
		this.loadGE(obj.ges);
	},
	save: function(){
		var t = parseInt($("#ic_type").val());
		if(t == 1 || t == 2) this.type = t;
		return {
			t:this.type,
			ges: this.saveGE(),
		};
	},
	getHTML: function(){
		
		var t = parseInt($("#ic_type").val());
		if(t == 1 || t == 2) this.type = t;
	
		var html = "<p>";
		
		html += "<span class='entete'>X : "+this.x+", Y : "+this.y+"</span>";
		
		html += "<label>Déclencement : <select id='ic_type'>";
		html += "<option value='1'"+(this.type==1?" selected='selected'":"")+">ArriveOnCell</option><option value='2'"+(this.type==2?" selected='selected'":"")+">Action</option>";
		html += "</select></label>";
			
		//Effect list
		html += "<div class='effects'>"+this.getGEHtml()+"</div>";
		
		html += "<label>Ajouter un effet : <select id='ic_effects_type'>"+getEffectList()+"</select><input type='button' class='btn' value='Ajouter' onClick='editor.getICManager().addEffect();'/></label>";
		
		html += "</p>";
		
		//Cellule suivante ?
		if(this.next != false) html += this.next.getHTML();
		
		return html;
	},
	isEmpty: function(){
		return this.GE.length == 0;
	},
	getGEHtml: function(no_update){
		var html = "";
		for(var i in this.GE){
			if(!no_update) this.GE[i].update('ic', i);
			html += this.GE[i].getHtml(reply_manager, 'ic', i);
		}
		return html;
	},
	removeEffect: function(id){
		//Suppression d'un effet
		for(var i in this.GE){
			this.GE[i].update('ic', i);
		}
		this.GE.splice(id,1);
	},
	addEffect: function(){
		var id = parseInt($("#ic_effects_type").val());
		var nge;
		if(id == GE_MONNEY) nge = new GameEffect(id, [0]);
		else if(id == GE_GIVE_ITEM) nge = new GameEffect(id, [0,0]);
		else if(id == GE_DIALOG) nge = new GameEffect(id, [-1]);
		else if(id == GE_TELEPORT){
		
			nge = new GameEffect(id, ["",0,0]);
		}
		else return;
		this.GE[this.GE.length] = nge;
	},
	selectDialog: function(ge_index){
		this.current_ge = ge_index;
		dialog_manager.setDialogListener(this, this.dialogSelected);
		dialog_manager.openDialog(this.GE[ge_index].getValue(0));
	},
	loadGE: function(object){
		this.GE = [];
		for(var i in object){
			this.GE[i] = new GameEffect(object[i][0], object[i][1]);
		}
	},
	saveGE: function(){
		var save = new Array();
		for(var i in this.GE){
			this.GE[i].update('ic', i);
			if(!this.GE[i].isValid()) continue;
			save[save.length] = this.GE[i].getData();
		}
		return save;
	},
	dialogSelected: function(e){
		$("#ic_gr_"+this.current_ge+"_view").html(e.datas==-1?"Aucun":e.datas+" - "+dialog_manager.getDialogSummary(e.datas));
		this.GE[this.current_ge].setValue(0, e.datas);
	}
};