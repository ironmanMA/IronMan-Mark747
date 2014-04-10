<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Login with Facebook</title>
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.4.3/jquery.min.js" type="text/javascript"></script>
<script type="text/javascript" src="js/oauthpopup.js"></script>
<script type="text/javascript">
$(document).ready(function(){
    $('#facebook').click(function(e){
        $.oauthpopup({
            path: 'login.php',
			width:600,
			height:300,
            callback: function(){
                window.location.reload();
            }
        });
		e.preventDefault();
    });
});


</script>
</head>

<body>
<?php 
session_start();
if(!isset($_SESSION['User']) && empty($_SESSION['User']))   { ?>
<img src="images/facebook.png" id="facebook"  style="cursor:pointer;float:left;margin-left:550px;" />
<?php  }  else{
	
 echo '<img src="https://graph.facebook.com/'. $_SESSION['User']['id'] .'/picture" width="30" height="30"/><div>'.$_SESSION['User']['name'].'</div>';	
	echo '<a href="'.$_SESSION['logout'].'">Logout</a>';
}
	?>

</body>
</html>