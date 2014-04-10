var act_user_name="";
var act_user_pic = "";
var already_logged_in = 0;


// var building_names  = new Array("100", "200", "300", "400", "600", "700", "800", "900", "1000", "Music", "Shakti", "TvGym","Cafty", "Rec", "Girl");
// var build_like_name = new Array("1__", "2__", "3__", "4__", "6__", "7__", "8__", "9__", "1___", "music", "shakti", "tvgym","cafty", "rec", "girl");
// var building_nicks  = new Array("100", "200", "Spartans", "400", "600", "Falcons", "800", "900", "1000", "Music", "Shakti", "TvGym","Cafty", "Rec", "Girl");
// var builing_types   = new Array("Series","Series","Series","Series","Series","Series","Series","Series","Series","Room","Mess","Room","Room","Room","Hostel" ) ;

var building_names  = new Array("100", "300", "400","music","tvttgym","girl","cafty","700", "800", "900");
var build_like_name = new Array("1__", "3__", "4__","music","tvttgym","girl", "cafty", "7__", "8__", "9__");
var building_nicks  = new Array("100", "300", "400","Music","Tv/Tt","Girls", "Cafty", "700", "800", "900");
var builing_types   = new Array("Series","Series","Series","Room","Room","Hostels","Room","Series","Series","Series") ;

var building_posx = new Array("100px", "300px" , "400px", "500px","600px","700px","900px", "800px", "700px", "600px");
var building_posy = new Array("100px", "300px" , "400px", "500px","600px","700px","900px", "800px", "700px", "600px");


