
<?php 

require 'config.php';
require 'lib/facebook/facebook.php';

$facebook = new Facebook(array(
		'appId'		=>  $appID,
		'secret'	=> $appSecret,
		));
//get the user facebook id		
$user = $facebook->getUser();

if($user){

	try{
		//get the facebook user profile data
		$user_profile = $facebook->api('/me');
		$params = array('next' => $base_url.'logout.php');
		//logout url
		$logout =$facebook->getLogoutUrl($params);
		$_SESSION['User']=$user_profile;
		$_SESSION['logout']=$logout;
	}catch(FacebookApiException $e){
		error_log($e);
		$user = NULL;
	}		
}
	
if(empty($user)){
//login url	
$loginurl = $facebook->getLoginUrl(array(
				'scope'			=> 'email,read_stream, publish_stream, user_birthday, user_location, user_work_history, user_hometown, user_photos',
				'redirect_uri'	=> $base_url.'/zoot',
				'display'=>'popup'
				));


header('Location: '.$loginurl);

}





?>
<!-- after authentication close the popup -->
<script type="text/javascript">

window.close();

</script>