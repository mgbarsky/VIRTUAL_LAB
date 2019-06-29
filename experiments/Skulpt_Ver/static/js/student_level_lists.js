function StudentLevelListsModel () {
    var self = this;

    self.problem_uri = "/api/problem";

    self.screen_name = ko.observable(); //student name
    self.game_name = ko.observable();   // name of the game
    self.level_title = ko.observable(); // name of the level

    self.problems_list = ko.observableArray();

    self.init = function () {
        self.screen_name(localStorage.getItem("screen_name"));
        self.game_name(localStorage.getItem("game_name"));
        
        var level_obj = JSON.parse(localStorage.getItem("level_obj"));

        self.level_title(level_obj.title);

        for (var i=0; i < level_obj.problems.length; i++) {
            var problem_id = level_obj.problems[i].problem_id;
            self.loadProblemData(problem_id);
        }

        console.log(JSON.parse(localStorage.getItem("level_obj")));
    };

    self.loadProblemData = function (problem_id) {
        app.ajax(self.problem_uri + "/" + problem_id, 'GET').done(function(data){
            if(data && data.problem){
                console.log("inside loadProblemData");
                console.log(data.problem);
                self.problems_list.push(data.problem);
            }
            else {
                console.log(data.error);
            }
        });
    };

    self.go_to_problem = function (problem_obj) {
        console.log("inside go to problem");
        console.log(problem_obj);

        //just for testing
        localStorage.setItem("problem_obj",JSON.stringify(problem_obj));

        window.location.href = "student_problem.html";
    }
}

var viewModel = new StudentLevelListsModel();
viewModel.init();
ko.applyBindings(viewModel);