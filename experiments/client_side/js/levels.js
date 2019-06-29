// Navigate levels page and setup components
PAGE_STATE = Object.freeze({LIST: 0, NL1: 1, NL2: 2, EP1: 3, EP2: 4});  // NL = new level; EP = edit problem

var Levels = Levels || function() {
  // Navigation viewModel
  var viewModel = new ViewModel();

  // Data viewModel
  var dataViewModel = new app.models.Levels();

  //data view model for problem
  var probDataViewModel = new app.models.Problems();

  db = checkLocalStorageKeyExists();
  if (db !== null) {
    dataViewModel.get(db.levels);
  }

  // Use this function when registering components
  function getViewModel(params, componentInfo) {
    return viewModel;
  }

  // ViewModel for level page navigation
  function ViewModel() {
    var self = this;
    self.NUM_PAGES = 3;
    self.entityID = 'levels';
    self.entity = app.getEntity(self.entityID);

    // Initialize new level object to have empty observables
    self.newLevel = {
      id: -1,  // Will be generated on back-end
      title: ko.observable(''),
      img: ko.observable('No file chosen'),
      color_code: ko.observable(''),
      weight: ko.observable(''),
      problems: ko.observableArray([1, 2])  // Temp
    };

    self.editListItem = function() {
      console.log(dataViewModel.activeLevel()); 
      if (dataViewModel.activeLevel() !== undefined) { //if id exists
        self.initLevel(dataViewModel.activeLevel());
        self.pageState(PAGE_STATE.EP1);
      } 
    }

    self.initLevel = function(levelID) {
      var editLevel = app.getLevel(levelID);

      for(var key in self.newLevel) {
        if(self.newLevel.hasOwnProperty(key))
          if(typeof self.newLevel[key] === "function") {
            var empty = typeof self.newLevel[key]() === "object" ? [] : '';
            self.newLevel[key](editLevel ? editLevel[key] : empty);
          }
          else self.newLevel[key] = editLevel[key];
      }
    }

    self.deleteListItem = function() {
      console.log(dataViewModel.activeLevel());
      if (dataViewModel.activeLevel() !== undefined) {
        if (confirm("Do you really want to delete?") === true) {
          db = checkLocalStorageKeyExists();
          console.log(db.levels);
          var idMatchedValueIndex;
          for (var i = 0; i < db.levels.length; i++) {
            if (dataViewModel.activeLevel() === db.levels[i].id) { /*if click id equals to id in the array */
              idMatchedValueIndex = i;
              console.log("id matched: "+db.levels[i].id);
            } 
          }
          if (idMatchedValueIndex > -1) {
            db.levels.splice(idMatchedValueIndex, 1);
            console.log(db.levels);
  
            updateDataInLocalStorage(db); //post to db
  
            db = checkLocalStorageKeyExists();
            if (db !== null) {
              dataViewModel.get(db.levels); // GET from db  
            }
          }
        }
      }
    }

    // POST image to server
    self.uploadImage = function(image) {
      self.newLevel.img(image.name);
    }

    // Callback to use when the user clicks next and potentially pushes a new problem
    self.updateData = function() {
      if(self.pageState() === PAGE_STATE.NL2) {
        var inputData = ko.toJS(self.newLevel);
        var levelData = new app.models.Level(inputData);

        /*db.levels.push(levelData);  // POST to db
        dataViewModel.get(db.levels);  // GET from db */
        db = checkLocalStorageKeyExists();
        db.levels.push(levelData);
        updateDataInLocalStorage(db);

        db = checkLocalStorageKeyExists();
        if (db !== null) {
          dataViewModel.get(db.levels);
        }
      }
    }


    //problems list in new_level_2

    //left side problem
    self.levelProblemsObservables = ko.observableArray([]);
    self.activeProblemObj = ko.observable();
    self.problemListClick = function (problem) {
        self.activeProblemObj(problem);
        console.log(self.activeProblemObj());
    };

    //right side added problem
    self.selectedProblem = ko.observableArray([]);
    self.selectedActiveProblemObj = ko.observable();

    self.selectedProblemListClick = function(problem) {
        self.selectedActiveProblemObj(problem);
    };

    //middle add/remove problem button
    self.addSelectedProblem = function() {
        if (self.activeProblemObj() !== undefined) {
            self.selectedProblem.push(self.activeProblemObj());
            self.activeProblemObj(undefined);
        }
    };

    self.removeSelectedProblem = function() {
        if (self.selectedActiveProblemObj() !== undefined) {
            self.selectedProblem.remove(function(prob) {
                return self.selectedActiveProblemObj().id === prob.id;
            });
            self.selectedActiveProblemObj(undefined);
        }
    };

    // put data into levelProblemsObservables Array;
    db = checkLocalStorageKeyExists();
    if (db !== null) {
      for (var i=0; i < db.problems.length; i++) {
        self.levelProblemsObservables.push(db.problems[i]);
      }
    }

    // Setup shared navigation
    Navigation.setup(self, PAGE_STATE);
  }

  return {
    viewModel: viewModel,
    dataViewModel: dataViewModel,
    getViewModel: getViewModel
  }
}();

// Make the navigation viewModel global
app.models.LevelsNav = Levels.viewModel;

// Level list
ko.components.register("level-list", {
  viewModel: {
    createViewModel: function(params, componentInfo) {
      return Levels.dataViewModel;
    }
  },
  template: Templates.levels.list}
);

// Shorthand object for navigation component registration
var vm = {createViewModel: Levels.getViewModel};

// Headers
ko.components.register("navbar-list", {template: Templates.navbar(Templates.levels.listHead)});
ko.components.register("navbar-new", {viewModel: vm, template: Templates.navbar(Templates.levels.newHead)});
ko.components.register("options-menu", {viewModel: vm, template: Templates.menu});

// New level entry components
ko.components.register("nl-1", {viewModel: vm, template: Templates.levels.nl1});
ko.components.register("nl-2", {viewModel: vm, template: Templates.levels.nl2});

ko.components.register("nl-problems",{viewModel: vm, template:Templates.newLevel2Problems});

ko.applyBindings(Levels.viewModel);