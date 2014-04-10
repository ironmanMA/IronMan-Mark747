<?php
date_default_timezone_set("Asia/Calcutta");
/*
REQUEST CODES
100:login request
101:logout request
102:create post
103:create comment
104:up/down vote
105:retrieve posts
106:retrieve comments
107:fetch admin notifs
*/
function cleaned($in){
	return str_replace('"','&quot;',str_replace("'", "&apos;", $in));

}
foreach($_GET as &$var)
	$var=cleaned($var);

function clean($string) {
    $string = str_replace(' ', '-', $string); // Replaces all spaces with hyphens.
    return preg_replace('/[^A-Za-z0-9\-]/', '', $string); // Removes special chars.
}

if(!isset($_GET['code'])){
	echo '{"code":0}';
	return;
}
$code=$_GET['code'];
session_start();
require_once 'connect.php';

if($code==100){
	if(isset($_SESSION['master']))
		if($_SESSION['master']!=''){
			echo '{"code":100,"success":99}';
			return;
		}
	if(!isset($_GET['uid'])||!isset($_GET['pass'])){
		echo '{"code":100,"success":100}';
		return;
	}
	// $uid=$_GET['uid'];
	// $pass=md5($_GET['pass']);
	$uid=clean($_GET['uid']);
 	$pass=clean(md5($_GET['pass']));
	$result=mysql_query("select * from login_table where uid='$uid';");
	if(mysql_num_rows($result)==0){
		echo '{"code":100,"success":101}';
		return;
	}
	$row=mysql_fetch_row($result);
	if($pass!=$row[2]){
		echo '{"code":100,"success":102}';
		return;		
	}
	$result=mysql_query("select * from user_info where uid='$uid';");
	$row=mysql_fetch_row($result);
	echo '{"code":100,"success":200,"fname":"'.$row[1].'","lname":"'.$row[2].'","img_url":"'.$row[6].'"}';
	$_SESSION['master']=$uid;
	return;
}
if($code==101){
	$_SESSION['master']='';
	echo '{"code":101,"success":200}';
	return;
}
if($code==102){
	if(!isset($_SESSION['master'])||$_SESSION['master']==''){
		echo '{"code":102,"success":300}';
		return;
	}
	if(!isset($_GET['post'])||!isset($_GET['location'])){
		echo '{"code":102,"success":100}';
		return;
	}
	$post_text=$_GET['post'];
	$location=$_GET['location'];
	$uid=$_SESSION['master'];
	$timestamp=date('d-m-Y h:i:s');
	$bigtimestamp=time();
	mysql_query("insert into posts values('','','$post_text','$location','$uid','$timestamp','$bigtimestamp');");
	$id=mysql_insert_id();
	$post_id='P'.sprintf('%06d',$id);
	mysql_query("update posts set post_id='$post_id' where srno=$id;");
	echo '{"code":102,"success":200,"post_id":"'.$post_id.'","timer":"'.$timestamp.'"}';
	return;
}
if($code==103){
	if(!isset($_SESSION['master'])||$_SESSION['master']==''){
		echo '{"code":103,"success":300}';
		return;
	}
	if(!isset($_GET['comment'])||!isset($_GET['post_id'])){
		echo '{"code":103,"success":100}';
		return;
	}
	$com_text=$_GET['comment'];
	$post_id=$_GET['post_id'];
	$uid=$_SESSION['master'];
	$result=mysql_query("select * from posts where post_id='$post_id';");
	if(mysql_num_rows($result)==0){
		echo '{"code":103,"success":101}';
		return;
	}
	$timestamp=date('d-m-Y h:i:s');
	mysql_query("insert into comments values('','','$com_text','$post_id','$uid','$timestamp');");
	$id=mysql_insert_id();
	$com_id='C'.sprintf('%06d',$id);
	mysql_query("update comments set com_id='$com_id' where srno=$id;");
	echo '{"code":103,"success":200,"com_id":"'.$com_id.'"}';
	return;
}
if($code==104){
	if(!isset($_SESSION['master'])||$_SESSION['master']==''){
		echo '{"code":104,"success":300}';
		return;
	}
	if(!isset($_GET['post_id'])||!isset($_GET['uord'])){
		echo '{"code":104,"success":100}';
		return;
	}

	$post_id=$_GET['post_id'];
	$vote=$_GET['uord'];
	$uid=$_SESSION['master'];

	$result=mysql_query("select * from posts where post_id='$post_id';");
	if(mysql_num_rows($result)==0){
		$result=mysql_query("select * from comments where com_id='$post_id';");
	}
	if(mysql_num_rows($result)==0){
		echo '{"code":104,"success":101}';
		return;
	}

	/*$result=mysql_query("select * from votes where post_id='$post_id' and uid='$uid';");
	if(mysql_num_rows($result)!=0){
		echo '{"code":104,"success":102}';
		return;
	}*/
	// mysql_query("delete * from votes where post_id='$post_id' and uid='$uid';");
	mysql_query("delete from votes where uid='$uid' and post_id='$post_id';");
	mysql_query("insert into votes values('','$uid','$post_id','$vote');");
	echo '{"code":104,"success":200}';
	return;
}
if($code==105){
	if(!isset($_SESSION['master'])|| $_SESSION['master']==''){
		echo '{"code":105,"success":300}';
		return;
	}
	$uid=$_SESSION['master'];
	if(!isset($_GET['location'])){
		echo '{"code":105,"success":100}';
		return;
	}
	if(isset($_GET['count'])){
		$post_count=$_GET['count'];
	}
	else{
		$post_count='15';
	}
	
	$location=$_GET['location'];
	if(isset($_GET['method'])){
		$method=$_GET['method'];
	}else{
		$method="r";
	}
	if($method=="t"){
		$result=mysql_query("select *,(select count(*) from votes where post_id=posts.post_id and vote='u')*10-(select count(*) from votes where post_id=posts.post_id and vote='d') as weight from posts where location like '$location' order by weight desc;");				
	}else{
		$result=mysql_query("select * from posts where location like '$location' order by timestamp desc limit $post_count;");
	}
	$out='{"code":105,"success":200,"posts":[';
	for($i=0;$i<mysql_num_rows($result);$i++){
		$row=mysql_fetch_row($result);
		$post_id=$row[1];
		$post_text=$row[2];
		$poster_id=$row[4];
		$time=$row[5];
		$sub_result=mysql_query("select * from user_info where uid='$poster_id';");
		$sub_row=mysql_fetch_row($sub_result);
		$fname=$sub_row[1];
		$lname=$sub_row[2];
		$img_url=$sub_row[6];
		$sub_result=mysql_query("select * from votes where uid='$uid' and post_id='$post_id';");
		if(mysql_num_rows($sub_result)==0){
			$vote='n';
		}
		else{
			$vote=mysql_fetch_row($sub_result)[3];
		}

		$sub_result=mysql_query("select * from votes where post_id='$post_id' and vote='u';");
		$ucount=mysql_num_rows($sub_result);
		$sub_result=mysql_query("select * from votes where post_id='$post_id' and vote='d';");
		$dcount=mysql_num_rows($sub_result);
		
		$sub_result=mysql_query("select * from comments where post_id='$post_id';");
		$ccount=mysql_num_rows($sub_result);
		$out.='{"post_id":"'.$post_id.'","poster_id":"'.$poster_id.'","poster_name":"'.$fname.' '.$lname.'","post_time":"'.$time.'","poster_img_url":"'.$img_url.'","post_text":"'.$post_text.'","ifvoted":"'.$vote.'","upvotes":'.$ucount.',"downvotes":'.$dcount.',"comments_count":'.$ccount.'},';
	}
	if(substr($out, -1)==","){
		$out=substr($out,0,-1);
	}
	$out.=']}';
	echo $out;
	return;
}
if($code==106){
	if(!isset($_SESSION['master'])|| $_SESSION['master']==''){
		echo '{"code":106,"success":300}';
		return;
	}
	$uid=$_SESSION['master'];
	if(!isset($_GET['post_id'])){
		echo '{"code":106,"success":100}';
		return;
	}
	$post_id=$_GET['post_id'];
	$result=mysql_query("select * from comments where post_id like '$post_id' order by srno desc;");
	$out='{"code":106,"success":200,"comments":[';
	for($i=0;$i<mysql_num_rows($result);$i++){
		$row=mysql_fetch_row($result);
		$com_id=$row[1];
		$com_text=$row[2];
		$poster_id=$row[4];
		$time=$row[5];
		$sub_result=mysql_query("select * from user_info where uid='$poster_id';");
		$sub_row=mysql_fetch_row($sub_result);
		$fname=$sub_row[1];
		$lname=$sub_row[2];
		$img_url=$sub_row[6];
		$sub_result=mysql_query("select * from votes where uid='$uid' and post_id='$com_id';");
		if(mysql_num_rows($sub_result)==0){
			$vote='n';
		}
		else{
			$vote=mysql_fetch_row($sub_result)[3];
		}
		$sub_result=mysql_query("select * from votes where post_id='$com_id' and vote='u';");
		$ucount=mysql_num_rows($sub_result);
		$sub_result=mysql_query("select * from votes where post_id='$com_id' and vote='d';");
		$dcount=mysql_num_rows($sub_result);
		$out.='{"com_id":"'.$com_id.'","commentor_id":"'.$poster_id.'","commentor_name":"'.$fname.' '.$lname.'","post_time":"'.$time.'","commentor_img_url":"'.$img_url.'","comment_text":"'.$com_text.'","ifvoted":"'.$vote.'","upvotes":'.$ucount.',"downvotes":'.$dcount.'},';
	}
	if(substr($out, -1)==","){
		$out=substr($out,0,-1);
	}
	$out.=']}';
	echo $out;
	return;
}
if($code==107){
	if(!isset($_SESSION['master'])|| $_SESSION['master']==''){
		echo '{"code":107,"success":300}';
		return;
	}
	$uid=$_SESSION['master'];
	if(!isset($_GET['location'])){
		echo '{"code":107,"success":100}';
		return;
	}
	$location=$_GET['location'];
	$result=mysql_query("select * from admin_posts where location like '$location';");
	$out='{"code":107,"success":200,"admin_posts":[';
	for($i=0;$i<mysql_num_rows($result);$i++){
		$row=mysql_fetch_row($result);
		$post_text=$row[2];
		$post_id=$row[1];
		$time=$row[4];
		$out.='{"ap_id":"'.$post_id.'","ap_text":"'.$post_text.'","ap_time":"'.$time.'"},';
	}
	if(substr($out, -1)==","){
		$out=substr($out,0,-1);
	}
	$out.=']}';
	echo $out;
	return;
}

