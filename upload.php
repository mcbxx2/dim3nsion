<?php
session_start();
$user = $_SESSION['user'];
$ds          = DIRECTORY_SEPARATOR;  //1
 
$storeFolder = '/home/html/file_system/images/';   //2
 
openlog("myScriptLog", LOG_PID | LOG_PERROR, LOG_LOCAL0);
 
if (!empty($_FILES)) {
     
    $tempFile = $_FILES['file']['tmp_name'];          //3             
      
    $targetFile =  $storeFolder. $_FILES['file']['name'];  //5

	syslog(LOG_ERR, $targetFile);
/* 	$outputs;
	$returns;
	$returned = exec("./a.out", $outputs, $returns); */
 
    move_uploaded_file($tempFile,$targetFile); //6
	add_image_path($user, $targetFile);
	
	
	$outputs;
	$returns;
	
	//convert the image
	$returned = exec("./fromImageToObject/build/fromImageToObject " . $targetFile, $outputs, $returns);

	error_log("STARTING TEST OUTPUT\noutputs");
	error_log($outputs);
	error_log("\nReturns");
	error_log($returns);
	error_log("\nReturned");
	error_log($returned);
	error_log("ENDING TEST OUTPUT");
	
	$obj_path = "";
	
	if($returns == 1){
		error_log("We made the object successfully");
	}else{
		error_log("Object creation failed");
	}
	
	if($returned == "Object Successfully Made"){
		$obj_path = "/home/html/file_system/models/" . parse_image_name($targetFile) . ".obj";
		add_model_path($user, $obj_path, $targetFile);
	}
	
	//add_model_path($user, $returned, $targetFile);
     
}

closelog();


	function add_image_path($user, $path){
		// Connecting, selecting database
		$dbconn = connect();
		
		$query1 = "SELECT user_id FROM alpha.users WHERE username = '" . $user . "'";
		$result1 = pg_query($query1)or die('Query failed: ' . pg_last_error());
		
		$user_id = pg_fetch_result($result1, 0, 0);

		$objName = parse_image_name($path);
		// Performing SQL query
		$query = "INSERT INTO alpha.objects (user_id, size, obj_file_path, image_file_path, name) VALUES(" . $user_id . ", 100, 'OBJECT CURRENTLY PROCESSING', '" . $path . "', '" . $objName . "')";
		$result = pg_query($query) or die('Query failed: ' . pg_last_error());

		// Free resultset
		pg_free_result($result);

		// Closing connection
		pg_close($dbconn);
		
		return $value_arr;
	}
	
	
	function add_model_path($user, $path, $image_path){
		// Connecting, selecting database
		$dbconn = connect();

		$query1 = "SELECT user_id FROM alpha.users WHERE username = '" . $user . "'";
		$result1 = pg_query($query1)or die('Query failed: ' . pg_last_error());
		
		$user_id = pg_fetch_result($result1, 0, 0);
		
		// Performing SQL query
		$query = "UPDATE alpha.objects SET obj_file_path = " . "'" . $path . "'" . " where user_id = " . $user_id . " AND image_file_path = " . "'" . $image_path . "'";
		$result = pg_query($query) or die('Query failed: ' . pg_last_error());

		// Free resultset
		pg_free_result($result);

		// Closing connection
		pg_close($dbconn);
		
		return $value_arr;
	}

	function parse_image_name($path){
		$parsed = explode('/', $path);
		$numSeperations = count($parsed);
		$fileName = $parsed[$numSeperations - 1];
		$finalParsed = explode('.', $fileName);
		return $finalParsed[0];
	}

	function connect(){
		// Connecting, selecting database
		$dbconn = pg_connect("host=localhost dbname=dim3nsion user=riosdr password=102785Ls!")
			or die('Could not connect: ' . pg_last_error());
		return $dbconn;
	}	
?>  