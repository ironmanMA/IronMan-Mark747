<?php
session_start();
if(!isset($_POST['login']))
return;
if($_POST['login']==0)
{
if(isset($_SESSION['master']) && $_SESSION['master']!='')
{
echo 'response="signedin";name="'.$_SESSION['name'].'";';
return;
}
else
{
echo 'response="nosign";';
return;
}
}
if($_POST['login']==2)
{
$_SESSION['master']='';
$_SESSION['name']='';
echo 'response="destroyed";';
return;
}
if(isset($_SESSION['master']) && $_SESSION['master']!='')
{
echo 'response="loginclash";';
return;
}
$user=$_POST['user'];
$pass=$_POST['pass'];
require_once 'details.php';
$db_server=mysql_connect($db_host,$db_username,$db_password);
mysql_select_db($db_database,$db_server);
$result=mysql_query("select * from login_details where BINARY elan_id='$user';");
if(mysql_num_rows($result)==0)
{
echo 'response="invalidlogin";';
return;
}
$row=mysql_fetch_row($result);
if($pass==$row[3])
{
echo 'response="success";name="'.$row[4].' '.$row[5].'";';
$_SESSION['master']=$user;
$_SESSION['name']=$row[4].' '.$row[5];
return;
}
else
{
echo 'response="invalidpass";';
}
?>
