(function(){

var options={
	delimiter:'/'
},
Category={
	'dom':{},
	'ajax':{},
	'event':{},
	'other':{}
},
Tag=Category.dom['tag']=function(elem){
	return new Tag.fn.Elem(elem || document.body);
}, 
ready=function(fn) {
  if (document.readyState === "complete"){
    fn(); 
  } 
  else if (document.addEventListener) {
    document.addEventListener('DOMContentLoaded', fn);
  } else {
    document.attachEvent('onreadystatechange', function() {
      if (document.readyState === "complete"){
        fn();
       }
    });
  }
  return this;
};
ready.tag=function(fn){
	var fn_tag=fn.bind(undefined, Tag);
	ready(fn_tag);
	//return Tag(elem);
};
Category['event']['ready']=ready;
Category.dom.preload=function(imgs){
	var preload=new Image();
	each(imgs,function(src){
		preload.src=src;
	});
};
Tag.fn=Tag.prototype={
	constructor:Tag,
	alias:{
		inside:'$',
		outside:'out'
	},
	setProp:function(name,val){
		var key,
			alias=this.alias;
		if(name in alias){
			this[name]=val;
			this[alias[name]]=val;
		}else{
			var key;
			this[name]=val;
			 for(key in alias){
			 	if(alias[key]==name){
			 		this[key]=val;
			 	}
			 }
		}
		
	}
}
var Elem=Tag.fn.Elem=function(node){
	this.node=node;
	this.is_first=false;
	this.inside=this.$=
	this.outside=this.out=
	null;

	return this;
};
Elem.prototype = Tag.fn;

var fn_tags=['a','abbr','address','area','article','aside','audio',
	  'b','base','bdi','bdo','blockquote','button',
	  'canvas','caption','cite','code','col','colgroup',
	  'datalist','dd','del','details','dfn','dialog','div','dl','dt',
	  'em','embed',
	  'fildset','figcaption','figure','footer','form',
	  'h1','h2','h3','h4','h5','h6','header','hr',
	  'i','iframe','img','input','ins',
	  'kbd','keygen',
	  'label','legend','li','link',
	  'main','map','mark','menu','menuitem','meta','meter',
	  'nav','noscript',
	  'object','ol','optgroup','option','output',
	  'p','param','pre','progress',
	  'q',
	  'rp','rt','ruby',
	  's','samp','section','small','source','span','strong','sub','summary','sup',
	  'table','tbody','td','textarea','tfoot','th','thead','time','tr','track',
	  'u','ul',
	  'var','video',
	  'wbr'],
	   eventTypes='resize,scroll,blur,focus,error,abort,onload,unload,dblclick,mousedown,mouseup,mousemove,mouseover,mouseout,keydown,keypress,keyup,change,select,submit,reset'.split(',');

var type=Category.other['type']=function(obj){
	 return Object.prototype.toString.call(obj).replace(/^\[object (.+)\]$/, '$1').toLowerCase();
},
on=Category['event']['on']=function(el, type, handler) {
	if (el.addEventListener) {el.addEventListener(type, handler);} 
	else {el.attachEvent('on' + type, function(){handler.call(el,window.event);});}
},
off=Category['event']['off']=function(el, type, handler) {
	if (el.removeEventListener){el.removeEventListener(type, handler);}
  	else{el.detachEvent('on' + type, handler);}
},
extend=Category.other['extend']=function(out) {
  out = out || {};

  for (var i = 1; i < arguments.length; i++) {
    var obj = arguments[i];

    if (!obj)
      continue;

    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (typeof obj[key] === 'object')
          out[key] = extend(out[key], obj[key]);
        else
          out[key] = obj[key];
      }
    }
  }

  return out;
},
each=Category.other['each']=function(arr, fn) {
  var i=0, len=arr.length;
  for (; i < len; i++){
  	fn(arr[i],i);
  }
}
function parseAttr(elem,option){
	var attr;
	switch(type(option)){
		case 'string':
			elem.text(option);
		break;
		case 'function':
			attr=option.call(elem);
			if(attr){
				elem.attr(attr);
			}
		break;
		case 'object':
			elem.attr(option);
		break;
	}
}
Tag.fn.create=function(tag,option){
	var node=document.createElement(tag),
	 	elem,attr;
	 	if(this.is_first){
	 		this.node.insertBefore(node, this.node.childNodes[0]);
	 		this.is_first=false;
	 	}
	 	else{
	 		this.node.appendChild(node);
	 	}
	elem=new Elem(node);
	parseAttr(elem,option);
	elem.setProp('outside',this);
	this.setProp('inside',elem);
	return this;  
};
Tag.fn.first=function(){
	this.is_first=true;
	return this;
};
Tag.fn.parent=function(){
	var parent=new Elem(this.node.parentNode);
	return parent;
};
Tag.fn.remove=function(){
	//this.node.removeChild(this.begin.node);
	this.node.parentNode.removeChild(this.node);
	return this;
};
Tag.fn.empty=function(){
	var node=this.node;
	while(node.firstChild){
    	node.removeChild(node.firstChild);
	}
	return this;
};
Tag.fn.attr=function(obj){
	var key;
	for(key in obj){
		if(obj.hasOwnProperty(key)){
			if(key in Tag.fn){
				this[key](obj[key]);
			}
			else{
				this.node.setAttribute(key, obj[key]);
			}
		}
	}
	return this;
};
Tag.fn.addClass=function(name){
	var node=this.node;
	if(node.classList){
		node.classList.add(name);
	}
	else{
		node.className+=' '+name;
	}
};
Tag.fn.offset=function(){
	var node=this.node, 
	rect = node.getBoundingClientRect(), 
	coords={
		width:node.offsetWidth,
		height:node.offsetHeight,
  		top: rect.top + document.body.scrollTop,
  		left: rect.left + document.body.scrollLeft
	};
	return coords;
};
var rPxProp=/(?:size|width|height|left|top|bottom|right)/i;
function setCSSprop(node,key,val){
	var i=0;
	if(rPxProp.test(key)){
		if(typeof val=="number"){
			val=val+'px';
		}
	}
	node.style[key]=val;
}
Tag.fn.css=function(target){
	var key, len=arguments.length,i=0,
		node=this.node;
	if(typeof target=='object'){
		for(key in target){
			if(target.hasOwnProperty(key)){
				setCSSprop(node,key,target[key]);
			}
		}
	}
	else if(len%2==0){
		for(;i<len;i+=2){
			setCSSprop(node,arguments[i],arguments[i+1]);
		}	
	}
	else{
		return node.style[target];
	}
	return this;
};
Tag.fn.bind=function(field){
	var arr,i=0,len,path,segments,index;
	switch(this.node.tagName){
		case 'INPUT':
			field.add(this.node);
			this.node.value=field.val();
			on(this.node, 'change', function(field){
				return function(event){
					field.change(event);
				}
			}(field));
			break;
		case 'SELECT':
			arr=field.val();
			if('array'==type(arr)){
				len=arr.length;
				segments=field.opath.segments;
				index=segments.length;
				for(;i<len;i++){
					segments[index]=i;
					this.option({
						bind:field.model.field(field.opath.toString()),
						value:i
					});
				}
				segments[index]=undefined;
			}
			break;
		default:
			field.add(this.node);
			this.node.innerText=field.val();
			break;
	}
	return this;
};
Tag.fn.text=function(val){
	var node=document.createTextNode(val);
	this.node.appendChild(node);
	return this;
};
Tag.fn.setText=function(val){
	this.node.textContent=val;
	return this;
};
var fnCustomTag=function(tag,alias){
	Tag.fn[alias]=function(option){
	  			return this.create(tag,option);
	  	};
};
fnCustomTag('select','sel');
each(fn_tags,function(tag){
	  Tag.fn[tag]=function(option){
	  			return this.create(tag,option);
	  	};
});

