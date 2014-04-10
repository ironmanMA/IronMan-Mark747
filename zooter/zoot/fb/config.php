<?php

session_start();
//Facebook App Id and Secret
$appID='440444152757286';
$appSecret='0d2f2b135cafbc85f55f91ae70653930';

//URL to your website root
if($_SERVER['HTTP_HOST']=='http://sunshine.iith.ac.in'){
$base_url='http://'.$_SERVER['HTTP_HOST'].$_SERVER['REQUEST_URI'];
}else{
$base_url='http://'.$_SERVER['HTTP_HOST'];	
}
?>