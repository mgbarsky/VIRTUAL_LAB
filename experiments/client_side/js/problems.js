// Navigate problems page and setup components
PAGE_STATE = Object.freeze({LIST: 0, NP1: 1, NP2: 2, NP3: 3, NP4: 4, 
                            EP1: 5, EP2: 6, EP3: 7, EP4: 8});  // NP = new problem ; EP = edit problem

var problems = function() {
  // Navigation viewModel
  var viewModel = new ViewModel();

  // Data viewModel
  var dataViewModel = new app.models.Problems();

  db = checkLocalStorageKeyExists();
  if (db !== null) {
    dataViewModel.get(db.problems);
  }
  
  // Use this function when registering components
  function getViewModel(params, componentInfo) {
    return viewModel;
  }

  // ViewModel for problem page navigation
  function ViewModel() {
    var self = this;
    self.NUM_PAGES = 5;
    self.entityID = 'problems';
    self.entity = app.getEntity(self.entityID);

    self.problem = {
      id: -1,  // Will be generated on back-end
      title: ko.observable(),
      type: ko.observable(),
    	comments: ko.observable(),
      weight: ko.observable(),
      tags: ko.observableArray(),  // These don't make sense yet with the input form
    	instructions: ko.observable(),
    	starter_code: "",
    	solution: "",
      test_cases: ko.observableArray(), // Same
    };

    self.editListItem = function() {
      console.log(dataViewModel.activeProblem()); 
      if (dataViewModel.activeProblem() !== undefined) { //if id exists
        self.initProblem(dataViewModel.activeProblem());
        self.pageState(PAGE_STATE.EP1);
      } 
    }

    self.initProblem = function(problemID) {
      var editProblem = app.getProblem(problemID);

      for(var key in self.problem) {
        if(self.problem.hasOwnProperty(key))
          if(typeof self.problem[key] === "function") {
            var empty = typeof self.problem[key]() === "object" ? [] : '';
            self.problem[key](editProblem ? editProblem[key] : empty);
          }
          else self.problem[key] = editProblem[key];
      }
    }

    self.getCurrentId = function(){
      db = checkLocalStorageKeyExists();
      for(let i = 0; i < db.problems.length; i++){
        if(dataViewModel.activeProblem() === db.problems[i].id){
          return i;
        }
      }
    }

    self.deleteListItem = function() {
      console.log(dataViewModel.activeProblem());
      if (dataViewModel.activeProblem() !== undefined) {
        if (confirm("Do you really want to delete?") === true) {
          db = checkLocalStorageKeyExists();
          console.log(db.problems);
          var idMatchedValueIndex;
          for (var i = 0; i < db.problems.length; i++) {
            if (dataViewModel.activeProblem() === db.problems[i].id) { /*if click id equals to id in the array */
              idMatchedValueIndex = i;
              console.log("id matched: "+db.problems[i].id);
            } 
          }
          if (idMatchedValueIndex > -1) {
            db.problems.splice(idMatchedValueIndex, 1);
            console.log(db.problems);
  
            updateDataInLocalStorage(db); //post to db
  
            db = checkLocalStorageKeyExists();
            if (db !== null) {
              dataViewModel.get(db.problems); // GET from db  
            }
          }
        }
      }
    }

    // Reset (only text for now) input fields
    self.resetInput = function() {
      for(var key in self.problem) {
        if(self.problem.hasOwnProperty(key))
          // If property is an observable
          if(typeof self.problem[key] == "function") {
            var empty = typeof self.problem[key]() == "object" ? [] : '';
            self.problem[key](empty);
          }
          else if(key === "id") self.problem[key] = -1;
      }
    };

    // Callback to use when the user clicks next and potentially pushes a new problem
    self.updateData = function() {
      // Update textbox
      if(self.pageState() === PAGE_STATE.EP1){
        var inputData = ko.toJS(self.problem);
        var problemData = new app.models.Problem(inputData);
        console.log(problemData.starter_code);
        seditor.getDoc().setValue(problemData.starter_code);
      }
      if(self.pageState() === PAGE_STATE.EP2){
        var inputData = ko.toJS(self.problem);
        var problemData = new app.models.Problem(inputData);
        editor.getDoc().setValue(problemData.solution);
        document.getElementById("output").innerHTML = "";
      }
      // At the last page, save problem data
      if(self.pageState() === PAGE_STATE.NP4) {
        var inputData = ko.toJS(self.problem);
        var problemData = new app.models.Problem(inputData);
        
        let problemInput = editor.getValue();
        problemData.solution = problemInput;
        let starterData = seditor.getValue();
        problemData.starter_code = starterData;

        /*db.problems.push(problemData);  // POST to db
        dataViewModel.get(db.problems);  // GET from db  */

        db = checkLocalStorageKeyExists();
        db.problems.push(problemData); // POST to db
        updateDataInLocalStorage(db);

        db = checkLocalStorageKeyExists();
        if (db !== null) {
          dataViewModel.get(db.problems); // GET from db  */
        }

        self.resetInput();
      }
      else if (self.pageState() === PAGE_STATE.EP4) {
        var inputData = ko.toJS(self.problem);
        var problemData = new app.models.Problem(inputData);

        db = checkLocalStorageKeyExists();
        var idMatchedValueIndex;
        for (var i=0; i < db.problems.length; i++) {
          if (dataViewModel.activeProblem() === db.problems[i].id) { /*if click id equals to id in the array */
            idMatchedValueIndex = i;
            console.log("id matched: "+db.problems[i].id);
          } 
        }
        if (idMatchedValueIndex > -1) {
          db.problems.splice(idMatchedValueIndex, 1,problemData);
          console.log(db.problems);

          updateDataInLocalStorage(db);
          db = checkLocalStorageKeyExists();
          if (db !== null) {
            dataViewModel.get(db.problems); // GET from db  
          }
          dataViewModel.activeProblem(undefined);
          /*console.log(db.problems);
  
          updateDataInLocalStorage(db); //post to db
  
          var db = checkLocalStorageKeyExists();
          if (db !== null) {
            dataViewModel.get(db.problems); // GET from db  
          }*/
        }
      }
    }

    // tags
    self.tagOptions = ko.observableArray([]);
    self.selectedTagValue =  ko.observable();
    self.selectedTags = ko.observableArray([]);
    self.newTagText = ko.observable();
    self.addTagToOptions = function () {
        self.tagObj = {};

        if (self.tagOptions().length === 0) {
            self.tagObj.id = 1;
        }
        else {
            self.tagObj.id = self.tagOptions()[self.tagOptions().length - 1].id + 1;
        }
        self.tagObj.title = self.newTagText();
        
        self.tagOptions.push(self.tagObj);

        self.newTagText("");
    };
    self.onChangeOptions = function () {
        if (self.selectedTagValue() !== undefined) {
            /*var matchValue = self.selectedTags.indexOf(self.selectedTagValue());
            if (matchValue === -1) {
                self.selectedTags.push(self.selectedTagValue());
            }*/
            self.selectedTags.push(self.selectedTagValue());
        }  
    };
    self.removeTag = function(tagToBeRemoved) {
        /*self.selectedTags.remove(function(tag) {
            return tagToBeRemoved === tag;
        });
        */
       self.selectedTags.remove(function(tag) {
           return tagToBeRemoved.id === tag.id;
       });
       
    };


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
app.models.ProblemsNav = problems.viewModel;

// Problem list - currently the only component which relies on the data viewModel
ko.components.register("problem-list", {
  viewModel: {
    createViewModel: function(params, componentInfo) {
      return problems.dataViewModel;
    }
  },
  template: Templates.problems.list}
);

// Shorthand object for navigation component registration
var vm = {createViewModel: problems.getViewModel};

// Headers
ko.components.register("navbar-list", {template: Templates.navbar(Templates.problems.listHead)});
ko.components.register("navbar-new", {viewModel: vm, template: Templates.navbar(Templates.problems.newHead)});
ko.components.register("options-menu", {viewModel: vm, template: Templates.menu});

// New problem entry components
ko.components.register("np-1", {viewModel: vm, template: Templates.problems.np1});
ko.components.register("np-2", {viewModel: vm, template: Templates.problems.np2});
ko.components.register("np-3", {viewModel: vm, template: Templates.problems.np3});
ko.components.register("np-4", {viewModel: vm, template: Templates.problems.np4});

ko.components.register("np-tags",{viewModel: vm, template: Templates.tag});

ko.applyBindings(problems.viewModel);