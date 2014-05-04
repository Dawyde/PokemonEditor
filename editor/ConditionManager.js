//Gestionnaire de l'éditeur de condition

var TYPE_NUMBER = 1;
var TYPE_VARIABLE = 2;
var TYPE_OPERATOR = 3;
var TYPE_OPEN_PAR = 4;
var TYPE_CLOSE_PAR = 5;
var TYPE_VIRG = 6;

var CONDITION_EQUALS = 1;
var CONDITION_NOTEQUALS = 2;
var CONDITION_LESS = 3;
var CONDITION_LESSEQUALS = 4;
var CONDITION_MORE = 5;
var CONDITION_MOREEQUALS = 6;
var CONDITION_AND = 7;
var CONDITION_OR = 8;
var CONDITION_NUMBER = 9;
var CONDITION_GET_ITEM = 10;
var CONDITION_MONNEY = 11;

function ConditionParser(expression){
	this.expression = expression
	this.cursor = 0;
	this.valid = false;
	this.condition;
	this.error = "";
	this.parse();
}

ConditionParser.prototype = {
	parse: function(){
		try{
			this.condition = this.readExpression();
			this.valid = true;
		}
		catch(exception){
			this.error = exception;
		}
	},
	isValid: function(){
		return this.valid;
	},
	getError: function(){
		return this.error;
	},
	getCondition: function(){
		return this.expression.getArray();
	},
	readExpression: function(){
		var retour = new ConditionExpression();
		while(!this.isEnd()){
			var word = this.read();
			if(word == false) break;
			//Fin d'expression
			if(word.type == TYPE_CLOSE_PAR) break;
			//Expression imbriquée
			if(word.type == TYPE_OPEN_PAR) retour.addExpression(this.readExpression());
			//Opérateur
			else if(word.type == TYPE_OPERATOR) retour.addOperator(word.text);
			//Nombre
			else if(word.type == TYPE_NUMBER) retour.addExpression(new ConditionNumber(word.text));
			else if(word.type == TYPE_VARIABLE){
				//Variable ou Fonction
				if(this.isFunction(word.text)){
					var p = this.read();
					if(p.type != TYPE_OPEN_PAR) throw "Fonction invalide";
					var args = new Array();
					while(!this.isEnd()){
						p = this.read();
						if(p != false && p.type == TYPE_NUMBER) args[args.length] = p.text;
						else throw "Fonction invalide";
						p = this.read();
						if(p != false && p.type == TYPE_CLOSE_PAR) break;
						else if(p != false && p.type == TYPE_VIRG) break;
						else throw "Fonction invalide";
					}
					retour.addExpression(new ConditionFunction(word.text, args));
				}
				else{
					retour.addExpression(new ConditionVariable(word.text));
				}
			}
		}
		if(!retour.isComplete()) throw "Expression incomplete"
		return retour;
	},
	isFunction: function(text){
		return (text == 'getItem');
	},
	isEnd: function(){
		return this.cursor >= this.expression.length;
	},
	read: function(){
		var retour = "";
		var type = -1;
		while(this.cursor < this.expression.length){
			var c = this.expression[this.cursor];
			var code = c.charCodeAt(0);
			if(!isNaN(parseInt(c))){
				//Nombre
				if(type == -1){
					retour += c;
					type = TYPE_NUMBER;
				}
				else if(type == TYPE_NUMBER) retour += c;
				else if(type == TYPE_VARIABLE){
					retour += c;
				}
				else break;
			}
			else if(c == ' '){
				//Espace
				if(type != -1) break;
			}
			else if(c == '('){
				if(type == -1){
					type = TYPE_OPEN_PAR;
					retour = c;
				}
				else break;
			}
			else if(c == ')'){
				if(type == -1){
					type = TYPE_CLOSE_PAR;
					retour = c;
				}
				else break;
			}
			else if(c == ','){
				if(type == -1){
					type = TYPE_VIRG;
					retour = c;
				}
				else break;
			}
			else if(c == '=' || c == '!' || c == '<' || c == '>' || c == '&' || c == '|'){
				if(type == -1){
					type = TYPE_OPERATOR;
					retour = c;
				}
				else if(type == TYPE_OPERATOR){
					retour += c;
				}
				else break;
			}
			else if((code >= 65 && code <= 90) || code == 95 || (code >= 97 && code <= 122)){
				//Lettre
				if(type == -1){
					type = TYPE_VARIABLE;
					retour = c;
				}
				else if(type == TYPE_VARIABLE){
					retour += c;
				}
				else break;
			}
			
			//if(IsNumeric(c)) alert("oui"+c);
			this.cursor++;	
		}
		if(type == -1) return false;
		return {type: type, text: retour};
	}
};

//Diférents truc qu'on peut rencontrer dans une expression

//Nombre
function ConditionNumber(value){
	this.value = parseInt(value);
}
ConditionNumber.prototype={
	toString: function(){
		return this.value;
	},
	getArray: function(){
		return [CONDITION_NUMBER, this.value];
	}
}
//Variable
function ConditionVariable(name){
	this.name = name;
}
ConditionVariable.prototype={
	toString: function(){
		return this.name;
	},
	getArray: function(){
		var type;
		if(this.name == 'monney') type = CONDITION_MONNEY;
		else throw "Variable "+this.name+" innexistante";
		return [type];
	}
}
//Fonction
function ConditionFunction(name, args){
	this.name = name;
	this.args = args;
}
ConditionFunction.prototype={
	toString: function(){
		return this.name+"("+this.args.join(", ")+")";
	},
	getArray: function(){
		var type;
		if(this.name == 'getItem'){
			if(this.args.length != 1) throw "La fonction getItem attend 1 paramètre";
			type = CONDITION_GET_ITEM;
		}
		else throw "Fonction "+this.name+" innexistante";
		
		return [type, args];
	}
};

//Expression composite
function ConditionExpression(){
	this.exp1 = false;
	this.exp2 = false;
	this.operator = false;
}
ConditionExpression.prototype = {
	needOperator: function(){
		return this.exp1 != false && this.operator == false;
	},
	addOperator: function(exp){
		if(!this.needOperator()) throw "Opérateur inattendu";
		this.operator = exp;
	},
	addExpression: function(exp){
		if(this.needOperator()) throw "Opérateur attendu";
		
		if(this.exp1 == false) this.exp1 = exp;
		else if(this.exp2 == false) this.exp2 = exp;
		else throw "Expression innatendue";
	},
	toString: function(){
		return this.exp1.toString()+" "+this.operator+" "+this.exp2.toString();
	},
	isComplete: function(){
		return this.exp2 != false;
	},
	getArray: function(){
		var type;
		if(this.operator == '==') type = CONDITION_EQUALS;
		else if(this.operator == '!=') type = CONDITION_NOTEQUALS;
		else if(this.operator == '<') type = CONDITION_LESS;
		else if(this.operator == '<=') type = CONDITION_LESSEQUALS;
		else if(this.operator == '>') type = CONDITION_MORE;
		else if(this.operator == '>=') type = CONDITION_MOREEQUALS;
		else if(this.operator == '&&') type = CONDITION_AND;
		else if(this.operator == '||') type = CONDITION_OR;
		else throw "Opérateur invalide : "+this.operator;
		return [type, this.exp1.getArray(), this.exp2.getArray()];
	}
};