do_post_login=function(act_user_name,act_user_pic){

			//act_user_name=resp.fname+" "+resp.lname;
			//act_user_pic = resp.img_url;
			cdpr.onload="makeworldvisible";
			cdpr.onchange = "rearrangeworld";
			// console.log("idhar be!!");
			model("400","400.obj",0.8,     [-1.4,0.5,0],Math.PI);
			model("300","300.obj",0.15,   [0,2.5,0],Math.PI/2);
			model("100","100.obj",0.08,   [1.7,1.7,0],Math.PI);
			model("cafty","cafty.obj",0.7,[-0.7,0.5,0],0);

			model("music","music.obj",0.2,[0.1,0.7,0],-Math.PI/2);
			model("tvttgym","ttroom.obj",0.03,[0,0.3,0],Math.PI);
			model("girl","gh.obj",0.12,[1.7,-1,0],Math.PI);

			model("700", "700.obj",0.12,[-2.3,-1,0],-Math.PI/2); //need pos, scale
			model("800", "800.obj",0.12,[-1.2,-1.8,0],0);     //need pos, scale
			model("900", "900.obj",0.45,[-1,-3,0],-Math.PI/2);	   //need pos, scale

			dropmodel("zoot");

			// create hover markers
			for(var iter=0; iter<building_names.length; iter++){

				var geo_loc_id = "GL_"+building_names[iter];

				//wrapper
				var geo_wrapper = document.createElement('div');
				geo_wrapper.className += "map-hover-marker";
				geo_wrapper.id = geo_loc_id;
				// geo_wrapper.style.display = "none";
				
				//name
				var series_name = document.createElement('div');
				series_name.className += "name-container";
				var temp = ""+building_nicks[iter];
				series_name.innerHTML = temp;
				
				//admin notif
				var admin_hover = document.createElement('div');
				admin_hover.className +="admin-hover-notif";
				// admin_hover.innerHTML = "10+";

				var admin_hover_text = document.createElement('div');
				admin_hover_text.className +="admin-hover-notif-text";
				admin_hover_text.id = "Admin_Num_GL_"+building_names[iter];
				admin_hover_text.innerHTML = "5";
				admin_hover.appendChild(admin_hover_text);
				geo_wrapper.appendChild(series_name);
				geo_wrapper.appendChild(admin_hover);
				// geo_wrapper.style.display = "none";

				//set their locations !!!
				geo_wrapper.style.top = building_posy[iter];
				geo_wrapper.style.left = building_posx[iter];
				geo_wrapper.style.display = "none";
				//add to body
				document.body.appendChild(geo_wrapper);
			}

			// create off screen locaters
			for(var iter=0; iter<building_names.length;iter++){

				//offscreen wrapper
				var offscreen_wrapper = document.createElement('div');
				offscreen_wrapper.className += "offscreen-marker-container"
				offscreen_wrapper.id = "offscreen_hover_"+building_names[iter];

				//name of series
				var offscreen_namer = document.createElement('div');
				offscreen_namer.className +="offscreen-name-contaianer";
				var temp = ""+building_names[iter];
				offscreen_namer.innerHTML=temp;
				var offscreen_namer_type = document.createElement('div');
				offscreen_namer_type.className +="offscreen-series-contaianer";
				var temp = ""+builing_types[iter];
				offscreen_namer_type.innerHTML =temp;

				offscreen_wrapper.appendChild(offscreen_namer);
				offscreen_wrapper.appendChild(offscreen_namer_type);
				offscreen_wrapper.style.display="none";

				//set the locations

				//append to body
				document.body.appendChild(offscreen_wrapper);
			}

			// create containers !!!

			for(var iter=0;iter<building_names.length;iter++ ){
				//mother wrapper
				var main_activity_wrapper = document.createElement('div');
				main_activity_wrapper.className += "main-activity-overlay-container";
				main_activity_wrapper.id ="AC_"+building_names[iter];

				// container close button
				var main_activity_closer = document.createElement('div');
				main_activity_closer.className+="main_overlay_container_close";
				main_activity_closer.id = "Close_AC_"+building_names[iter];
				main_activity_closer.innerHTML = "X";
				main_activity_wrapper.appendChild(main_activity_closer);

				//notif area
				var main_notif_wrapper = document.createElement('div');
				main_notif_wrapper.className+="main-admin-notif-container";

				var main_notif_activity = document.createElement('div');
				main_notif_activity.className+="main-admin-notif-activity";

				var main_notif_activity_prev = document.createElement('div');
				main_notif_activity_prev.className +="main-admin-notif-prev-button";
				main_notif_activity_prev.id += "Prev_AdminNotif_AC_"+building_names[iter];

				var main_notif_activity_title = document.createElement('div');
				main_notif_activity_title.className +="main-admin-notif-title";
				main_notif_activity_title.innerHTML = "Aadmin Notification";

				var main_notif_activity_next = document.createElement('div');
				main_notif_activity_next.className+="main-admin-notif-next-button";
				main_notif_activity_next.id += "Next_AdminNotif_AC_"+building_names[iter];

				var main_notif_activity_content = document.createElement('div');
				main_notif_activity_content.className +="main-admin-notif-content";

				var main_notif_activity_content_text =document.createElement('div');
				main_notif_activity_content_text.className +="main-admin-notif-text";
				main_notif_activity_content_text.id="AdminNotif_Text_AC_"+building_names[iter];
				main_notif_activity_content_text.innerHTML = "No Posts here...";

				main_notif_activity_content.appendChild(main_notif_activity_content_text);

				main_notif_activity.appendChild(main_notif_activity_prev);
				main_notif_activity.appendChild(main_notif_activity_title);
				main_notif_activity.appendChild(main_notif_activity_next);
				main_notif_activity.appendChild(main_notif_activity_content);

				// Admin Notif Wrapper is tyyar !!!
				main_notif_wrapper.appendChild(main_notif_activity);
				main_notif_wrapper.appendChild(main_notif_activity_content);


				//Status update !!!

				var main_status_update_wrapper = document.createElement('div');
				main_status_update_wrapper.className+="main-status-update-container";

				var main_status_update_title = document.createElement('div');
				main_status_update_title.className +="main-status-update-title";
				main_status_update_title.innerHTML = "Status Update";

				var main_status_update_textarea = document.createElement('textarea');
				if(act_user_name.localeCompare("Guest ")==0){
					main_status_update_textarea.placeholder ="Guest users cannot post...";
				}else{
					main_status_update_textarea.placeholder ="Share your memories @ IIT Hyderabad...";	
				}
				
				main_status_update_textarea.className +="main-status-update-text-input-box";
				main_status_update_textarea.id = "main-status-update-text-input-box-GL_"+building_names[iter];

				var main_status_update_activity = document.createElement('div');
				main_status_update_activity.className += "main-status-update-activity";

				var main_status_update_activity_post_button  = document.createElement('div');
				main_status_update_activity_post_button.className+="main-status-update-button";
				main_status_update_activity_post_button.innerHTML="Post";

				main_status_update_activity.appendChild(main_status_update_activity_post_button);

				//Status update tyyar !!!
				main_status_update_wrapper.appendChild(main_status_update_title);
				main_status_update_wrapper.appendChild(main_status_update_textarea);
				main_status_update_wrapper.appendChild(main_status_update_activity);


				//Posts container

				var main_post_wrapper = document.createElement('div');
				main_post_wrapper.className +="main-post-container";

				var main_post_rt_post = document.createElement('div');
				main_post_rt_post.className +="main-post-recent-top-post";

				var main_post_recent_post = document.createElement('div');
				main_post_recent_post.className +="main-post-recent clicked";
				main_post_recent_post.id += "recent_story_"+building_names[iter];
				main_post_recent_post.innerHTML = "Recent Stories";

				var main_post_top_post =  document.createElement('div');
				main_post_top_post.className +="main-post-top unclicked";
				main_post_top_post.id += "top_story_"+building_names[iter];	
				main_post_top_post.innerHTML = "Top Stories";

				var main_post_list_wrapper = document.createElement('div');
				main_post_list_wrapper.className+="main-post-list";
				main_post_list_wrapper.id = "PL_"+building_names[iter];

				main_post_rt_post.appendChild(main_post_recent_post);
				main_post_rt_post.appendChild(main_post_top_post);
				// post container tayyar !!!
				main_post_wrapper.appendChild(main_post_rt_post);
				main_post_wrapper.appendChild(main_post_list_wrapper);

				main_activity_wrapper.appendChild(main_notif_wrapper);
				main_activity_wrapper.appendChild(main_status_update_wrapper);
				main_activity_wrapper.appendChild(main_post_wrapper);

				main_activity_wrapper.style.display="none";
				document.body.appendChild(main_activity_wrapper);
			}
			
			loadworld();
			// console.log("above none");
			onclicks(act_user_name,act_user_pic,act_user_pic);
			document.getElementById("loader").style.display="block";
			document.getElementById("logger").style.display="none";
			document.getElementById("reqpass").style.display="none";
			document.getElementById("logout").style.display="block";
			// console.log(":"+act_user_name+": username :Guest:"+act_user_name.localeCompare("Guest ")+": anda panti")
			if(act_user_name.localeCompare("Guest ")!=0){
				// console.log("idhar active user name hai"+act_user_name);
				document.getElementById("cpic").style.display="block";
				document.getElementById("cpass").style.display="block";	
			}
			

}

