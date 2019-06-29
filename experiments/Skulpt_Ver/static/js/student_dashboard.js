PAGE_STATE = Object.freeze({BOARD: 0, PROBLEM_LIST: 1});

var studentDashboard = function() {
  INTERVAL = 119  // Number of pixels to scroll by
  // Data viewModels
  var levelViewModel = new app.models.Levels();
  levelViewModel.get(db.levels);
  var problemViewModel = new app.models.Problems();

  // Navigation viewModel
  var viewModel = new ViewModel();
  var levelsBoard = document.getElementById("levels-board");

  // Left and right buttons to scroll the board
  function scrollBoard(direction) {
    var mult = (direction === DIRECTION.NEXT) ? 1 : -1;
    levelsBoard.scrollBy(mult*INTERVAL, 0);  // scroll (x, y)
  }

  // ViewModel for level page navigation
  function ViewModel() {
    var self = this;
    self.pageState = ko.observable(PAGE_STATE.BOARD);
    self.nextPage = () => self.pageState(self.pageState() + 1);
    self.previousPage = () => {
      self.pageState(self.pageState() - 1);
      levelViewModel.activeLevel('');
    };

    self.levelName = ko.observable('');  // Store name of selected level

    // When the user clicks one of the levels, activeLevel() is an ID
    levelViewModel.activeLevel.subscribe(function(newValue) {
      var level = app.getLevel(newValue);  // Get level object
      self.levelName(level.title);  // Update levelName
      var validProblems = app.filterProblems(level);
      problemViewModel.get(validProblems);  // Filter and get valid problems
      self.nextPage();
    });
  }

  return {
    viewModel: viewModel,
    levelViewModel: levelViewModel,
    problemViewModel: problemViewModel,
    levelsBoard: levelsBoard,
    scrollBoard: scrollBoard
  }
}();

// Levels board
ko.components.register("levels-board", {
  viewModel: {
    createViewModel: function(params, componentInfo) {
      return studentDashboard.levelViewModel;
    }
  },
  template: studentTemplates.levelsBoard}
);

// Problems list
ko.components.register("problem-list", {
  viewModel: {
    createViewModel: function(params, componentInfo) {
      return studentDashboard.problemViewModel;
    }
  },
  template: studentTemplates.problemList}
);

ko.applyBindings(studentDashboard.viewModel);