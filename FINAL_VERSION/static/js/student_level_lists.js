function StudentLevelListsModel () {
    var self = this;

    self.problem_uri = "/api/problem";
    self.student_uri = "/api/student";
    self.course_uri = "/api/game";
    self.bundle_uri = "/api/level";

    self.screen_name = ko.observable(); //student name
    self.game_name = ko.observable();   // name of the game
    self.level_title = ko.observable(); // name of the level

    self.problems_list = ko.observableArray();

    self.student_id;
    self.course_id;
    self.bundle_id;
    self.problem_id;

    self.init = function () {
       
        //getting data from url parameter
        var vars = {};
        var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
            vars[key] = value;
        });
        self.student_id = vars["id"];
        self.course_id = vars["course_id"];
        self.bundle_id = vars["bundle_id"];
        console.log("getting url parameters");
        console.log("student_id: "+ self.student_id);
        console.log("course_id: "+ self.course_id);
        console.log("bundle_id: "+ self.bundle_id);
   

        self.loadStudentData(self.student_id);
        self.loadCourseData(self.course_id);
        self.loadBundleData(self.bundle_id);
    };

    self.loadStudentData = function (student_id) {
        app.ajax(self.student_uri + "/" + student_id, 'GET').done(function(data){
            ////// (data);
            console.log("inside load student data");
            console.log(data);
			if(data && data.student){
                self.screen_name(data.student.screen_name);
			}else{
				 console.log(data.error);
            }    
        });    
    };

    self.loadCourseData = function (course_id) {
        app.ajax(self.course_uri + "/" + course_id, 'GET').done(function(data){
            if(data && data.level){
                self.game_name(data.level.title);
            }
            else {
                console.log(data.error);
            }
        });     
    };

    self.loadBundleData = function (bundle_id) {
        app.ajax(self.bundle_uri + "/" + bundle_id, 'GET').done(function(data){
            if(data && data.level){
                self.level_title(data.level.title);

                var problems = data.level.problems;
                for (var i=0; i < problems.length; i++) {
                    var problem_id = problems[i].problem_id;
                    self.loadProblemData(problem_id);
                }
            }
            else {
                console.log(data.error);
            }
        });
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


        self.problem_id = problem_obj.id;

        console.log("student id: "+self.student_id);
        console.log("course id: "+self.course_id);
        console.log("level id: "+self.bundle_id);
        console.log("problem id: "+ self.problem_id);
        //just for testing
        //localStorage.setItem("problem_obj",JSON.stringify(problem_obj));

        
        //window.location.href = "student_problem.html?id="+self.student_id+"&course_id="+self.course_id+"&bundle_id="+self.bundle_id+"&problem_id="+self.problem_id;
    }
}

var viewModel = new StudentLevelListsModel();
viewModel.init();
ko.applyBindings(viewModel);