do_this_post_reload = function(){
	dropmodel("zoot");
	loadworld();
}
do_this_post_nonlogin = function(){
	model("zoot","zoot.obj",1,[0,0,0],0);
	loadworld();
}

$("#login_button").click(function(e){
	var username = $("#loginusername").val();
	var password = $("#loginpassword").val(); 
	// console.log(username+", "+password);
	$.ajax({url:"backend.php?code=100&uid="+username+"&pass="+password}).done(function(data){
		resp=JSON.parse(data.split('\n').join(''));
		if(resp.success==200){

			// console.log("laag in");
			//get notification number !!!
			// document.getElementById('login_info').style.display = 'none';
			do_post_login(resp.fname+" "+resp.lname,resp.img_url);

			
		}else if(resp.success==99){
			// console.log("Already logged in!");
			document.getElementById('login_info').innerHTML = "Already logged in !!!";
			$('#login_info').animate({ top: "+=32" }, 500)
							.animate({ top: "-=32" }, 3500);
			// document.getElementById('login_info').innerHTML = "";							
		}else if (resp.success == 100) {
			document.getElementById('login_info').innerHTML = "Please don't leave the fields empty";
			$('#login_info').animate({ top: "+=32" }, 500)
							.animate({ top: "-=32" }, 3500);
			// document.getElementById('login_info').innerHTML = "";							
		}else if (resp.success == 101) {
			document.getElementById('login_info').innerHTML = "Invalid Username";
			$('#login_info').animate({ top: "+=32" }, 500)
							.animate({ top: "-=32" }, 3500);
			// document.getElementById('login_info').innerHTML = "";							
		}else if (resp.success == 102){
			document.getElementById('login_info').innerHTML = "Invalid Password";
			$('#login_info').animate({ top: "+=32" }, 500)
							.animate({ top: "-=32" }, 3500);
			// document.getElementById('login_info').innerHTML = "";							
		}
	});
});


