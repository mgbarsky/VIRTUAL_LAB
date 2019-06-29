//====== View model for Problems: list, selected, edit, new, delete
// problems page has 5 states: list and 4 steps of wizard
PAGE_STATE = Object.freeze({LIST: 0, P1: 1, P2: 2, P3: 3, P4: 4}); 

function ProblemModel() {
	var self = this;
	
	self.list_uri = "/api/problems";
	self.problem_uri = "/api/problem";
	
	self.itemList = ko.observableArray();
	self.selectedItem = ko.observable(null);
	self.problem = null;
	
	//navigation through states
	self.state = ko.observable(PAGE_STATE.LIST);
	
	self.nextState = function(){ self.state(self.state()+1);};
	self.prevState = function(){ self.state(self.state()-1);};	
	
	
	
	
	//init is called each time we need to refresh list view
	self.init = function(){
		self.itemList ([]);
		app.ajax(self.list_uri+"/id,title", 'GET').done(function(data){
			console.log(data);
			if (data){
				console.log("RETURNED FROM SERVER");
				console.log(data["problems"]);
				if (data["problems"] && data["problems"].length > 0){	
					ko.utils.arrayForEach(data["problems"], function(item) {
						var list_item = new ProblemItem(item);
					
						list_item.selectMe = function(){
							self.selectedItem(null);							
							this.isSelected(!this.isSelected());
							self.selectedItem (this.isSelected()?this:null);
							for(var i=0; i<self.itemList().length; i++){
								if (self.itemList()[i].id != self.selectedItem().id){
									self.itemList()[i].isSelected(false);
								}
							}
						};
						self.itemList.push(list_item);
					});
				
					
				}
				else{
					console.log(data["error"]);
				}
			}
			else{
				console.log("Ajax error");
			}
			console.log(self.itemList());
			self.state(PAGE_STATE.LIST);
		});	
	};
	
	self.newProblem = function(){
		self.problem = new Problem();
		console.log(self.problem);		
		self.state (PAGE_STATE.P1);
		console.log("self.state="+self.state());
		self.selectedItem(null);	
	};
	
	self.editProblem = function() {		
		//console.log(self.problem_uri+self.selectedItem.id);
		if (self.selectedItem() == null)
			return;
		
		//console.log(self.selectedItem());
		
		app.ajax(self.problem_uri + "/" + self.selectedItem().id, 'GET').done(function(data){
			//console.log(data);
			if(data && data.problem){
				self.problem = new Problem(data.problem);
				console.log(self.problem);
				self.state(PAGE_STATE.P1);
				self.selectedItem(null);
			}else{
				console.log(data.error);
			}
		});
		
		//self.state (PAGE_STATE.P1);
	};
	
	self.deleteProblem = function(){
		//console.log(self.problem_uri+self.selectedItem.id);
		if (self.selectedItem() == null)
			return;
		
		//self.itemList.pop();
		//console.log(self.selectedItem());
		
		app.ajax(self.problem_uri + "/" + self.selectedItem().id, 'DELETE').done(function(data){
			if(data){
				self.init();
				self.state(PAGE_STATE.LIST);				
			}else{
				console.log(data.error);
			}
		});
	};
	
	self.saveProblem = function(){
		var problem;
		var method = 'PUT';
		if (self.problem != null) {	
			if (self.problem.id() == -1)//new problem
				method = 'POST';
			problem = ko.toJS(self.problem);
			console.log(problem);		
			acall = app.ajax(self.problem_uri, method, problem);
			acall.done(function (response) {
				console.log(response["result"]); //TBD - make a message
				self.init();
			});
		}
		self.state (PAGE_STATE.P1);
		self.selectedItem(null);
		self.problem = null;
	};	
	
	self.cancel = function(){
		self.state (PAGE_STATE.LIST);
		self.problem = null;
		self.selectedItem(null);
	};	
};

function ProblemItem(data_item){  //list item
	var self = this;
	
	self.id = data_item.id;
	self.title = data_item.title;
	self.isSelected = ko.observable(false);
};

function Problem(data){  //full problem object
	var self = this;
	
	self.id = ko.observable(data?data.id:-1);
    self.title = ko.observable(data?data.title:"");
    self.type = ko.observable(data?data.type:"code");
    self.comments = ko.observable(data?data.comments:"");
    self.weight = ko.observable(data?data.weight:1);
    self.tags = ko.observableArray(data?data.tags:[]);
    self.instructions = ko.observable(data?data.instructions:"");
    self.starter_code = ko.observable(data?data.starter_code:"");
    self.solution = ko.observable(data?data.solution:"");
    self.tests = ko.observableArray(data?data.tests:[]);
	
	self.new_tags = ko.observableArray();
	
}


var viewModel = new ProblemModel();
viewModel.init();
ko.applyBindings(viewModel);
