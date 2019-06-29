

function StudentLoginModel () {
    var self = this;

    self.student_uri = "/api/student_login";
    

    self.student_login_info = new StudentLoginInfo();

    self.isLoginError = ko.observable(false);
    self.error_text = ko.observable();


    self.checkStudentLoginInfo = function () {
       

        var student_login_info;
        var method = 'POST';

        student_login_info = ko.toJS(self.student_login_info);

        acall = app.ajax(self.student_uri,method,student_login_info);
        acall.done(function(response) {
            console.log(response['result']);
            
            if (response['result'] === "success") {
                //localStorage.setItem("student_id",response['student_data'].id);
                
                window.location.href= "student_dashboard.html?id="+response['student_data'].id;
            }
            else {
                alert(response['result']);
                self.error_text(response['result']);
                self.isLoginError(true);
            }
           
        });
        
    };
}

function StudentLoginInfo(){  //full student object
    var self = this;

    self.email = ko.observable("");
    self.password = ko.observable("");
}

var viewModel = new StudentLoginModel();
//viewModel.init();
ko.applyBindings(viewModel);