<?php
require '../facebook/server/fb-php-sdk/facebook.php';
$app_id = '';
$app_secret = '';
$scope = 'email,publish_actions,publish_stream';
$facebook = new Facebook(array(
                             'appId'  => $app_id,
                             'secret' => $app_secret,
                         ));
$garbled="ltaceriy si a bdrgie fomr msriey ot hpeo. hlep pmortoe ltaceriy.";

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
var appId = '<?php echo $facebook->getAppID() ?>';
FB.init( {
appId: appId,
frictionlessRequests: true,
cookie: true,
});

postonwall=function()
{
    FB.login(function(response) {
        if (response.authResponse) {
            access_token =   FB.getAuthResponse()['accessToken'];
            FB.api('/me', function(response) {
                userid=response.id;
                var body = '';
					FB.api('/'+userid+'/feed', 'post', { body: body, message: '<?php echo $garbled; ?> Puzzled?? To know more go to http://www.elan.org.in/literacyday' }, function(response) {
                    if (!response || response.error)
                    {

                    }

                    else
                    {
						document.getElementById('fbutton').style.backgroundImage="url(../facebook/fsharegrey.png)";
						document.getElementById('fbutton').onclick="";
                    }

                });
            });
        }
        else
        {
        }
}, {scope: 'publish_actions'});
}
</script>
<div class="container" style="background:transparent;">
<table>
<tr>
<td>
<img src="elan_logo.png" style="float:left;height:165px;margin-left:0px;"/>
</td>
<td>
<div id="intro">
It seems one of your friend passed you a scrambled text and you came here to decipher it.</br>The text signifies how a simple sentence as below looks, to more than 774 million people worldwide who cannot read or write.
</div>
</td>
</tr>
</table>
</div>
<div id="jumboLiteracy" class="jumbotron">
<div class="container mod">
      <div class="jumboLeft">
        <div class="description" >
          <h1>Literacy Day 2013</h1>
          <p>Literacy is a bridge from misery to hope. It has the power 
to lift families out of poverty in one generation and change the fate of
 entire communities, particularly in the developing world. Let's make 
this International Literacy Day really mean something and help more 
people learn to read.</p>
        </div><!-- /end descritpion -->
      </div><!-- /end jumboLeft -->

      <div class="widgetContainer">
        <h2>Spread awareness about literacy</h2>
        <p class="subhead">Spread a scrambled message among your friends
 and followers so they know what it's like to be illiterate. They can 
click on the link to decipher it.</p>
        <ul style="margin-top:-0px;height:80px;border-radius:6px;" class="mod" id="widgetLiteracy" >
          <li class="last">
            <div id="scrambleContainer" style="height: 65px;">
              <p style="position:absolute; width:275px; margin-top:0px;font-size:16px" id="original_tweet_text">"Literacy is a bridge from misery to hope. Help promote literacy."</p>
            </div>
            
          </li>
        </ul>
      </div><!-- /end widgetContainer -->
	  </div>
   </div>

<div id="sharemsg">Your friend did his/her bit in sharing the message of literacy. Do your part by sharing the scrambled text on your Facebook and Twitter!</br>Click links below to deliver the message!</div>
<table style="margin:0 auto" valign="center">
<tr>
<td><div id="fbutton" onclick="postonwall();" style="cursor:pointer;background-image:url(../facebook/fshare.png);width:80px;height:27px;background-size:100% 100%;margin-top:-4px;margin-right:5px;"></div></td>
<td><a href="https://twitter.com/share" class="twitter-share-button" data-size="large" data-lang="en" data-url="http://www.elan.org.in/literacyday" data-text="<?php echo $garbled; ?> Puzzled?? To know more go to">Tweet</a></td>
</tr>
</table>
<script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src="https://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");</script>
</body>
</html>