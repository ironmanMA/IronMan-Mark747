<html>
<head>
<title>
Zoot Feedback
</title>
<style>
body{
	background-color: black;
	color:white;
	font-family: Courier;
}

.error {
	color: #FF0000;
}

</style>
</head>
<body>
<center>
<?php

	function test_input($data)
	{
	     $data = trim($data);
	     $data = stripslashes($data);
	     $data = htmlspecialchars($data);
	     return $data;
	}

if(isset($_GET['username'])){
	$uid=$_GET['username'];
	$gemail = $_GET['gemail'];
	$feedback = test_input($_GET['feedback']);
	if(!empty($gemail) && !empty($feedback)){ //both are non-empty !!!
		$email="zoot.sunshine@gmail.com";
		$name = $uid;
		$headers = "From: " . $gemail . "\r\n";
		$headers .= "MIME-Version: 1.0\r\n";
		$headers .= "Content-Type: text/html; charset=ISO-8859-1\r\n";

		$texttomail='Feedback from '.$name.'<br><br>'.$feedback;
		mail($email,"ZOOT Feedback",$texttomail,$headers);
		echo '<h1>We have received your feedback. Thanks!!! </h1>';
	}else{
		echo '<h1>The username you entered is either invalid or not yet created. Please verify or mail to zoot.sunshine@gmail.com for any query!</h1>';
	}
}

else{
?>
<h1>Please provide your Feedback !!! </h1><br>
<form action="feedback.php" method="GET">
Your Name : <input type="textbox" id="username" name="username"/><br><br>
Email Address : <input type="email" id="gemail" name="gemail"/><br><br>
Feedback : <textarea name="feedback" rows="6" cols="40"></textarea><br><br>
<input type="submit" value="Mail me!" name="go"/>
</form>
<?php
}
?>

</center>
</body>
</html>