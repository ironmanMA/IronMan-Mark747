<?php
session_start();
 require 'bundle/facebook.php';
  $app_id = '440444152757286';
  $app_secret = '0d2f2b135cafbc85f55f91ae70653930';
  $scope = 'email,read_stream, publish_stream, user_birthday, user_location, user_work_history, user_hometown, user_photos';
  $facebook = new Facebook(array(
                               'appId'  => $app_id,
                               'secret' => $app_secret,
                           ));
?>

<!DOCTYPE html>
<html>
<head>
	<title>Sunshine Zoot</title>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <link rel="stylesheet" href="style.css" type="text/css">
    <link rel="stylesheet" href="ministyle.css" type="text/css">
    <link rel="stylesheet" href="options.css" type="text/css">
    <script type="text/javascript" src="jquery.min.js"></script>
    <script type="text/javascript" src="jquery-ui.min.js"></script>
    <script type="text/javascript" src="jquery.autosize.min.js"></script>
    <style type="text/css">
        body{
            margin:0px;
	    position: absolute;
	    top: 0px;
	    bottom: 0px;
	    left: 0px;
	    right: 0px;
        }
        .nonselec{
            -moz-user-select: -moz-none;
            -khtml-user-select: none;
            -webkit-user-select: none;
            -ms-user-select: none;
            user-select: none;
        }
        #tuttext{
            font-size: 40px;
            color:#00bad3;
            text-shadow: 0px 0px 10px white,0px 0px 10px white,0px 0px 10px white;
            font-family: "lucida grande", tahoma, verdana, arial, sans-serif;
        }
    
        @font-face {
            font-family: 'FORQUE';
            src: url('Forque.ttf') format('truetype'); 
        }
        @font-face {
            font-family: 'Featured Item';
            src: url('Featured.ttf') format('truetype'); 
        }
        @font-face {
            font-family: 'Billabong';
            src: url('Billabong.ttf') format('truetype'); 
        }

    
    </style>
</head>
<body>
    <div id="fb-root"></div>
    <div id="like_shower" class="like_shower">loading...</div>
    <!-- login status -->
    <div id="login_info" class="login_info" ></div>
	
    <div style="position: absolute; z-index: -10; top: 0px; bottom: 0px; left: 0px; right: 0px;">
		<canvas id="3dbg" style="width:100%; height:100%;">
		</canvas>
	</div>
	    <div id="frontground" style="position: absolute; z-index: 0; width: 100%; height: 100%;">
        <div id="header" style=" overflow: auto;">
            <div id="tinger" style="float: right; background:url(../api/images/gear.png); margin: 10px; width: 50px; height: 50px; background-size: 50px 50px; cursor: pointer;" >
            </div>
        </div>

        <div id="tutarea" style="width: 100%;">
            <div id="tut" style="width: 700px; height: 200px; margin: auto; display:none; text-align: center;">
                <span id="tuttext" class="nonselec"></span>
            </div>
        </div>
    </div>
	    
	    
	<div id="logger" class="login_wrapper nonselec">
	<input id="loginusername" placeholder="Username" class="username_login nonselec">
	<input type="password" id="loginpassword" placeholder="Password" class="password_login nonselec">
	
	<div id="login_button" class="login_button  nonselec">Login</div>
	</div>

    <div id="reqpass" class="reqpass nonselec">
        <a class="reqpasstext" href="fetch.php">Get Your Password !!!</a>    
    </div>
    

	<div id="iith-map" class="iith-map  nonselec">
		<div id="iith-map-button" style="color:black;"class="iith-map-button  nonselec">IIT-H MAP</div>
		<!-- <img id="iith-map-img" src="images/iithmap.png" class="iith-map-img  nonselec"> -->
        <canvas id="map_canvas"  class="map-canvas nonselec" ></canvas>
	</div>
	<div id="loader" class="nonselec" style="display: none; width:80px; height:50px; position:absolute;top: 50%; left: 50%;  font-size: 40px;"><img src="images/490.gif"> Loading...</div>
    
        <div id="feedback_info"> </div>

            <div id="about_us_info"> 
                <img src="credits.svg">
            </div>

    <div class="overlay" id="overlay_window"> </div>

    <div id="options">
            <div id="inneroptions">
                <div id="feedback" class="menu"> <a href="feedback.php">FeedBack</a> </div>
                <div id="about_us" class="menu"> About Us </div>
                <div id="cpic" class="menu" style="display:none;"> Change Picture</div>
                <div id="cpass" class="menu" style="display:none;"> Change password</div>
                <div id="logout" class="menu" style="display:none;"> Log Out</div>
            </div>
            <div id="options_btn" >Options</div>
    </div>

</body>
    <script src="//connect.facebook.net/en_US/all.js"></script>
    <script type="text/javascript" src="populate_test.js?version=12"></script>
	<script type="text/javascript" src="script.js"></script>
	<script type="text/javascript" src="../api/cadpeer.api.alpha.js"></script>
    <script src="https://maps.googleapis.com/maps/api/js?sensor=false"></script>
    
    <?php
        // session_start();
        if(isset($_SESSION['master']) && $_SESSION['master']!=''){
            require_once 'connect.php';
            $uid=$_SESSION['master'];
            $result=mysql_query("select * from user_info where uid='$uid';");
            $row=mysql_fetch_row($result);
            $name=$row[1]." ".$row[2];
            $img_url=$row[6];
            $img_url=str_replace("\n", "", $img_url);
            echo '<script>do_post_login("'.$name.'","'.$img_url.'");</script>';
            echo '<script>do_this_post_reload();</script>';
        }
        else{
            echo '<script>do_this_post_nonlogin();</script>';
        }
    ?>

</html>

