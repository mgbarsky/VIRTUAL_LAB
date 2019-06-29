function StudentProblemModel () {
    var self = this;

    self.screen_name = ko.observable(); //student name
    self.level_title = ko.observable(); // name of the level

    self.problem = null;

    self.init = function () {
        self.screen_name(localStorage.getItem("screen_name"));

        var level_obj = JSON.parse(localStorage.getItem("level_obj"));
        self.level_title(level_obj.title);

        var problem_obj = JSON.parse(localStorage.getItem("problem_obj"));

        self.problem = new StudentProblem(problem_obj);

        console.log(problem_obj);
    };

    self.save_student_problem = function () {
        console.log("inside save student problem");
        console.log(self.problem.starter_code());
    }
}

function StudentProblem(data){  //full problem object
	var self = this;
	
	self.id = ko.observable(data?data.id:-1);
    self.title = ko.observable(data?data.title:"");
    self.weight = ko.observable(data?data.weight:1);
    self.instructions = ko.observable(data?data.instructions:"");
    self.starter_code = ko.observable(data?data.starter_code:"");
	
}

var viewModel = new StudentProblemModel();
viewModel.init();
ko.applyBindings(viewModel);

