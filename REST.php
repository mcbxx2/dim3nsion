<?php

	session_start();
	/*
		RESTful API. Governs CRUD operations.
	*/
	$method = $_SERVER['REQUEST_METHOD'];
	
	switch($method){
		case "GET":
			$data = $_GET['data'];
			$user = $_SESSION['user'];
			$returnData = get_user_model_paths($user);
			//do something with the data
			break;
		case "POST":
			$data = $_POST['data'];
			//do something with the data
			if($data == "login"){
				$user = $_POST['user'];
				$_SESSION['user'] = $user;
				if(authenticate($user)){
					echo "true";
					return "true";
				}else{
					echo "false";
					return "false";
				}
			}else{
				//nothing for now
				echo "false";
				return "false";
			}
			
			break;
		case "PUT":
			$data = $_PUT['data'];
			//do something with the data
			break;
		case "DELETE":
			$data = $_DELETE['data'];
			//do something with the data
			break;
	}

	$exit_value = json_encode($returnData);
	echo $exit_value;
	return $exit_value;
	
	
	
	function authenticate($name){
		// Connecting, selecting database
		$dbconn = connect();

		// Performing SQL query
		$query = "SELECT user_id FROM alpha.users WHERE username = '" . $name . "'";
		$result = pg_query($query) or die('Query failed: ' . pg_last_error());


		$rows = pg_num_rows($result);
		
		if($rows == 1){
			// Free resultset
			pg_free_result($result);

			// Closing connection
			pg_close($dbconn);
		
			return true;
		}else{
			// Free resultset
			pg_free_result($result);

			// Closing connection
			pg_close($dbconn);
		
			return false;
		}

	}
	
	
	function get_user_model_paths($user){
		// Connecting, selecting database
		$dbconn = connect();

		$query1 = "SELECT user_id FROM alpha.users WHERE username = '" . $user . "'";
		$result1 = pg_query($query1)or die('Query failed: ' . pg_last_error());
		
		$user_id = pg_fetch_result($result1, 0, 0);
		
/* 		while ($line1 = pg_fetch_array($result1, null, PGSQL_ASSOC)) {
			$user_id = $line1;
		} */
		
		// Performing SQL query
		$query = "SELECT obj_file_path FROM alpha.objects WHERE user_id = " . $user_id;
		$result = pg_query($query) or die('Query failed: ' . pg_last_error());
		$value_arr = array ();
		
		// Printing results in HTML
		while ($line = pg_fetch_array($result, null, PGSQL_ASSOC)) {
			array_push($value_arr, $line);
		}

		// Free resultset
		pg_free_result($result);

		// Closing connection
		pg_close($dbconn);
		
		return $value_arr;
	}
	
	function connect(){
		// Connecting, selecting database
		$dbconn = pg_connect("host=localhost dbname=dim3nsion user=riosdr password=102785Ls!")
			or die('Could not connect: ' . pg_last_error());
		return $dbconn;
	}

	
?>