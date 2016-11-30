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
  
  
  $scope.testSession = function(){
	$.ajax({
	  method: "POST",
	  url: "test.php",
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
	
	$scope.username = "";
	$scope.user = "Login";
	$scope.loginFail = false;
	$scope.loginStatus = false;
	$scope.model_list = [];
 
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
                $scope.aboutTab = true;
                break;
            case "contact":
                //contact
                $("#contact").addClass("active");
                $scope.contactTab = true;
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
	
	$scope.download = function(file){
		window.location = file;
	}
	
	$scope.active = "";
	$scope.activeModelBool = false;
	
	$scope.setActive = function(modelPath){
		$scope.active = parse(modelPath);
		$scope.activeModelBool = true;
	}
	
	$scope.authenticate = function(userToCheck){
		$scope.loginFail = false;
		//console.log(userToCheck);
		
		//check against database if true
		
		$.ajax({
		  method: "POST",
		  url: "REST.php",
		  data: {'data': "login", 'user': userToCheck},
		  success: function(data){
			  //console.log("success");
			  //console.log(data + "////");
			  if(data == "true"){
				$scope.user = userToCheck;
				$scope.loginStatus = true;
				$scope.getUserModels();
				$scope.$apply();
			  }else{
				  $scope.loginFail = true;
				  $scope.loginStatus = false;
				  $scope.$apply();
			  }
		  },
		  error: function(data){
			  console.log("failure");
			  console.log(data);
			  $scope.loginFail = true;
		  }
		});	

	}
	
	$scope.getUserModels = function(){
		console.log("getting user models.");
		$scope.model_list = [];
		$.ajax({
		  method: "GET",
		  url: "REST.php",
		  data: {'data': "LIST"},
		  success: function(data){
			  console.log("success");
			  console.log(data);
			  var data2 = JSON.parse(data);
			  var num_paths_in_data = data2.length;
			  
			  for(var i = 0; i < num_paths_in_data; ++i){
				  console.log(data2[i].obj_file_path + "<<<");
				  $scope.model_list.push(data2[i].obj_file_path);
			  }
			  //$scope.model_list = data;
			  $scope.$apply();
		  },
		  error: function(data){
			  console.log("failure");
			  console.log(data);
		  }
		});
		
	}
	
	function parse(path){
	
		var parsed = path.split("/");
		var length = parsed.length;
		var last = parsed[length - 1];
		var parsed2 = "/file_system/models/" + last;
	
		return parsed2;
	}
	
}]);