$('#loginpassword').keypress(function(e) {
    if(e.which == 13) {
    	// console.log("password enter dabaya");
    		var username = $("#loginusername").val();
			var password = $("#loginpassword").val(); 
			// console.log(username+", "+password);
			$.ajax({url:"backend.php?code=100&uid="+username+"&pass="+password}).done(function(data){
				resp=JSON.parse(data.split('\n').join(''));
				if(resp.success==200){

					// console.log("laag in");
					//get notification number !!!
					// document.getElementById('login_info').style.display = 'none';
					do_post_login(resp.fname+" "+resp.lname,resp.img_url);
					// document.getElementById('login_info').innerHTML = "";							
					
				}else if(resp.success==99){
					// console.log("Already logged in!");
					document.getElementById('login_info').innerHTML = "Already logged in !!!";
					$('#login_info').animate({ top: "+=32" }, 500)
									.animate({ top: "-=32" }, 3500);
					// document.getElementById('login_info').innerHTML = "";							
				}else if (resp.success == 100) {
					document.getElementById('login_info').innerHTML = "Please don't leave the fields empty";
					$('#login_info').animate({ top: "+=32" }, 500)
									.animate({ top: "-=32" }, 3500);
					// document.getElementById('login_info').innerHTML = "";							
				}else if (resp.success == 101) {
					document.getElementById('login_info').innerHTML = "Invalid Username";
					$('#login_info').animate({ top: "+=32" }, 500)
									.animate({ top: "-=32" }, 3500);
					// document.getElementById('login_info').innerHTML = "";							
				}else if (resp.success == 102){
					document.getElementById('login_info').innerHTML = "Invalid Password";
					$('#login_info').animate({ top: "+=32" }, 500)
									.animate({ top: "-=32" }, 3500);
					// document.getElementById('login_info').innerHTML = "";							
				}
			});
    }
});


$("#logout").click(function(e){

	$.ajax({url:"backend.php?code=101"}).done(function(data){
		resp=JSON.parse(data.split('\n').join(''));
		if(resp.success==200){
			window.location.replace("http://cadpeer.in/zoot/feedback.php");				
		}
		if(resp.success==99){
			// alert("Already logged in!");
		}
	});

});

$("#cpic").click(function(e){

	if($('#newpassholder').length>0){
		$('#newpassholder').remove();
	}

	if($('#newpiclink').length<1){
		var piclink_holder = document.createElement('div');
		piclink_holder.className = 'piclinkholder';
		piclink_holder.id = 'newpiclink';
		
		var piclinktext = document.createElement('input');
		piclinktext.id = 'piclinktext';
		piclinktext.placeholder = "press-Enter-after pasting image-link , any size";
		piclinktext.className = 'piclinktext';
		piclink_holder.appendChild(piclinktext);

		var piclinkcloser = document.createElement('div');
		piclinkcloser.id='piclinkcloser';
		piclinkcloser.className = 'piclinkcloser';
		piclinkcloser.innerHTML ="X";
		piclink_holder.appendChild(piclinkcloser);

		document.body.appendChild(piclink_holder);
		document.getElementById('newpiclink').style.display="block";
		changebio();	
	}else{
		document.getElementById('newpiclink').style.display="block";
	}
	
});

$('#cpass').click(function(e){

	if($('#newpiclink').length>0){
		$('#newpiclink').remove();
	}

	if($('#newpassholder').length<1){
		var newpass_holder = document.createElement('div');
		newpass_holder.className = "newpassholder";
		newpass_holder.id = "newpassholder";

		var newpass_text = document.createElement('input');
		newpass_text.type = "password";
		newpass_text.placeholder = "press-Enter-after typing new password";
		newpass_text.className = 'newpasstext';
		newpass_text.id='newpasstext';
		newpass_holder.appendChild(newpass_text);

		var newpasscloser = document.createElement('div');
		newpasscloser.id='newpasscloser';
		newpasscloser.className = 'newpasscloser';
		newpasscloser.innerHTML ="X";
		newpass_holder.appendChild(newpasscloser);

		document.body.appendChild(newpass_holder);
		document.getElementById('newpassholder').style.display="block";
		changebio();	
	}else{
		document.getElementById('newpassholder').style.display="block";
	}

});


	$('#feedback').html('<a href="mailto:zoot.sunshine@gmail.com?subject=Feedback about Zoot" text-decoration="none">' + $('#feedback').html() + '</a>');

	$('#inneroptions').slideUp(0);
	$('#feedback_info').hide();
	$('#about_us_info').slideUp(0);
	$('#overlay_window').hide();
	$('#options_btn').click(function(){ 
		$('#inneroptions').slideToggle();
	});

	$('#about_us').click(function(){ 
		$('#overlay_window').show();
		$('#about_us_info').show();
	});

	$('#feedback_info').click(function(){ 
		$('#feedback_info').hide();
		$('#overlay_window').hide();
	});

	$('#close_about').click(function(){ 
		$('#about_us_info').slideUp(200);
		setTimeout(function(){$('#overlay_window').hide()},200);
	});


	$('#overlay_window').click(function(){ 
		$('#feedback_info').hide();
		$('#about_us_info').hide();
		$('#overlay_window').hide();
	});