each(eventTypes,function(name){
	Tag.fn[name]=function(handler){
		on(this.node,name,handler);
		return this;
	}
});
Tag.fn.click=function(handler){
	var handlers=arguments,
		len=handlers.length,
		counter=0;
	if(len>1){
		on(this.node,'click',
			function(){
				handlers[counter].call(this);
				counter=++counter%len;
			});
	}else{
		on(this.node,'click',handler);
	}
	return this;
};



/********************************
*		Response Class
*********************************/

var Response=function(xhr){
	this.xhr=xhr;
	return this;
};
Response.prototype.json=function(){
	return JSON.parse(this.xhr.responseText);
};
Response.prototype.xml=function(){
	return this.xhr.responseXML;
}
Response.prototype.toString=function(){
	return this.xhr.responseText;
}

/********************************
*		Request Class
*********************************/
var Request=Category.ajax['req']=function(url){
	return new Request.fn.init(url);
},
serialize = function(obj, prefix) {
  var str = [], p, key, val;
  for(p in obj) {
    if (obj.hasOwnProperty(p)) {
      key = prefix ? prefix + "[" + p + "]" : p; 
      val = obj[p];
      str.push(typeof val == "object" ?
        serialize(val, key) :
        encodeURIComponent(key) + "=" + encodeURIComponent(val));
    }
  }
  return str.join("&");
};
Request.fn=Request.prototype;

