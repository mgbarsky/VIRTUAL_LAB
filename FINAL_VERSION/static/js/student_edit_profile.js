function StudentEditProfileModel() {
    var self = this;

    self.student_uri = "/api/student";
    self.course_uri = "/api/games"; 
    self.course_list = ko.observableArray([]);

    self.selectedCourseId = ko.observable();

    self.student_id;
    self.course_id;

    self.student_info;


    self.init = function() {
        console.log("All");
        //var student_id = localStorage.getItem('student_id');
          //getting data from url parameter
          var vars = {};
          var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
              vars[key] = value;
          });
          self.student_id = vars["id"];
          self.course_id = vars["course_id"];
          console.log("getting url parameters");
          console.log(self.student_id);

        self.loadStudentData(self.student_id);

        self.getAllCourses();
    };

    self.loadStudentData = function (student_id) {
        app.ajax(self.student_uri + "/" + student_id, 'GET').done(function(data){
            console.log("inside ajax call for student");

            if(data && data.student){
                self.student_info = new StudentInfo(data.student);
                console.log(ko.toJS(self.student_info));
                
            }else{
                    console.log(data.error);
            }    
        });
    };    


    //selectbox for games(courses)
    self.onChangeOptions = function () {
        if (self.selectedCourseId() !== undefined) {
            self.student_info.course_schedule_id(self.selectedCourseId().id);
        }  
        console.log(self.selectedCourseId());
    };
    
    // POST image to server
    self.uploadStudentImage = function(image) {
        self.student_info.image(image.name);
    }

    self.getAllCourses = function () {
        //get all courses(games)
        app.ajax(self.course_uri + "/id,title", 'GET').done(function(data){
            console.log("calling course");
            console.log(data);
            if (data && data.games) {
                for (var i = 0; i < data.games.length; i++) {
                    self.course_list.push(data.games[i]);
                }
            }
            else{
				console.log(data.error);
			}
        });
    };



    self.saveStudentInfo = function(){

        if (self.student_info.email() === "" || self.student_info.screen_name() === "") {
            alert ("email and screen name required");
        }
        
        else {
            var student_info;
            var method = 'PUT';
            
            console.log(self.student_info.id());

            if (self.student_info != null) {	
                console.log("saving data");
                console.log(self.student_info.id());
               
                student_info = ko.toJS(self.student_info);
                acall = app.ajax(self.student_uri,method,student_info);
                acall.done(function(response) {
    
                    console.log(response["result"]);
                    alert("Successfully Updated the account");
                    window.location.href = "index.html";
                });
            }
        }
        
	};	
}

function StudentInfo(data){  //full student object
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

    self.course_schedule_id = ko.observable(data?data.courses[0].course_schedule_id:""); 
}


var viewModel = new StudentEditProfileModel();
viewModel.init();
ko.applyBindings(viewModel);