if($code==108){
	if(!isset($_SESSION['master'])|| $_SESSION['master']==''){
		echo '{"code":108,"success":300}';
		return;
	}
	$uid=$_SESSION['master'];
	if(!isset($_GET['new_password'])){
		echo '{"code":108,"success":100}';
		return;
	}
	$new_password=$_GET['new_password'];
	$m=md5($new_password);
	mysql_query("update login_table set password='$m' where uid='$uid';");
	echo '{"code":108,"success":200}';
	return;
}

if($code==109){
	if(!isset($_SESSION['master'])|| $_SESSION['master']==''){
		echo '{"code":109,"success":300}';
		return;
	}
	$uid=$_SESSION['master'];
	if(!isset($_GET['img_url'])){
		echo '{"code":109,"success":100}';
		return;
	}
	$img_url=$_GET['img_url'];
	mysql_query("update user_info set img_url='$img_url' where uid='$uid';");
	echo '{"code":109,"success":200}';
	return;
}

if($code==110){
	if(!isset($_SESSION['master'])|| $_SESSION['master']==''){
		echo '{"code":110,"success":300}';
		return;
	}
	$uid=$_SESSION['master'];
	if(!isset($_GET['post_id'])){
		echo '{"code":110,"success":100}';
		return;
	}
	$post_id=$_GET['post_id'];
	$result=mysql_query("select user_info.fname,user_info.lname from user_info,votes where votes.uid=user_info.uid and votes.post_id='$post_id' and votes.vote = 'u';");
	$out='{"code":110,"success":200,"users":[';
	for($i=0;$i<mysql_num_rows($result);$i++){
		$row=mysql_fetch_row($result);
		$out.='"'.$row[0].' '.$row[1].'",';
	}
	if(substr($out, -1)==","){
		$out=substr($out,0,-1);
	}
	$out.=']}';
	echo $out;
	return;
	
}

?>
