// Dashboard page components

var Board = Board || function() {
  // ViewModel for entity data
  var dataViewModel = new app.models.Entities();
  /*dataViewModel.get(db.entities); */  
 
  //getting db from local storage if key already exists in local storage
  var db = checkLocalStorageKeyExists();
  if (db !== null) {
    dataViewModel.get(db.entities);
  }
    
  return {
    dataViewModel: dataViewModel
  }
}();

// Entity list
ko.components.register("entity-list", {
  viewModel: {
    createViewModel: function(params, componentInfo) {
      return Board.dataViewModel;
    }
  },
  template: Templates.board.list}
);

// Headers
ko.components.register("navbar-board", {template: Templates.navbar(Templates.board.boardHead)});

ko.applyBindings();