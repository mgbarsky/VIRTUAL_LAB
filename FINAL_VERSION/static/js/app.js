var app = app || {models:{}};

app.ajax = function(uri, method, data) {
	var request = {
		url: uri,
		type: method,
		contentType: "application/json",
		accepts: "application/json",
		cache: false,
		dataType: 'json',
		data: JSON.stringify(data),                
		error: function(jqXHR) {
			console.log("ajax error " + jqXHR.status);
		}
	};
	return $.ajax(request);
};



//========= View models for problems
app.models.Problems = function() {
	var self = this;
	self.problemsObservables = ko.observableArray();
	self.init = function(data){
		ko.utils.arrayForEach(data, function(item) {
			self.problemsObservables.push(new app.models.Problem(item));
		});	
	}
	
};

app.models.Problem = function(data_item){
	var self = this;
	//console.log(data_item);
	self.id = data_item.id;
	self.title = data_item.title;
	self.comments = data_item.comments;
	self.tags = data_item.tags;
	self.instructions = data_item.instructions;
	self.starter_code = data_item.starter_code;
	self.solution = data_item.solution;
	self.test_cases = data_item.test_cases;
};


