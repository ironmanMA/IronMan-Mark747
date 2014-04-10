<html>
<head>
<title>
FETCH PASSWORD
</title>
<style>
body{
	background-color: black;
	color:white;
	font-family: Courier;
}
</style>
</head>
<body>
<center>
<?php
if(isset($_GET['username'])){
	$uid=$_GET['username'];
	require_once 'connect.php';
	$result=mysql_query("select * from starters where uid='$uid';");
	if(mysql_num_rows($result)!=0){
		$row=mysql_fetch_row($result);
		$sub_result=mysql_query("select * from user_info where uid='$uid';");
		$sub_row=mysql_fetch_row($sub_result);
		$email=$uid."@iith.ac.in";
		$name=$sub_row[1]." ".$sub_row[2];
		$headers = "From: " . "zoot.sunshine@gmail.com" . "\r\n";
		$headers .= "MIME-Version: 1.0\r\n";
		$headers .= "Content-Type: text/html; charset=ISO-8859-1\r\n";

		$texttomail='Hi '.$name.'<br><br> Welcome to ZOOT!!<br><br> Your username is '.$uid.' and password is '.$row[2].'<br><br> Happy ZOOTING!!! <br><br>Cheers <br>ZOOT Team!';
		mail($email,"ZOOT login info",$texttomail,$headers);
		echo '<h1>Your username and passwords are mailed to your iith id. If you donot recieve them check you spam or mail to zoot.sunshine@gmail.com .</h1>';
	}
	else
		echo '<h1>The username you entered is either invalid or not yet created. Please verify or mail to zoot.sunshine@gmail.com for any query!</h1>';

}
else{
?>
<h1>Enter your rollnumber! Password will be mailed to you!</h1><br>
<form action="fetch.php" method="GET">
<input type="textbox" id="username" name="username"/>
<input type="submit" value="Mail me!" name="go"/>
</form>
<?php
}
?>

</center>
</body>
</html>