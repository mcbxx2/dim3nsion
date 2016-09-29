<?php
	/*
		RESTful API. Governs CRUD operations.
	*/
	$method = $_SERVER['REQUEST_METHOD'];
	
	switch($method){
		case "GET":
			$data = $_GET['data'];
			//do something with the data
			break;
		case "POST":
			$data = $_POST['data'];
			//do something with the data
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

	$exit_value = json_encode($exit_value);
	echo $exit_value;
	return $exit_value;
	
?>