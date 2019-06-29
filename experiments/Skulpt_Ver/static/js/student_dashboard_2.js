function StudentDashboardModel () {
    var self = this;

    self.student;

    self.student_uri = "/api/student";
    self.course_uri = "/api/game";
    self.bundle_uri = "/api/level";

    self.screen_name = ko.observable(); //student name
    self.game_name = ko.observable();   // name of the game

    self.levels_obj = ko.observableArray([]); //getting all levels based on specific game


    console.log("inside student dashboard");
    self.init = function () {
        var student_id = localStorage.getItem('student_id');

        app.ajax(self.student_uri + "/" + student_id, 'GET').done(function(data){
            ////// (data);
            self.student = new Student(data.student);

            self.student.courses([]);

			if(data && data.student){

                self.screen_name(self.student.screen_name());

                self.student.courses.push(data.student.courses[0]);

                self.loadCourseData(data.student.courses[0].course_schedule_id);
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
                    var bundle_id = data.level.problems[i].bundle_schedule_id;
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
                self.levels_obj.push(data.level);
                console.log("levels obj");
                console.log(self.levels_obj());
            }
            else {
                console.log(data.error);
            }
        });
    };


    self.go_to_level_list = function (level_obj) {
        console.log("inside go to level list");
        console.log(level_obj);

        //just for testing
        localStorage.setItem("screen_name",self.screen_name());
        localStorage.setItem("game_name",self.game_name());
        localStorage.setItem("level_obj",JSON.stringify(level_obj));


        window.location.href = "student_level_lists.html";
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

var studentViewModel = new StudentDashboardModel();
studentViewModel.init();
ko.applyBindings(studentViewModel);
