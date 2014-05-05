/*
* Fenetre de sélection d'un charset
*/
function CharsetManager(charsetcount, modal){
	//Modale de sélection
	this.modal = modal;
	//Nombre total de charset
	this.count = charsetcount;
	
	this.dispatcher = new EventDispatcher(this);
	
	//Largeur/Hauteur max d'un charset affiché
	this.w = 40;
	this.h = 60;
	this.curx = 5;
	this.cury = 5;
	
	this.element = this.modal.find('canvas')[0];
	this.ctx = this.element.getContext('2d');
	this.ctx.webkitImageSmoothingEnabled = false;
	this.element.d = this.dispatcher;
	this.element.onmousedown = function(e){ this.d.dispatchEvent('mousedown', {x: e.offsetX, y : e.offsetY, b: e.button}); return false;};
	this.element.oncontextmenu = function(e){ return false;};
	this.element.onmousemove = function(e){ this.d.dispatchEvent('mousemove', {x: e.offsetX, y : e.offsetY} );};
	this.dispatcher.addEventListener(this, 'mousedown', this.mousedown);
	this.dispatcher.addEventListener(this, 'mousemove', this.mousemove);
	
	//On charge les images
	this.images = new Object();
	for(var i=1;i<=this.count;i++){
		this.images[i] = new Image();
		this.images[i].src = "charset/charset"+i+".png";
	}
}


CharsetManager.prototype={
	open: function(){
		this.modal.modal();
		this.curx = -1;
		this.cury = -1;
		this.updateView();
	},
	addCharacterListener: function(context, listener){
		this.dispatcher.addEventListener(context, 'character', listener);
	},
	updateView: function(){
		var mx = Math.floor(800/(this.w+5));
		this.ctx.fillStyle = "white";
		this.ctx.fillRect(0,0,this.element.width, this.element.height);
		var id = 0;
		while(id < this.count){
			var x = (id%mx)*(this.w+5);
			var y = Math.floor(id/mx)*(this.h+5);
			if((id%mx) == this.curx && Math.floor(id/mx) == this.cury){
				this.ctx.strokeRect(x-1,y-1,this.w+2, this.h+2);
			}
			this.drawTileRect(id, x, y, this.w, this.h, this.ctx);
			id++;
		}
	},
	drawTileRect: function(id,x,y,w,h,ctx){
		var img = this.images[id];
		if(!img) return false;
		if(img.width == 0) return false;
		var tw = img.width/4;
		var th = img.height/4;
		
		var cx=0,cy=0,cw=0,ch=0;
		
		if(tw/th < w/h){
			ch = h;
			cw = tw*ch/th;
		}
		else{
			cw = w;
			ch = th*cw/tw;
		}
		
		cx = (w-cw)/2;
		cy = (h-ch)/2;
		ctx.drawImage(img, 0,0,tw,th, x+cx, y+cy, cw, ch);
		
		/*
		ctx.drawImage(tileset.getImage(), pos.x, pos.y, T_WIDTH, T_HEIGHT, x, y, T_WIDTH, T_HEIGHT);*/
	},
	mousedown: function(e){
		var x = Math.floor(e.datas.x/(this.w+5));
		var y = Math.floor(e.datas.y/(this.h+5));
		var id = y*Math.floor(800/(this.w+5))+x;
		if(id >= 0 && id <= this.count){
			this.modal.modal('hide');
			this.dispatcher.dispatchEvent('character', {id:id});
		}
	},
	mousemove: function(e){
	//	console.log(e);
		var x = Math.floor(e.datas.x/(this.w+5));
		var y = Math.floor(e.datas.y/(this.h+5));
		var id = y*Math.floor(800/(this.w+5))+x;
		if(id >= 0 && id <= this.count && (this.curx != x || y != this.cury)){
			this.curx = x;
			this.cury = y;
			this.updateView();
		}
	},
	getCharset: function(id){
		if(!this.images[id] || this.images[id].width == 0) return false;
		return new Charset(this.images[id]);
	}
};


function Charset(image){
	this.image = image;
	this.cw = image.width/4;
	this.ch = image.height/4;
}

Charset.prototype={
	draw: function(ctx, x, y){
		ctx.drawImage(this.image,0,0,this.cw, this.ch, x+T_WIDTH/2-this.cw/2, y+T_WIDTH-this.ch, this.cw , this.ch);
	},
};