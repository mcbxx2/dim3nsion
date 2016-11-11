var app = angular.module('dim3nsion', []);

app.controller('d3_controller', ['$window', '$scope', function($window, $scope) {
  
  $scope.load = function(){
	  //execute something on load if need be
	  $("div#dropIt").dropzone({ url: "/home/html/file_system/images/" });
  }
  
 
  /**
  * Frame implementation for a POST interaction with the PHP RESTful API
  */
  $scope.POSTMethod = function(){
	$.ajax({
	  method: "POST",
	  url: "REST.php",
	  data: {'data': "sent"},
	  success: function(data){
		  console.log("success");
		  console.log(data);
	  },
	  error: function(data){
		  console.log("failure");
		  console.log(data);
	  }
	});
  }
  
  /**
  * Frame implementation for a GET interaction with the PHP RESTful API
  */
  $scope.GETMethod = function(){
	
	$.ajax({
	  method: "GET",
	  url: "REST.php",
	  data: {'data': "LIST"},
	  success: function(data){
		  console.log("success");
		  console.log(data);
	  },
	  error: function(data){
		  console.log("failure");
		  console.log(data);
	  }
	});
  }
  
  /**
  *	Encodes a date to local date time format.
  * @param date
  *		the date to parse
  * @return the parsed date
  */
  function encodeDate(date){	  
	  return Date.parse(date);
  }
  
  /**
  * Decodes an age - May be useful in dealing with epoch dates
  *
  * @param age
  *		the age to parse
  * @return the decoded age
  *
  */
  function decodeDate(age){	  
	  var current = Date.now();	  
	  var millisInDay = 86400000;
	  
	  age = current - age;
	  
	  return age / millisInDay;
  }
  
$scope.homeTab = true;
    $scope.contactTab = false;
    $scope.aboutTab = false;
    $scope.view3dTab = false;
    $scope.loginTab = false;
    $scope.adminTab = false;
 
    /**
    * Handles navigation bar pagination
    *
    * @param tab
    *        the tab to switch to
    */
    $scope.navigation = function(tab){
        $("#home").removeClass("active");
        $("#contact").removeClass("active");
        $("#about").removeClass("active");
        $("#view3d").removeClass("active");
        $("#login").removeClass("active");
        $("#administration").removeClass("active");
        $scope.homeTab = false;
        $scope.contactTab = false;
        $scope.aboutTab = false;
        $scope.view3dTab = false;
        $scope.loginTab = false;
        $scope.adminTab = false;

        switch(tab){
            case "home":
                //home
                $("#home").addClass("active");
                $scope.homeTab = true;
                break;
            case "about":
                //about
                $("#about").addClass("active");
                $scope.contactTab = true;
                break;
            case "contact":
                //contact
                $("#contact").addClass("active");
                $scope.aboutTab = true;
                break;
            case "view3d":
                //view
                $("#view3d").addClass("active");
                $scope.view3dTab = true;
                break;
            case "login":
                //login
                $("#login").addClass("active");
                $scope.loginTab = true;
                break;
            case "admin":
                //admin
                $("#administration").addClass("active");
                $scope.adminTab = true;
                break;
        }
    }
}]);