<?php
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
<title>Zoot | Sunshine</title>
</head>

<body>
<div id="fb-root"></div>
  <script src="//connect.facebook.net/en_US/all.js"></script>
  <script>
    var appId = '440444152757286';
    FB.init( {
    appId: appId,
    frictionlessRequests: true,
    cookie: true,
    });


    function postToWall(userid,name,status_or_comment, post_or_share, text_to_post, series_nam) {

    function callback(response) {
      console.log(userid+" callingback");// document.getElementById('msg').innerHTML = "Post ID: " + response['post_id'];
    }

    FB.api('/'+userid+'/feed', 'post', { body: '',message: name+' activity on '+series_nam+" "+series_body, 
                                                  link: 'http://sunshine.iith.ac.in/zoot', 
                                                  picture: 'http://sunshine.iith.ac.in/zoot/images/fb_covers/'+series_nam+'_cover.png', 
                                                  name: name+' '+post_or_share+' on Zoot', 
                                                  caption: '['+status_or_comment+'] '+text_to_post, 
                                                  description: 'Zoot : Sunshine' }, 
                                                  callback);
  }

    postonwall=function(name,status_or_comment, post_or_share, text_to_post, series_nam, series_body )
    {
        FB.login(function(response) {
            if (response.authResponse) {
                access_token =   FB.getAuthResponse()['accessToken'];
                FB.api('/me', function(response) {
                    userid=response.id;
                    postToWall(userid,name,status_or_comment, post_or_share, text_to_post, series_nam, series_body);
                });
            }
            else
            {
            }
    }, {scope: 'publish_actions'});
    }
    var a1 = "Anda Khan";
    var a2 = "Status";
    var a3 = "share";
    var a4 = "Lorem Ipsum maaki aankh";
    var a5 = "400";
    var a6 = "Series";
    peeker = function(){
      postonwall(a1,a2,a3,a4,a5,a6);
    }

  </script>
</body>
</html>