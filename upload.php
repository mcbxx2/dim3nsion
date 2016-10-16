<?php
$ds          = DIRECTORY_SEPARATOR;  //1
 
$storeFolder = '/home/html/file_system/images/';   //2
 
openlog("myScriptLog", LOG_PID | LOG_PERROR, LOG_LOCAL0);
 
if (!empty($_FILES)) {
     
    $tempFile = $_FILES['file']['tmp_name'];          //3             
      
    $targetFile =  $storeFolder. $_FILES['file']['name'];  //5

	syslog(LOG_ERR, $targetFile);
 
    move_uploaded_file($tempFile,$targetFile); //6
     
}

closelog();

?>  