Request.fn.init=function(url){
	this.url=url;
	this.xhr=new XMLHttpRequest();
	this.type='GET';
	this.data=
	this.query=
	this.onfail=
	null;
	return this;
};
Request.fn.get=function(obj){
	this.type='GET';
	if(obj) this.query=serialize(obj);
	return this;
};
Request.fn.post=function(obj){
	this.type='POST';
	this.xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	if(obj) this.data=serialize(obj);
	return this;
};
Request.fn.done=function(fn){
	var xhr=this.xhr,req=this;
	xhr.open(this.type,this.url+(this.query? '?'+this.query :''),true);
	xhr.onreadystatechange = function() {
  		if (this.readyState === 4) {
    		if (this.status >= 200 && this.status < 400) {
      		// Success!
      			fn(new Response(this));
    		} else {
    			if(req.onfail){
    				req.onfail(this.status);
    			}
    		}
  		}
	};
	this.xhr.send(this.data);
	this.xhr=null;
};
Request.fn.fail=function(fn){
	this.onfail=fn;
	return this;
};
Request.fn.init.prototype=Request.fn;
/********************************
*		Path Class
*********************************/
var Path=function(path){
	this.path=path;
	this.segments=path.split(options.delimiter);
	return this;
};
Path.prototype.val=function(obj,val){
	var c=this.context(obj), key=this.last();
	if(val){c[key]=val;}
	return c[key];
};
Path.prototype.is=function(path){
	return this.path==path ? true : false;
}
Path.prototype.context=function(obj,deep){
	var segments=this.segments,
		i=0,len=deep||segments.length,
		result,key;
	for(;i<len;i++){
		key=segments[i];
		if(key in obj){
			result=obj;
			obj=obj[key];
		}
		else{
			throw new Error('Incorrect key: '+key);
		}
	}
	return result;
};
Path.prototype.last=function(){
	var segments=this.segments;
	return segments[segments.length-1];
};
Path.prototype.first=function(){
	return this.segments[0];
};
Path.prototype.toString=function(){
	return this.segments.join(options.delimiter);
};
Path.fit=function(val){
	return (val.indexOf(options.delimiter)>-1) ? true : false;
};

