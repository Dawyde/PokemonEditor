//Class de gestion des évenements
function EventDispatcher(owner){
	//Liste des évenements
	this.events = {};
	//Objet qui va créer les évènements
	this.owner = owner;
}

EventDispatcher.prototype={
	addEventListener:function(callbackObj, event_name, callback){
		if(!this.events[event_name]) this.events[event_name] = new Array()
		this.events[event_name].push([callbackObj, callback]);
	},
	setEventListener:function(callbackObj, event_name, callback){
		this.events[event_name] =[[callbackObj, callback]];
	},
	dispatchEvent: function(event_name, datas){
		if(!this.events[event_name]) return false;
		var i;
		var event = {type:event_name, target:this.owner, datas: datas};
		for(i=0;i<this.events[event_name].length;i++){
			this.events[event_name][i][1].call(this.events[event_name][i][0], event);
		}
	}
}