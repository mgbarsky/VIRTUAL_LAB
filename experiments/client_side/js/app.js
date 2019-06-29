var app = app || {models:{}};

app.getEntity = function(entityID) {
	for(var entity of db.entities) {
		if(entity.id === entityID) return entity;
	}
}

app.getProblem = function(problemID) {
	for(var problem of db.problems) {
		if(problem.id === problemID) return problem;
	}
	return false;
}

app.getLevel = function(levelID) {
	for(var level of db.levels) {
		if(level.id === levelID) return level;
	}
	return false;
}

// Filter the problem list based on a level object
app.filterProblems = function(level) {
	var accepted = level.problems;

	var levelProblems = [];
	for(var problem of db.problems) {
		if(accepted.includes(problem.id)) {
			levelProblems.push(problem);
		}
	}
	return levelProblems;
}

//====== View models for entities and entity items
app.models.Entities = function() {
	var self = this;
	self.entitiesObservables = ko.observableArray();
	self.get = function(data){
		self.entitiesObservables([]);
		ko.utils.arrayForEach(data, function(item) {
			self.entitiesObservables.push(new app.models.EntityItem(item));
		});
	}
};

app.models.EntityItem = function(data_item){
	var self = this;
	//console.log(data_item);
	self.id = data_item.id;
	self.title = data_item.title;
	self.color_code_style = data_item.color_code_style;
	self.icon_code = data_item.icon_code;
	self.url = data_item.url;
};

app.models.EntityItem.prototype.href = function(){
	window.location.href = this.url;
};

//========= View models for problems
app.models.Problems = function() {
	var self = this;
	self.problemsObservables = ko.observableArray();
	self.activeProblem = ko.observable(); // id of the problem selected
	self.get = function(data){
		self.problemsObservables([]);
		ko.utils.arrayForEach(data, function(item) {
			self.problemsObservables.push(new app.models.Problem(item));
		});
	}

};

app.models.Problem = function(data_item){
	var self = this;

	self.id = data_item.id;
	self.title = data_item.title;
	self.type = data_item.type;
	self.comments = data_item.comments;
	self.weight = data_item.weight;
	self.tags = data_item.tags;
	self.instructions = data_item.instructions;
	self.starter_code = data_item.starter_code;
	self.solution = data_item.solution;
	self.test_cases = data_item.test_cases;
};

//========= View models for levels
app.models.Levels = function() {
	var self = this;
	self.levelsObservables = ko.observableArray();
	self.activeLevel = ko.observable(); // id of the level selected
	self.get = function(data){
		self.levelsObservables([]);
		ko.utils.arrayForEach(data, function(item) {
			self.levelsObservables.push(new app.models.Level(item));
		});
	}
}

app.models.Level = function(data_item) {
	var self = this;

	self.id = data_item.id;
	self.title = data_item.title;
	self.img = data_item.img;
	self.color_code = data_item.color_code;
	self.weight = data_item.weight;
	self.problems = data_item.problems;
}

