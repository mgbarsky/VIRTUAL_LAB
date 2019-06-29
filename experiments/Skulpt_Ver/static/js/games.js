//====== View model for Problems: list, selected, edit, new, delete
// problems page has 5 states: list and 4 steps of wizard
PAGE_STATE = Object.freeze({LIST: 0, L1: 1, L2: 2}); 

function LevelModel() {
	var self = this;
	
	self.list_uri = "/api/games";
	self.game_uri = "/api/game";
	
	self.itemList = ko.observableArray();
	self.selectedItem = ko.observable(null);
	self.selectedLevel = ko.observable(null);
	self.game = null;

	self.currLevel = null;
	self.addedCurrLevel = null;

	self.gameProblemsObservables = ko.observableArray([]);
	self.activeLevelObj = ko.observable();
	
    self.gameListClick = function (problem) {
		// (problem);
		self.activeLevelObj(problem);
		self.currLevel = problem;
		self.addedCurrLevel = null;
		self.currLevel[level_id]= self.currLevel.id;
		self.currLevel[game_id]= self.game.id();
		console.log(self.currLevel);
		// (self.currLevel);
	};

	self.addLevelListClick = function(problem) {
		// ("inside add problem list click");
		// (problem);
		self.activeLevelObj(problem);
		self.addedCurrLevel = problem;
		self.currLevel = null;
		Object.assign(self.addedCurrLevel,{bundle_id: self.game.id()});
		console.log(self.addedCurrLevel);
		// (self.addedCurrLevel);
	};

	self.addSelectedLevel = () => {
		// ("testing");
		console.log(self.currLevel);
		self.game.addLevel(self.currLevel);
	};
	self.removeSelectedLevel = () => {
		// ("Inside remove selected problem");
		// (self.addedCurrLevel);
		self.game.removeLevel(self.addedCurrLevel);
	};
	//right side added problem in level 2
	self.selectedActiveProblemObj = ko.observable();

	
	
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
		app.ajax(self.list_uri+"/id,title", 'GET').done(function(data){
			if (data){
				if (data["games"] && data["games"].length > 0){	
					ko.utils.arrayForEach(data["games"], function(item) {
						var list_item = new GameItem(item);
					
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
		//console.log(self.itemList());
	};
	
	self.newLevel = function(){
		self.game = new Game();
		self.game.gamesUnused([]);
		app.ajax("api/levels/id,title", 'GET').done(function(data){
			//console.log(data);
			if(data && data.levels){
				for(let i = 0; i < data.levels.length; i++){
					self.game.gamesUnused.push(data.levels[i]);
				}
				//// ("UNUSED");
				//// (self.game.problemsUnused());

			}else{
				//// (data.error);
			}
		});
		//// (self.game);		
		self.state (PAGE_STATE.L1);
		//// ("self.state="+self.state());
		self.selectedItem(null);	
	};
	
	self.editLevel = function() {		
		//// (self.selectedItem())
		////// (self.game_uri+self.selectedItem.id);
		if (self.selectedItem() == null)
			return;
		
		////// (self.selectedItem());
		
		app.ajax(self.game_uri + "/" + self.selectedItem().id, 'GET').done(function(data){
			console.log("Data");
			console.log(data);
			if(data && data.game){
				self.game = new Game(data.game);
				//// (self.game.problemsUsed());

				self.state(PAGE_STATE.L1);
				self.selectedItem(null);
			}else{
				 (data.error);
			}
		});

		app.ajax("api/levels/id,title", 'GET').done(function(data){
			//console.log(data);
			self.game.gamesUnused([]);
			if(data && data.levels){
				for(let i = 0; i < data.levels.length; i++){
					let inArr = false;
					
					for(let j = 0; j < self.game.gamesUsed().length; j++){
						// ("problems used obj inside loop");
						// (self.game.problemsUsed()[j]);
						if(self.game.gamesUsed()[j].problem_id == data.levels[i].id){
							self.game.gamesUsed()[j].id = self.game.gamesUsed()[j].problem_id;
							self.game.gamesUsed()[j].title = data.levels[i].title;
							inArr = true;
						}
					}
					if(!inArr){
						// (`NOT USED IN PROBLEM:  ${data.problems[i].title}`);
						
					}
					else{// (`USED IN PROBLEM:  ${data.problems[i].title}`);
						// (self.game.problemsUsed());
					}
					self.game.gamesUnused.push(data.levels[i]);
				}
				//// ("UNUSED");
				// (self.game.problemsUsed());
			}else{
				//// (data.error);
			}
		});
	};
	
	self.deleteLevel = function(){
		////// (self.game_uri+self.selectedItem.id);
		if (self.selectedItem() == null)
			return;
		
		//self.itemList.pop();
		////// (self.selectedItem());
		
		app.ajax(self.game_uri + "/" + self.selectedItem().id, 'DELETE').done(function(data){
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
		if (self.game != null) {	
			if (self.game.id() == -1)//new problem
				method = 'POST';
			level = ko.toJS(self.game);
			console.log(level);
			//// ("LEVEL:")
			//// (level);		
			acall = app.ajax(self.game_uri, method, level);
			acall.done(function (response) {
				//// (response["result"]); //TBD - make a message
				self.init();
			});
		}
		self.state (PAGE_STATE.LIST);
		self.selectedItem(null);
		self.game = null;
	};	
	
	self.cancel = function(){
		self.state (PAGE_STATE.LIST);
		self.game = null;
		self.selectedItem(null);
	};	
};

function GameItem(data_item){  //list item
	var self = this;
	
	self.id = data_item.id;
	self.title = data_item.title;
	self.isSelected = ko.observable(false);
};

function Game(data){  //full problem object
	var self = this;
	
	self.id = ko.observable(data?data.id:-1);
    self.title = ko.observable(data?data.title:"");
	self.language = ko.observable(data?data.language:"");
	self.gamesUnused = ko.observableArray([]);
	self.gamesUsed = ko.observableArray(data?data.problems:[]);


	//left side problem in level 2
	self.addLevel = (obj) => {
		if(obj == null){return;}
		//self.gamesUsed.push(obj);
		// (self.gamesUnused());
		var isAlreadyAdded = false;
		for (var i=0; i < self.gamesUsed().length; i++) {
			if (self.gamesUsed()[i].id === obj.id) {
				isAlreadyAdded = true;
			}
		}
		if (isAlreadyAdded) {
			return;
		}
		else {
			self.gamesUsed.push(obj);
		}
		
	}

	self.removeLevel = (obj) => {
		if(obj == null){return;}
		// (obj);
		// ("inside remove problem");
		
		self.gamesUsed.remove(function(level) {
			// (problem);
			return level.problem_id === obj.problem_id;
		});
	}
	 
}


var viewModel = new LevelModel();
viewModel.init();
ko.applyBindings(viewModel);
