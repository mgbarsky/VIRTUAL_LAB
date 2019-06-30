PAGE_STATE = Object.freeze({DASHBOARD: 0, LEVEL: 1, PROBLEM: 2}); 

function StudentModel () {
    var self = this;

    self.student;
    self.level;
    self.problem;
    self.student_problem;

    self.student_uri = "/api/student";
    self.course_uri = "/api/game";
    self.bundle_uri = "/api/level";
    self.problem_uri = "/api/problem";
    self.student_sol_uri = "/api/student_sol";

    self.screen_name = ko.observable(); //student name
    self.game_name = ko.observable();   // name of the game
    self.level_title = ko.observable(); // name of the level

    self.levels_obj = ko.observableArray([]); //getting all levels based on specific game
    self.problems_list = ko.observableArray([]);


    //navigation through states
	self.state = ko.observable(PAGE_STATE.DASHBOARD);
	
	self.nextState = function(){ self.state(self.state()+1);};
	self.prevState = function(){ self.state(self.state()-1);};


    self.student_id;
    self.course_id;
    self.bundle_id;
    self.problem_id;


    console.log("inside student dashboard");
    self.init = function () {
        //var student_id = localStorage.getItem('student_id');

        //getting data from url parameter
        var vars = {};
        var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
            vars[key] = value;
        });
        self.student_id = vars["id"];
        console.log("getting url parameters");
        console.log(self.student_id);
        
        self.loadStudentData(self.student_id);
    };

    //getting student data
    self.loadStudentData = function (student_id) {
        app.ajax(self.student_uri + "/" + self.student_id, 'GET').done(function(data){
            ////// (data);
            self.student = new Student(data.student);

            self.student.courses([]);

			if(data && data.student){

                self.screen_name(self.student.screen_name());

                self.student.courses.push(data.student.courses[0]);

                self.course_id = data.student.courses[0].id;
                self.loadCourseData(self.course_id);
			}else{
				 console.log(data.error);
            }    
        });    
    };

    //getting course data based on course id
    self.loadCourseData = function (course_id) {
        app.ajax(self.course_uri + "/" + course_id, 'GET').done(function(data){
            if(data && data.level){
                self.game_name(data.level.title);

                for (var i=0; i < data.level.problems.length; i++) {
                    var bundle_id = data.level.problems[i].bundle_id;
                    self.loadBundleData(bundle_id);
                }
            }
            else {
                console.log(data.error);
            }
        });     
    };

    //getting level(bundle) data based on bundle id
    self.loadBundleData = function (bundle_id) {
        app.ajax(self.bundle_uri + "/" + bundle_id, 'GET').done(function(data){
            if(data && data.level){
                self.level = new Level(data.level);
                self.level.problems([]);

                for (var i=0; i < data.level.problems.length; i++) {
                    self.level.problems.push(data.level.problems[i]);
                }

                self.levels_obj.push(data.level);
                console.log("levels obj");
                console.log(ko.toJS(self.level));
            }
            else {
                console.log(data.error);
            }
        });
    };

     //getting problem data based on problem id
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

    //save student problem solution
    self.save_student_problem = function () {
        self.student_problem = new StudentProblem();

        self.student_problem.student_id = self.student_id;
        self.student_problem.bundle_id = self.bundle_id;
        self.student_problem.problem_id = self.problem_id;
        self.student_problem.time_minutes = 10; //default for now
        self.student_problem.solution = self.problem.starter_code;
        self.student_problem.grade = 100; //default for now

        var student_problem;
        var method = 'POST';
        if (self.student_problem != null) {	
            student_problem = ko.toJS(self.student_problem);
            console.log(student_problem);		
            acall = app.ajax(self.student_sol_uri, method, student_problem);
            acall.done(function (response) {
                alert("success");
                console.log(response["result"]); //TBD - make a message
            });
        }
    };




    self.go_to_level = function(levelObj) {
        console.log("inside go to level");
        self.bundle_id = levelObj.id;
        self.loadBundleData(self.bundle_id);

        self.level = levelObj;
        console.log(self.level);

        self.problems_list([]);
        var problems = self.level.problems;
        for (var i=0; i < problems.length; i++) {
            var problem_id = problems[i].problem_id;
            self.loadProblemData(problem_id);
        }

        self.nextState();
    };

    self.go_to_problem = function (problemObj) {
        console.log("inside go to problem");
        self.problem_id = problemObj.id;

        self.problem = new Problem(problemObj);

        self.loadProblemData(self.problem_id);
        self.problem = problemObj;

        self.nextState();
    };

}

function Student(data){  //full student object
    var self = this;

	self.id = ko.observable(data?data.id:-1);
    self.email = ko.observable(data?data.email:"");
    self.screen_name = ko.observable(data?data.screen_name:"");
    self.password = ko.observable(data?data.password:"");
    self.first_name = ko.observable(data?data.first_name:"");
    self.last_name = ko.observable(data?data.last_name:"");
    self.image = ko.observable(data?data.image:"No file chosen");
    self.dob = ko.observable(data?data.dob:"");
    self.background = ko.observable(data?data.background:"");

    self.courses = ko.observableArray();
 
}

function Level(data) { //full level object
    var self = this;

    self.id = ko.observable(data?data.id:-1);
    self.title = ko.observable(data?data.title:"");
    self.image = ko.observable(data?data.image:"No file chosen");
    self.background = ko.observable(data?data.background:"");
    self.score = ko.observable(data?data.score:0);

    self.problems = ko.observableArray();
}

function Problem(data){  //full problem object
	var self = this;
	
	self.id = ko.observable(data?data.id:-1);
    self.title = ko.observable(data?data.title:"");
    self.weight = ko.observable(data?data.weight:1);
    self.instructions = ko.observable(data?data.instructions:"");
    self.starter_code = ko.observable(data?data.starter_code:"");
}

function StudentProblem () {
    self.student_id;
    self.bundle_id;
    self.problem_id;
    self.time_minutes;
    self.solution;
    self.grade;

};

var studentViewModel = new StudentModel();
studentViewModel.init();
ko.applyBindings(studentViewModel);
