(function(){

var Buttons=function(name,actions,container,insert,run){
	this.name=name;
	this.actions=actions;
	this.container=container;
	this.insert=insert;
	this.run=run;
	return this;
},
buttons=function(name,actions,container,insert,run){
	return new Buttons(name,actions,container,insert,run);	
},
type=lib('>type');
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
var Block=function(type,val){
	this.id='blk_'+ID();
	this.type=type;
	this.val=''+val;
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
			expression.unshift(new Block('number',0));
			len=expression.length;
		}
		lastnum=true;
		for(;i<len;i++){
			block=expression[i];
			if(block.type=='sign'){
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
				else{
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

var evaluate=function(){
	var operators = {
	    '+': function(x, y){return (x + y);},
	    '-': function(x, y){return (x - y);},
	    '*': function(x, y){return (x * y);},
	    '/': function(x, y){return (x / y);},
	    '^': function(x, y){return Math.pow(x,y);}
	};

	return function(expr){
	    var stack = [];
	    
	    expr.forEach(function(token){
	        if (token in operators) {
	            var y=stack.pop(), x= stack.pop();
	            stack.push(operators[token](x, y));
	        } else {
	            stack.push(parseFloat(token));
	        }
	    });

	    return stack.pop();
	}
}();
var INPUT=function(expression,elem){
	this.nPthes=0;
	this.expression=expression;
	this.elem=elem;
};
INPUT.prototype.maxLen=13;

INPUT.prototype.openBkt=function(){
	var lastBlock,len;
		len=this.expression.length;
		lastBlock=this.expression[len-1];
	if(lastBlock){
		if(lastBlock.type=='sign' && lastBlock.val!=')'){
			this.addBlock(new Block('sign','('));
			this.nPthes++;
		}
	}
	else{
		this.addBlock(new Block('sign','('));
		this.nPthes++;
	}
};
INPUT.prototype.closeBkt=function(){
	var lastBlock,len;
	if(this.nPthes>0){
		len=this.expression.length;
		lastBlock=this.expression[len-1];
		if(lastBlock && lastBlock.type=='sign' && lastBlock.val!=')'){return;}
		this.addBlock(new Block('sign',')'));
		this.nPthes--;
	}
};
INPUT.prototype.addBlock=function(block){
	this.expression.push(block);
	this.elem.exprsn.span({'id':block.id,'class':block.type,
				'text':block.val});
	return block;
};
INPUT.prototype.addFirst=function(block){
	this.expression.unshift(block);
	this.elem.exprsn.first().span({'id':block.id,'class':block.type,
				'text':block.val});
	return block;
};
INPUT.prototype.beforeRemove=function(block){
	if(block.type=='sign'){
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
INPUT.prototype.removeBlock=function(index){
	var block=this.expression[index];
	this.beforeRemove(block);
	this.expression.splice(index,1);
	this.elem.exprsn.node.removeChild(document.getElementById(block.id));
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
INPUT.prototype.clear=function(){
	this.expression=[];
	this.nPthes=0;
	this.elem.exprsn.empty();
	this.elem.result.empty();
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
			this.elem.result.node.textContent='';
			this.elem.result.empty();
		}
	} 
	else{
		this.elem.result.node.textContent='';
	}
};
INPUT.prototype.result=function(){
	if(this.nPthes>0){
		alert('The parenthesis are unbalanced.\n Check your expression again!')
	}
	else{
		var rpn,res; 
		rpn=RPN(this.expression);
		res=''+evaluate( rpn );
		this.elem.result.setText( (res.length>3) ? addCommas(res) : res);
	}
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
			panel[pos]=container.div({'class':'tools '+pos+'-panel'}).in;
		}
	}
	scene=container.div({'class':'expression-scene'}).in;
	elem.exprsn=scene.div({'class':'wrapper expression'}).in
						.div({'id':'expression'}).in;
	elem.result=scene.div({'id':'result'}).in;

	this.input=new INPUT([],elem);
	this.insertButtons();
};

//var rLastPthes=/[\(\)]\s*$/;
//var rLastNumber=/(\d+)\s*$/;
var rPoint=/\./;
Calculator.prototype.buttons=[
	//arithmetic
	buttons('arithmetic',['+','-','*','/','^'],function(panel){
		return panel.left.div({'class':'vertical buttons'}).in;
	},
	function(action){
		return this.container.a({'href':'#','class':'button round gray','text':action}).in;
	},
	function(action){
		var lastBlock,len;
		len=this.expression.length;
		lastBlock=this.expression[len-1];
		if(lastBlock){
			if(lastBlock.type=='sign' && lastBlock.val!=')'){return;}
			else{
				this.addBlock(new Block('sign',action));
			}
		}
	}),

	//parenthesis

	buttons('parenthesis',['(',')'],'arithmetic',
	function(action){
		return this.container.a({'href':'#','class':'button round gray','text':action}).in;
	},
	[
		function(){
			this.openBkt();
		},
		function(){
			this.closeBkt();
		}
	]),

	//numeric
	buttons('numeric',['+/-',0,'.',1,2,3,4,5,6,7,8,9],function(panel){
		return panel.top.div({'class':'horizontal buttons'}).in;
	},
	function(action){
		return this.container.a({'href':'#','class':'button round gray','text':action}).in;
	},function(){

		var num, rsign, dot, clear;

		clear=function(input){
			if(input.elem.result.node.textContent!==''){
				input.elem.result.node.textContent='';
				input.elem.result.empty();
			}
		};

		num=function(action){
			var len,val,
			lastBlock,prevBlock;
			
			len=this.expression.length;
			prevBlock=this.expression[len-2];
			lastBlock=this.expression[len-1];

			if(prevBlock && prevBlock.type=='sign' && prevBlock.val==')' ){
				if(lastBlock.type=='sign'){
					this.addBlock(new Block('number',action));
				}
			} 
			else if(lastBlock){
				if(lastBlock.type=='number'){
					if(lastBlock.val.length<this.maxLen){
						if(lastBlock.val==='0'){
							if(action==0){
								return;
							}else{
								lastBlock.val='';
							}
						}
						lastBlock.val+=action;
						this.changeLastNum(lastBlock.val);
					}
				}
				else{
					if( lastBlock.val!=')' ){
						this.addBlock(new Block('number',action));
					}
				}
			}
			else{
				this.addBlock(new Block('number',action));
			}

			clear(this);
		};

		rsign=function(){
			var input=this,
			len,
			lastBlock,prevBlock;
			
			len=this.expression.length;
			prevBlock=this.expression[len-2];
			lastBlock=this.expression[len-1];

			if(prevBlock){
				if(prevBlock.val=='-'){
					if(len>2){
						input.changeBlock(len-2,'+');
					}
					else{
						input.removeFirst();
					}
				}
				else if(prevBlock.val=='+'){
					input.changeBlock(len-2,'-');
				}
			} 
			else if(lastBlock){
				if(lastBlock.val=='-'){
					input.removeFirst();
				} 
				else{
					input.addFirst(new Block('sign','-'));
				}
			}
			else{
				input.addFirst(new Block('sign','-'));
			}
			clear(this); 
		};

		dot=function(){
			var len, lastBlock;
			lastBlock=this.expression[this.expression.length-1];
			len=lastBlock.val.length;
			if( lastBlock.type=='number' && len>0 && len<(this.maxLen-1) && !rPoint.test(lastBlock.val)){
				this.changeLastNum(lastBlock.val+'.');
			}
			clear(this);
		};

		return [rsign,num,dot,num,num,num, num,num,num, num,num,num];

	}()),

	//edit
	buttons('edit',['C','<='],function(panel){
		return panel.bottom.div({'class':'horizontal buttons-left'}).in;
	},
	[
		function(action){
			return this.container.a({'href':'#','class':'button rect magenta','style':'width:130px','text':action}).in;
		},
		function(action){
			return this.container.a({'href':'#','class':'button rect gray','style':'width:100px','text':action}).in;
		}
	],
	[
		function(){
			this.clear();
		},
		function(){
			this.backspace();
		}
	]),

	buttons('result',['='],function(panel){
		return panel.bottom.div({'class':'horizontal buttons-right'}).in;
	},
	[function(action){
		return this.container.a({'href':'#','class':'button rect blue','style':'width:75px','text':action}).in;
	}],function(){
		this.result();
	})

];

Calculator.prototype.insertButtons=function(){
	var calc=this,
	panel=this.panel,
	buttons=this.buttons,
	button,
	container,
	c={},
	eachInsert,
	eachRun,
	elem,fn,
	i=0,j,len=buttons.length,
	acts;

	for(;i<len;i++){
		button=buttons[i];
		container=buttons[i].container;
		if(typeof container == 'string'){
			j=buttons.length;
			if(c.hasOwnProperty(container)){
				container=c[container];
			}
			else{
				for(;j--;){
					if(buttons[j].name===container){
						c[container]=buttons[j].container(panel);
						buttons[j].container=container;
						break;
					}
				}
				if(c.hasOwnProperty(container)){
					container=c[container];
				}
				else{
					return console.log('buttons container not found!');
				}
			}

		}else{
			container=container(panel);
			c[button.name]=container;
		}
		buttons[i].container=container;
		
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
		j=0;
		acts=button.actions.length;
		for(;j<acts;j++){
			elem=eachInsert(button.actions[j],j);
			if(fn=eachRun(j)){
				elem.click(function(run,action){
				return function(e){
					run.call(calc.input,action);
					//calc.pressButton(run,action);
					//run();
					e.preventDefault();
					}
				}(fn,button.actions[j] ));
					
			}
		}
	}
	delete c;
};

window['Calculator']=Calculator;

})();