/********************************
*		Field Class
*********************************/
var Field=function(opath,obj,model){
	this.opath=opath;
	this.obj=obj;
	this.model=model;
	this.nodes=[];
	return this;
};
Field.prototype.val=function(){
	return this.obj[this.opath.last()];
};
Field.prototype.add=function(node){
	this.nodes[this.nodes.length]=node;
	return this;
};
Field.prototype.enter=function(val){
	this.obj[this.opath.last()]=val;
};
Field.prototype.update=function(val,except){
	var i=0,len=this.nodes.length,
	nodes=this.nodes,node;
	for(;i<len;i++){
		node=nodes[i];
			if(node!=except){
				if(node.tagName==='INPUT'){
					node.value=val;
				}
				else{
					node.innerText=val;
				}
			}
	}
	this.enter(val);
};
Field.prototype.change=function(event){
	var node=event.target, 
	val=(node.tagName==='INPUT')?node.value:(node.textContent || node.innerText);
	this.update(val,node);
};

/********************************
*		Model Class
*********************************/
var Model=function(data){
	this.data=data;
	this.fields=[];
	return this;
},
model=Category.ajax['model']=function(data){
	return new Model(data);
};
Model.prototype.field=function(path){
	return this.getField(path) || this.createField(path);
};
Model.prototype.getField=function(path){
	var fields=this.fields, i=0, len=fields.length;
	for(;i<len;i++){
		if(fields[i].opath.is(path)){
			return fields[i];
		}
	}
	return false;
};
Model.prototype.createField=function(path){
	var opath=new Path(path),
	c=opath.context(this.data),
	field,fields=this.fields;
	field=new Field(opath,c,this);
	fields.push(field);
	return field;
};
Model.prototype.get=function(key){
	var path=key.split(library.options.delimiter),
		i=0,len=path.length,
		obj=this.data;
	for(;i<len;i++){
		key=path[i];
		if(key in obj){
			obj=obj[key];
		}
		else{
			throw new Error('Incorrect key!');
		}
	}
	return obj;
};
Model.prototype.update=function(path,val){
	var opath=new Path(path),
	field=this.getField(path);
	if(field){
		field.update(val);
	}
	else{
		opath.val(this.data, val);
	}
	
};

var viewport=Category.other['viewport']=function(){
	var e = window
	, a = 'inner';
		if ( !( 'innerWidth' in window ) ){
			a = 'client';
			e = document.documentElement || document.body;
		}
	return { width : e[ a+'Width' ] , height : e[ a+'Height' ] }
}

var library=function(selector,obj){
	var key, c, name, sub,
	o=obj || window,
	characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",
	r_id=new RegExp( "^>(" + characterEncoding + ")" ),
	exec, id, path;

	if(selector in Category){
		c=Category[selector];
		Object.keys(c).forEach(function (key) {
    		o[key]=c[key];
		});
	}
	else if('*'===selector){
		Object.keys(Category).forEach(function(key){
			c=Category[key];
			Object.keys(c).forEach(function(sub){
				o[sub]=c[sub];
			});
		});
	}
	else if(Path.fit(selector)){
		path=new Path(selector);
		return path.val(Category);
	}
	else if(exec=r_id.exec(selector)){
		id=exec[1];
		for(key in Category){
			if(Category.hasOwnProperty(key)){
				c=Category[key];
				if(id in c){
					return (c[id]);
				}
			}
		}
	}
	return this;
};
library.options=function(custom){
	options=extend({},options,custom);
};


/********************************
*		Global variables 
*********************************/
var script=document.getElementById('lib'),
	src,scripts,name;
	if(script && 'SCRIPT'===script.tagName){
		src=script.src;
	}
	else{
		scripts=document.getElementsByTagName( 'script' );
		src=scripts[scripts.length - 1].src;
	}
name=src.substring(src.lastIndexOf('/')+1, src.lastIndexOf('.'));
window[name]=library;
//window.ready=ready;
//window.model=model;
//window.tag=Tag;
//window.req=Request;
//window.lib=library;

})()