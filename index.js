lib('>ready').tag(function(tag){
	setTimeout(function(){
		new Calculator(tag().div({'class':'main'}).$
				.div({'class':'wrapper'}).$);	
	},3000)
	
})