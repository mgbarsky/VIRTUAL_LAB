//====== View model for Problems: list, selected, edit, new, delete
// problems page has 5 states: list and 4 steps of wizard
PAGE_STATE = Object.freeze({LIST: 0, L1: 1, L2: 2}); 

function LevelModel() {
	var self = this;
	
	self.list_uri = "/api/levels";
	self.level_uri = "/api/level";
	
	self.itemList = ko.observableArray();
	self.selectedItem = ko.observable(null);
	self.selectedProblem = ko.observable(null);
	self.problem = null;

	self.currProblem = null;
	self.addedCurrProblem = null;

	// ("testing");

	// Problem list in New Level 2
	self.levelProblemsObservables = ko.observableArray([]);
    self.activeProblemObj = ko.observable();
    self.problemListClick = function (problem) {
		// (problem);
		self.activeProblemObj(problem);
		self.currProblem = problem;
		self.addedCurrProblem = null;
		self.currProblem[problem_id]= self.currProblem.id;
		self.currProblem[bundle_id]= self.level.id();
		// (self.currProblem);
	};

	self.addProblemListClick = function(problem) {
		// ("inside add problem list click");
		// (problem);
		self.activeProblemObj(problem);
		self.addedCurrProblem = problem;
		self.currProblem = null;
		Object.assign(self.addedCurrProblem,{bundle_id: self.level.id()});

		console.log(self.addedCurrProblem);
		// (self.addedCurrProblem);
	};

	self.addSelectedProblem = () => {
		// ("testing");
		self.level.addProblem(self.currProblem);
	};
	self.removeSelectedProblem = () => {
		// ("Inside remove selected problem");
		// (self.addedCurrProblem);
		self.level.removeProblem(self.addedCurrProblem);
	};
	//right side added problem in level 2
	self.selectedActiveProblemObj = ko.observable();


	// POST image to server
    self.uploadImage = function(image) {
		self.level.image(image.name);
	}

	
	
	//navigation through states
	self.state = ko.observable(PAGE_STATE.LIST);
	
	self.nextState = function(){ 
		//////// (self.state());
		//// (self.state());
		self.state(self.state()+1);};
	self.prevState = function(){ self.state(self.state()-1);};	
	
	
	//init is called each time we need to refresh list view
	self.init = function(){
		self.itemList ([]);
		app.ajax(self.list_uri+"/id,title,image", 'GET').done(function(data){
			//// (data);
			if (data){
				//// ("RETURNED FROM SERVER");
				//// (data["levels"]);
				if (data["levels"] && data["levels"].length > 0){	
					ko.utils.arrayForEach(data["levels"], function(item) {
						var list_item = new LevelItem(item);
					
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
					//// (data["error"]);
				}
			}
			else{
				//// ("Ajax error");
			}
			//// (self.itemList());
			self.state(PAGE_STATE.LIST);
		});	
	};
	
	self.newLevel = function(){
		self.level = new Level();
		self.level.problemsUnused([]);
		app.ajax("api/problems/id,title", 'GET').done(function(data){
			if(data && data.problems){
				for(let i = 0; i < data.problems.length; i++){
					self.level.problemsUnused.push(data.problems[i]);
				}
				//// ("UNUSED");
				//// (self.level.problemsUnused());

			}else{
				//// (data.error);
			}
		});
		//// (self.level);		
		self.state (PAGE_STATE.L1);
		//// ("self.state="+self.state());
		self.selectedItem(null);	
	};
	
	self.editLevel = function() {		
		//// (self.selectedItem())
		////// (self.problem_uri+self.selectedItem.id);
		if (self.selectedItem() == null)
			return;
		
		////// (self.selectedItem());
		
		app.ajax(self.level_uri + "/" + self.selectedItem().id, 'GET').done(function(data){
			////// (data);
			if(data && data.level){
				self.level = new Level(data.level);
				//// (self.level.problemsUsed());

				self.state(PAGE_STATE.L1);
				self.selectedItem(null);
			}else{
				 console.log(data.error);
			}
		});

		app.ajax("api/problems/id,title", 'GET').done(function(data){
			self.level.problemsUnused([]);
			if(data && data.problems){
				for(let i = 0; i < data.problems.length; i++){
					//// (data.problems[i]);
					let inArr = false;
					
					for(let j = 0; j < self.level.problemsUsed().length; j++){
						// ("problems used obj inside loop");
						// (self.level.problemsUsed()[j]);
						if(self.level.problemsUsed()[j].problem_id == data.problems[i].id){
							self.level.problemsUsed()[j].id = self.level.problemsUsed()[j].problem_id;
							self.level.problemsUsed()[j].title = data.problems[i].title;
							inArr = true;
						}
					}
					if(!inArr){
						// (`NOT USED IN PROBLEM:  ${data.problems[i].title}`);
						
					}
					else{// (`USED IN PROBLEM:  ${data.problems[i].title}`);
						// (self.level.problemsUsed());
					}
					self.level.problemsUnused.push(data.problems[i]);
				}
				//// ("UNUSED");
				// (self.level.problemsUsed());
			}else{
				//// (data.error);
			}
		});
	};
	
	self.deleteLevel = function(){
		////// (self.problem_uri+self.selectedItem.id);
		if (self.selectedItem() == null)
			return;
		
		//self.itemList.pop();
		////// (self.selectedItem());
		
		app.ajax(self.level_uri + "/" + self.selectedItem().id, 'DELETE').done(function(data){
			if(data){
				self.init();
				self.state(PAGE_STATE.LIST);				
			}else{
				//// (data.error);
			}
		});
	};
	
	self.saveLevel = function(){
		var level;
		var method = 'PUT';
		if (self.level != null) {	
			if (self.level.id() == -1)//new problem
				method = 'POST';
			level = ko.toJS(self.level);
			//// ("LEVEL:")
			//// (level);		
			acall = app.ajax(self.level_uri, method, level);
			acall.done(function (response) {
				//// (response["result"]); //TBD - make a message
				self.init();
			});
		}
		self.state (PAGE_STATE.LIST);
		self.selectedItem(null);
		self.problem = null;
	};	
	
	self.cancel = function(){
		self.state (PAGE_STATE.LIST);
		self.problem = null;
		self.selectedItem(null);
	};	
};

function LevelItem(data_item){  //list item
	var self = this;
	
	self.id = data_item.id;
	self.title = data_item.title;
	self.image = data_item.image;
	self.isSelected = ko.observable(false);
};

function Level(data){  //full problem object
	var self = this;
	
	self.id = ko.observable(data?data.id:-1);
    self.title = ko.observable(data?data.title:"");
	self.image = ko.observable(data?data.image:"No file chosen");
    self.background = ko.observable(data?data.background:"");
	self.score = ko.observable(data?data.score:0);
	self.problemsUnused = ko.observableArray([]);
	self.problemsUsed = ko.observableArray(data?data.problems:[]);


	//left side problem in level 2
	self.addProblem = (obj) => {
		if(obj == null){return;}
		//self.problemsUsed.push(obj);
		// (self.problemsUnused());
		var isAlreadyAdded = false;
		for (var i=0; i < self.problemsUsed().length; i++) {
			if (self.problemsUsed()[i].id === obj.id) {
				isAlreadyAdded = true;
			}
		}
		if (isAlreadyAdded) {
			return;
		}
		else {
			self.problemsUsed.push(obj);
		}
		
	}

	self.removeProblem = (obj) => {
		if(obj == null){return;}
		// (obj);
		// ("inside remove problem");
		
		self.problemsUsed.remove(function(problem) {
			// (problem);
			return problem.problem_id === obj.problem_id;
		});
	}
	 
}


var viewModel = new LevelModel();
viewModel.init();
ko.applyBindings(viewModel);