$('#map_canvas').mouseover(function(){
    // $("p").css("background-color","yellow");
    // console.log("upar");
    // $('#iith-map-img').animate({
    // 	height: '400px',
    // 	width: '350px',
    // },200);
	document.getElementById('iith-map-button').style.zIndex = 110;
	document.getElementById('map_canvas').style.zIndex = 111;
	// $('#iith-map-button').animate({
	// 	height	: '400px',
	// 	width	: '500px',
	// },200);
	$('#map_canvas').animate({
		height	: '400px',
		width	: '500px',
	},100);
	initialise();
  });

$('#map_canvas').mouseout(function(){

    // console.log("neeche");
    // $('#iith-map-img').animate({
    // 	height: '70px',
    // 	width: '70px',
    // },400);
	document.getElementById('iith-map-button').style.zIndex = 111;
	document.getElementById('map_canvas').style.zIndex = 110;
	
 	//	$('#iith-map-button').animate({
	// 	height	: '56px',
	// 	width	: '70px',
	// },200);
	$('#map_canvas').animate({
		height	: '56px',
		width	: '70px',
	},100);
	initialise();
  });

function onetimeload(){
        rearrange = function(){
            var pos1=inscreenxy(1,-1,0.2);
            var pos2 = inscreenxy(-2,-0.75,0.2);
            document.getElementById('logger').style.left=pos1[0]+"px";
            document.getElementById('logger').style.top=pos1[1]+"px";

            document.getElementById('reqpass').style.left=pos2[0]+"px";
            document.getElementById('reqpass').style.top=pos2[1]+"px";

        }
        init("3dbg","console.log");
		if(cdpr.onchange!="rearrangeworld")
        cdpr.onchange="rearrange";
        
            var t=0;
        tour= function(c){
        if (c==0) {
            if (t==0) {
                document.getElementById("frontground").style.background="rgba(256,256,256,0.5)";
                document.getElementById("tut").style.display="block";
                document.getElementById("tuttext").innerHTML="click anywhere and move your mouse"
                t=1;
            }
            else{
                t=0;
                document.getElementById("frontground").style.background="rgba(256,256,256,0)";
                document.getElementById("tut").style.display="none";
            }
        }
        else if (t==1&&c==1) {
            document.getElementById("frontground").style.background="rgba(256,256,256,0)";
            t=2;
        }
        else if (t==2&&c==2) {
            t=3;
        }
        else if (t==2&&c==3) {
            document.getElementById("frontground").style.background="rgba(256,256,256,0.5)";
            document.getElementById("tuttext").innerHTML="No !<br/><br/>We meant, keep it clicked as you move !!"
            t=1;
        }
        else if (t==3&&c==3) {
            document.getElementById("frontground").style.background="rgba(256,256,256,0.5)";
            document.getElementById("tuttext").innerHTML="Nice !<br/><br/>Now do the same with the other mouse button !!"
            t=4;
        }
        else if (t==4&&c==1) {
            document.getElementById("frontground").style.background="rgba(256,256,256,0)";
            t=5;
        }
        else if (t==5&&c==2) {
            t=6;
        }else if (t==5&&c==3) {
            document.getElementById("frontground").style.background="rgba(256,256,256,0.5)";
            document.getElementById("tuttext").innerHTML="No !<br/><br/>We meant, keep it clicked as you move !!"
            t=4;
        }
        else if (t==6&&c==3) {
            document.getElementById("frontground").style.background="rgba(256,256,256,0.5)";
            document.getElementById("tuttext").innerHTML="Great !<br/><br/>That finishes the tutorial !!<br/><br/>You can use zoom in/out using your mouse wheel !<br/>Click on the gear to close this."
            t=7;
        }
    }

	        $('#frontground').mousedown(function(){
	        	tour(1);
	        });
	        $('#frontground').mousemove(function(){
	        	tour(2);
	        });
	        $('#frontground').mouseup(function(){
	        	tour(3);
	        });
	        $('#tinger').click(function(){
	        	tour(0);
	        });
};

function initialise() {
	console.log("Map bharo sajnaaa");
        var map_canvas = document.getElementById('map_canvas');
        var map_options = {
          center: new google.maps.LatLng(17.509280, 78.140479),
          zoom: 18,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        }
        var map = new google.maps.Map(map_canvas, map_options)
};
        
function onloaad(){
	onetimeload();
	initialise();
}
window.onload = onloaad;