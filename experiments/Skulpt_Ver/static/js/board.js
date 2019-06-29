//====== View model for entities and entity items - these are static
function EntityModel() {
	var self = this;
	self.entitiesObservables = ko.observableArray();
	self.init = function(data){
		ko.utils.arrayForEach(data, function(item) {
			self.entitiesObservables.push(new EntityItem(item));
		});	
	}
	
};

function EntityItem(data_item){
	var self = this;
	
	self.id = data_item.id;
	self.title = data_item.title;
	self.color_code_style = data_item.color_code_style;
	self.icon_code = data_item.icon_code;
	self.url = data_item.url;
};


EntityItem.prototype.href = function(){	
	window.location.href = this.url;
};


var viewModel = new EntityModel();
viewModel.uri = "/api/entities";
app.ajax(viewModel.uri, 'GET').done(function(data){
	if (data){
		if(data["entities"] && data["entities"].length > 0){
			viewModel.init(data["entities"]);
			ko.applyBindings(viewModel);
		}
		else
			console.log(data["error"]);
		
	}
	else {
		console.log("No data retrieved from the server");
	}
});
