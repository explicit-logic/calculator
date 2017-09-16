(function(){

var Buttons=function(name,actions,container,insert,run,keys){
	this.name=name;
	this.actions=actions;
	this.container=container;
	this.insert=insert;
	this.run=run;
	this.keys=keys;
	return this;
},
buttons=function(name,actions,container,insert,run,keys){
	return new Buttons(name,actions,container,insert,run,keys);	
},
type=lib('>type');
lib('event');
var raddCommas=/\B(?=(\d{3})+(?!\d))/g;
function addCommas(x) {
    var parts = x.split(".");
    parts[0] = parts[0].replace(raddCommas, ",");
    return parts.join(".");
}

var ID=function(){
	var n=0;
	return function(){
		n=(++n)%1000;
		return ''+n;
	}
}();
var Num=function(val){
	this.id='blk_'+ID();
	this.val=''+val;
};
Num.prototype.type='number';
Num.prototype.format=function(){
	return ((this.val.length>3) ? addCommas(this.val) : this.val);
};
var Sign=function(val){
	this.id='blk_'+ID();
	this.val=''+val;
};
Sign.prototype.type='sign';
Sign.prototype.format=function(){
	return this.val;
};
var Bracket=function(val){
	this.id='blk_'+ID();
	this.val=''+val;
};
Bracket.prototype.type='bracket';
Bracket.prototype.format=function(){
	return this.val;
};
function RPN(expression){
	var stack=[], out=[],
	prior = {
		"^":{"prior":4, "assoc":"right"},
		"*":{"prior":3, "assoc":"left"},
		"/":{"prior":3, "assoc":"left"},
		"+":{"prior":2, "assoc":"left"},
		"-":{"prior":2, "assoc":"left"},
		"(":{"prior":0, "assoc":"left"},
		")":{"prior":0, "assoc":"left"}
	},
	currPr,currAsc,
	prevPr,
	lastnum, num,
	block,
	bracket,
	opr, endopr, lastopr,
	len=expression.length,i=0,
	rpn;
	if(len){
		if(expression[0].type!='number'){
			expression.unshift(new Num(0));
			len=expression.length;
		}
		lastnum=true;
		for(;i<len;i++){
			block=expression[i];
			if(block.type=='bracket'){
				if(block.val==='('){
					stack.push(block.val);
					lastnum=false;
				}
				else if(block.val===')'){
					bracket=false;
					while(!bracket && stack){
						opr=stack.pop();
						if(opr=='('){
							bracket=true;
						}
						else{
							out.push(opr);
						}
					}
					if(!bracket){
						console.log('The parenthesis are unbalanced!');
						return false;
					}
					lastnum=false;
				}
			}
			else if(block.type=='sign'){
				endopr=false;
				while(!endopr){
					lastopr=stack.pop();
					if(lastopr){
						currPr=prior[block.val]['prior'];
						currAsc=prior[block.val]['assoc'];
						prevPr=prior[lastopr]['prior'];

						switch(currAsc){
							case 'left':
									if(currPr>prevPr){
										stack.push(lastopr);
										stack.push(block.val);
										endopr=true;
									}
									else if(currPr<=prevPr){
										out.push(lastopr);
									}
								
							break;
							case 'right':
									if(currPr>=prevPr){
										stack.push(lastopr);
										stack.push(block.val);
										endopr=true;
									}
									else if(currPr<prevPr){
										out.push(lastopr);
									}
							break;
						}
					}
					else{
						stack.push(block.val);
						endopr=true;
					}
				}
				lastnum=false;
			}	
			else if(block.type=='number'){
				out.push(block.val);
				lastnum=true;
			}
		}
		rpn=out;
		while(block=stack.pop()){
			rpn.push(block);
		}
		return rpn;

	}
	else{
		console.log('expression is empty!');
	}
}

// var evaluate=function(){
// 	var operators = {
// 	    '+': function(x, y){return (x + y);},
// 	    '-': function(x, y){return (x ? (x - y) : y*-1);},
// 	    '*': function(x, y){return (x * y);},
// 	    '/': function(x, y){return (x / y);},
// 	    '^': function(x, y){return Math.pow(x,y);}
// 	};

// 	return function(expr){
// 	    var stack = [];
	    
// 	    expr.forEach(function(token){
// 	        if (token in operators) {
// 	            var y=stack.pop(), x= stack.pop();
// 	            stack.push(operators[token](x, y));
// 	        }
// 	        else {
// 	            stack.push(parseFloat(token));
// 	        }
// 	    });
// 	    return stack.pop();
// 	}
// }();

var evaluate=function(){
	var operators = {
	    '+': function(x, y){return (x.plus(y));},
	    '-': function(x, y){return (x ? x.minus(y) : y.times(-1));},
	    '*': function(x, y){return (x.times(y));},
	    '/': function(x, y){return ( x.dividedBy(y) );},
	    '^': function(x, y){return x.toPower(y);}
	};

	return function(expr){
	    var stack = [];
	    var k=0;
	    
	    expr.forEach(function(token){
	        if (token in operators) {
	            var y=stack.pop(), x= stack.pop();
	            stack.push(
	            	new BigNumber( operators[token](x, y) )
	            	);
	        }
	        else {
	            stack.push(new BigNumber(token));
	        }
	    });
	    return stack.pop();
	}
}();

var Keyboard=function(){
	this._enabled=true;
	this.keys={};
	this.init();
};
Keyboard.prototype.init=function(){
	var ctrl,
	handler=function(kbrd){
		return function(e){
			if( kbrd.isEnabled() ){
				if (!e.metaKey && !e.ctrlKey) {
		    		e.preventDefault ? e.preventDefault() : (e.returnValue = false);
		    	}
				var code=e.keyCode;
				if(e.shiftKey){
					code*=16;
		  		}
		  		if(kbrd.keys.hasOwnProperty(code)){
		  			kbrd.keys[code]();
		  		}
	  		}
		}
	};
	ctrl=function(){
		handler=handler(this);
		on(document,"keydown", handler);
	};
	ctrl.off=function(){
		off(document,"keydown", handler);
	}
	return ctrl;
}();
Keyboard.prototype.addAction=function(key,fn){
	this.keys[key]=fn;
};
Keyboard.prototype.enable=function(){
	this._enabled=true;
};
Keyboard.prototype.disable=function(){
	this._enabled=false;
};
Keyboard.prototype.isEnabled=function(){
	return this._enabled;
};
Keyboard.prototype.detach=function(){
	this.init.off();
};

var INPUT=function(elem){
	this.nPthes=0;
	this.expression=[];
	this.elem=elem;
	this.init();
};
INPUT.prototype.maxLen=13;


INPUT.prototype.init=function(){
	var input=this;
	this.elem.exprsn.click(function(e){
		var elem=e.target,prevBlock;
		return;
		if(elem.className==='number'){
			index=input.removeBlock(elem);
			
			if(index>0){
				prevBlock=this.expression[index-1];
				if(prevBlock.val!='('){
					input.removeById(prevBlock.id);
				}
			}
		}
		e.preventDefault ? e.preventDefault() : (e.returnValue = false);
	});

};
INPUT.prototype.openBkt=function(){
	var lastBlock,len;
		len=this.expression.length;
		lastBlock=this.expression[len-1];
	
	if(!lastBlock || lastBlock.type=='sign' || (lastBlock.type=='bracket' && lastBlock.val=='(')){
		this.addBlock(new Bracket('('));
		this.nPthes++;
	}
	else if(lastBlock.type=='number' && lastBlock.val=='-'){
		this.changeLastType('sign');
		this.addBlock(new Bracket('('));
		this.nPthes++;
	}
};
INPUT.prototype.closeBkt=function(){
	var lastBlock,len,type;
	if(this.nPthes>0){
		len=this.expression.length;
		lastBlock=this.expression[len-1];
		if(lastBlock){
			type=lastBlock.type;
			if(type!='sign' && (type!='number' || lastBlock.val!='-')){
				this.addBlock(new Bracket(')'));
				this.nPthes--;
			}
		}
	}
};
INPUT.prototype.addBlock=function(block){
	this.expression.push(block);
	this.elem.exprsn.span({'id':block.id,'class':block.type,
				'text':block.format()});
	return block;
};
INPUT.prototype.addFirst=function(block){
	this.expression.unshift(block);
	this.elem.exprsn.first().span({'id':block.id,'class':block.type,
				'text':block.format()});
	return block;
};
INPUT.prototype.addDigit=function(digit){
	var len,val,
	lastBlock;
	
	len=this.expression.length;
	lastBlock=this.expression[len-1];

	if(lastBlock){
		if(lastBlock.type=='number'){
			if(lastBlock.val.length<this.maxLen){
				this.changeLastNum(
					(lastBlock.val==='0') ? ((digit==0)?'0':''+digit) : (lastBlock.val+digit)
					);
			}
		}
		else{
			if( lastBlock.type=='sign' || lastBlock.val=='('){
				this.addBlock(new Num(digit));
			}
		}
	}
	else{
		this.addBlock(new Num(digit));
	}
};
INPUT.prototype.addSign=function(sign){
	var lastBlock,len,lastCh;
	len=this.expression.length;
	lastBlock=this.expression[len-1];
	if(lastBlock){
		if(lastBlock.type=='bracket'){
			if(lastBlock.val==')'  ){
				this.addBlock(new Sign(sign));
			} else if(sign=='-' && lastBlock.val=='('){
				this.addBlock(new Num(sign));
			}
		}
		else if(lastBlock.type=='number'){
			if(lastBlock.val!='-'){
				lastCh=lastBlock.val.slice(-1);
				if(lastCh=='.'){
					this.changeLastNum( lastBlock.val.slice(0, -1) );
				}
				this.addBlock(new Sign(sign));
			}
		}
	}else if(sign=='-'){
		this.addBlock(new Num(sign));
	}
};
INPUT.prototype.addDot=function(){
	var len, lastBlock, val;
	lastBlock=this.expression[this.expression.length-1];
	if(lastBlock){
		val=lastBlock.val;
		len=val.length;
		if( lastBlock.type=='number' && len>0 && val!='-'
			&& len<(this.maxLen-1) && !rPoint.test(val)
			){
			this.changeLastNum(val+'.');
		}
	}
};
INPUT.prototype.beforeRemove=function(block){
	if(block.type=='bracket'){
		if(block.val==')'){
			this.nPthes++;
		} else if(block.val=='('){
			this.nPthes--;
		}
	}
};
INPUT.prototype.removeFirst=function(){
	var block=this.expression.shift();
	this.beforeRemove(block);
	this.elem.exprsn.node.removeChild(this.elem.exprsn.node.firstChild);
};
INPUT.prototype.removeLast=function(){
	var block=this.expression.pop();
	this.beforeRemove(block);
	this.elem.exprsn.node.removeChild(this.elem.exprsn.node.lastChild);
};
INPUT.prototype.changeLastType=function(type){
	this.expression[this.expression.length-1].type=type;
	this.elem.exprsn.node.lastChild.className=type;
};
INPUT.prototype.changeBlock=function(index, val){
	var block=this.expression[index],el;
	this.expression[index].val=val;
	el=document.getElementById(block.id);
	el.textContent=val;
};
INPUT.prototype.changeLastNum=function(val){
	this.expression[this.expression.length-1].val=val;
	this.elem.exprsn.node.lastChild.textContent=(val.length>3) ? addCommas(val) : val;
}
INPUT.prototype.changeLast=function(val){
	this.expression[this.expression.length-1].val=val;
	this.elem.exprsn.node.lastChild.textContent=val;
}
INPUT.prototype.removeBlock=function(elem){
	var block, id=elem.id,
	index=this.expression.length;
	for(;--index;){
		block=this.expression[index];
		if(block.id==id){
			this.beforeRemove(block);
			this.expression.splice(index,1);
			this.elem.exprsn.node.removeChild(elem);

			return index;
		}
	}
};
INPUT.prototype.removeById=function(id){
	var block,index;
	index=this.expression.length;
	for(;--index;){
		block=this.expression[index];
		if(block.id===id){
			this.beforeRemove(block);
			this.expression.splice(index,1);
			this.elem.exprsn.node.removeChild(document.getElementById(block.id));
			return true;
		}
	}
};
INPUT.prototype.clearRes=function(){
	this.elem.result.empty();
	this.elem.result.attr({'title':''});
};
INPUT.prototype.clear=function(){
	this.expression=[];
	this.nPthes=0;
	this.elem.exprsn.empty();
	this.clearRes();
	location.hash='';
};
INPUT.prototype.backspace=function(){
	var len=this.expression.length,lastBlock;
	if(len>0){
		lastBlock=this.expression[len-1];
		if(lastBlock.val.length>1 && lastBlock.type=='number'){
			this.changeLastNum( lastBlock.val.slice(0, -1) );
		}
		else{
			this.removeLast();
		}
		if(this.elem.result.node.textContent!==''){
			this.clearRes();
		}
	} 
	else{
		this.elem.result.node.textContent='';
	}
};
INPUT.prototype.result=function(){
	var len=this.expression.length,lastBlock;
	if(len>0){
		lastBlock=this.expression[len-1];
		if(lastBlock.type!='sign'){
			if(this.nPthes>0){
				alert('The parenthesis are unbalanced.\n Check your expression again!')
			}
			else{
				var rpn,res,hash;
				hash=this.toString(); 
				rpn=RPN(this.expression);
				//console.log(rpn);
				res=''+evaluate( rpn );
				this.elem.result.setText( (res.length>3) ? addCommas(res) : res);
				location.hash=hash;
				if(res.length>20){
					this.elem.result.attr({'title':res});
				}
			}
		}
	}
};
INPUT.prototype.charCount=function(){
	var expr=this.expression,
	i=expr.length,
	count=0;
	for(;i--;){
		count+=expr[i].val.length;
	}
	return count;
};
INPUT.prototype.parser=function(){
	var numSet='01234567890.',
	signSet='+-/*^',
	brktSet='()',
	dot='.',
	isNum=function(ch){return (numSet.indexOf(ch)!=-1);},
	isSign=function(ch){return (signSet.indexOf(ch)!=-1);},
	isDot=function(ch){return (ch===dot)},
	typeBkt=function(ch){
		if(ch==='('){
			return 'open';
		} else if(ch===')'){
			return 'close';
		}
	};

	return function(expr){
		var i=0, len=expr.length,
		ch,
		type;
		this.expression=[];
		for(;i<len;i++){
			ch=expr.charAt(i);
			if(isNum(ch)){
				this.addDigit(ch);
			} 
			else if(isSign(ch)){
				this.addSign(ch);
			}
			else if(type=typeBkt(ch)){
				this[type+'Bkt']();
			}
		}
		this.result();
	}

}();
INPUT.prototype.toString=function(){
	var expr=this.expression,
	i=0, len=expr.length,
	out='';
	for(;i<len;i++){
		out+=expr[i].val;
	}
	return out;
};

var Calculator=function(container){
	this.container=container;
	this.input=null;
	this.panel={
		top:null,
		left:null,
		right:null,
		bottom:null
	};
	this.keyboard=null;
	this.init();
	return this;
}
Calculator.prototype.init=function(){
	var pos,
		panel=this.panel,
		container=this.container,
		scene,
		elem={
			exprsn:null,
			result:null
		};
	for(pos in panel){
		if(panel.hasOwnProperty(pos)){
			panel[pos]=container.div({'class':'tools '+pos+'-panel'}).$;
		}
	}
	scene=container.div({'class':'expression-scene'}).$;
	elem.exprsn=scene.div({'class':'wrapper expression'}).$
						.div({'id':'expression'}).$;
	elem.result=scene.div({'id':'result'}).$;
	this.keyboard=new Keyboard();
	this.input=new INPUT(elem);
	this.input.parser(location.hash);
	this.insertButtons();
};

//var rLastPthes=/[\(\)]\s*$/;
//var rLastNumber=/(\d+)\s*$/;
function verticalCenter(elem){
	elem.css('margin-top',(elem.offset().height/2)*-1);
}
var rPoint=/\./;
Calculator.prototype.buttons=[
	//arithmetic
	buttons('arithmetic',['+','-','*','/','^'],function(panel){
		return panel.left.div({'class':'vertical buttons'}).$;
	},
	function(action){
		var elem=this.container.a({'href':'#','class':'button round gray','text':action}).$;
		verticalCenter(this.container);
		return elem;
	},
	function(sign){
		this.addSign(sign);
	},
	[[107,16*187],[109,189],[16*56,106],[111,191],16*54]),

	//parenthesis

	buttons('parenthesis',['(',')'],'arithmetic',
	function(action){
		var elem=this.container.a({'href':'#','class':'button round gray','text':action}).$;
		verticalCenter(this.container);
		return elem;
	},
	[
		function(){
			this.openBkt();
		},
		function(){
			this.closeBkt();
		}
	],[16*57,16*48]),

	//numeric
	buttons('numeric',[0,'.',1,2,3,4,5,6,7,8,9],function(panel){
		return panel.top.div({'class':'horizontal buttons'}).$;
	},
	function(action){
		return this.container.a({'href':'#','class':'button round gray','text':action}).$;
	},function(){

		var num, dot, clear;

		clear=function(input){
			if(input.elem.result.node.textContent!==''){
				input.clearRes();
			}
		};

		num=function(digit){
			this.addDigit(digit);
			clear(this);
		};

		dot=function(){
			var lastBlock;
			lastBlock=this.expression[this.expression.length-1];
			this.addDot();
			if(lastBlock){
				clear(this);
			}
		};

		return [num,dot,num,num,num, num,num,num, num,num,num];

	}(),
	[[48,96],[190,110],[49,97],[50,98],[51,99],[52,100],[53,101],[54,102],[55,103],[56,104],[57,105]]),

	//edit
	buttons('edit',['C','<='],function(panel){
		return panel.bottom.div({'class':'horizontal buttons-left'}).$;
	},
	[
		function(action){
			return this.container.a({'href':'#','class':'button rect magenta','style':'width:130px','text':action}).$;
		},
		function(action){
			return this.container.a({'href':'#','class':'button rect gray',
				'text':String.fromCharCode(8592)}).$;
		}
	],
	[
		function(){
			this.clear();
		},
		function(){
			this.backspace();
		}
	],[27,8]),

	buttons('result',['='],function(panel){
		return panel.bottom.div({'class':'horizontal buttons-right'}).$;
	},
	[function(action){
		return this.container.a({'href':'#','class':'button rect blue','style':'width:75px','text':action}).$;
	}],function(){
		this.result();
	},[[13,187]])

];

Calculator.prototype.insertButtons=function(){
	var calc=this,
	panel=this.panel,
	buttons=this.buttons,
	button,
	container, target,
	c={},
	eachInsert,
	eachRun,
	eachKey,
	elem,fn,
	key,
	ctrl, k,
	i=0,j,len=buttons.length,
	acts;

	for(;i<len;i++){
		button=buttons[i];
		container=null;
		target=buttons[i].container;
		if(typeof target == 'string'){
			j=buttons.length;
			if(c.hasOwnProperty(target)){
				container=c[target];
			}
			else{
				for(;j--;){
					if(buttons[j].name===target){
						c[target]=buttons[j].container(panel);
						buttons[j].container=target;
						break;
					}
				}
				if(c.hasOwnProperty(target)){
					container=c[target];
				}
				else{
					return console.log('buttons container not found!');
				}
			}

		}else if(typeof target=='function'){
			container=target(panel);
			c[button.name]=container;
		}
		if(container){
			buttons[i].container=container;
		}
		else{
			continue;
		}
		
		if('array'===type(button.insert)){
			eachInsert=function(insrs){
				return function(action,index){
					return button.insert[index%insrs].call(button,action);
				}
			}(button.insert.length);
		}
		else{
			eachInsert=function(action){
				return button.insert(action);
			}
		}
		if('array'===type(button.run)){
			eachRun=function(runs){
				return function(index){
					return button.run[index%runs];
				}
			}(button.run.length);
		}
		else{
			eachRun=function(){
				return button.run;
			}
		}
		if('array'===type(button.keys)){
			eachKey=function(index){
				return button.keys[index];
			}
		}
		else{
			eachKey=null;
		}
		j=0;
		acts=button.actions.length;
		for(;j<acts;j++){
			elem=eachInsert(button.actions[j],j);
			if(fn=eachRun(j)){
				elem.click(function(run,action){
				return function(e){
					run.call(calc.input,action);
					//event.preventDefault ? event.preventDefault() : (event.returnValue = false);
					if(e.preventDefault) {e.preventDefault();}
					else{ e.returnValue = false;}
					}
				}(fn,button.actions[j] ));
				if(eachKey){
					if(key=eachKey(j)){
						ctrl=function(run,action){
							return function(){
								run.call(calc.input,action);
							}
						}(fn,button.actions[j]);
						if('array'===type(key)){
							k=key.length;
							for(;k--;){
								this.keyboard.addAction(key[k],ctrl);
							}
						}
						else{
							this.keyboard.addAction(key,ctrl);
						}
					}	
				}
			}
		}
	}
	delete c;
};

window['Calculator']=Calculator;

})();