var act_user_name="";
var act_user_pic = "";


//var building_names  = new Array("100", "200", "300", "400", "600", "700", "800", "900", "1000", "Music", "Shakti", "TvGym","Cafty", "Rec", "Girl");
//var build_like_name = new Array("1__", "2__", "3__", "4__", "6__", "7__", "8__", "9__", "1___", "music", "shakti", "tvgym","cafty", "rec", "girl");
//var building_nicks  = new Array("100", "200", "Spartans", "400", "600", "Falcons", "800", "900", "1000", "Music", "Shakti", "TvGym","Cafty", "Rec", "Girl");
//var builing_types   = new Array("Series","Series","Series","Series","Series","Series","Series","Series","Series","Room","Mess","Room","Room","Room","Hostel" ) ;

var building_names  = new Array("100", "300", "400","cafty");
var build_like_name = new Array("1__", "3__", "4__", "cafty");
var building_nicks  = new Array("100", "Spartans", "400", "Cafty");
var builing_types   = new Array("Series","Series","Series","Room") ;

var building_posx = new Array("100px", "300px" , "400px", "500px");
var building_posy = new Array("100px", "300px" , "400px", "500px");

$("#login_button").click(function(e){
	var username = $("#loginusername").val();
	var password = $("#loginpassword").val(); 
	// console.log(username+", "+password);
	$.ajax({url:"backend.php?code=100&uid="+username+"&pass="+password}).done(function(data){
		resp=JSON.parse(data.split('\n').join(''));
		if(resp.success==200){
			//hide login
			
			// alert(resp.fname);
			act_user_name=resp.fname+" "+resp.lname;
			act_user_pic = resp.img_url;
			cdpr.onload="makeworldvisible";
			cdpr.onchange = "rearrangeworld";
			// model("400","400.obj",1,[-1,0,0],0);
			// model("300","300.obj",0.2,[1,0,0],0);
			// model("100","100.obj",0.1,[-1,1,0],0);
			// model("cafty","cafty.obj",1,[1,1,0],0);
			model("400","400.obj",0.8,     [-1.4,0.5,0],Math.PI);
			model("300","300.obj",0.15,   [0,2.5,0],Math.PI/2);
			model("100","100.obj",0.08,   [1.7,1.7,0],Math.PI);
			model("cafty","cafty.obj",0.7,[-0.7,0.5,0],0);

			dropmodel("zoot");
			// create hover markers
			for(var iter=0; iter<building_names.length; iter++){
				
				var geo_loc_id = "GL_"+building_names[iter];

				//wrapper
				var geo_wrapper = document.createElement('div');
				geo_wrapper.className += "map-hover-marker";
				geo_wrapper.id = geo_loc_id;
				
				//name
				var series_name = document.createElement('div');
				series_name.className += "name-container";
				var temp = ""+building_nicks[iter];
				series_name.innerHTML = temp;
				
				//admin notif
				var admin_hover = document.createElement('div');
				admin_hover.className +="admin-hover-notif";
				admin_hover.id = "Admin_Num_GL_"+building_names[iter];
				// admin_hover.innerHTML = "10+";

				var admin_hover_text = document.createElement('div');
				admin_hover_text.className +="admin-hover-notif-text";
				admin_hover_text.innerHTML = "10+";
				admin_hover.appendChild(admin_hover_text);
				geo_wrapper.appendChild(series_name);
				geo_wrapper.appendChild(admin_hover);
				geo_wrapper.style.display = "none";
				geo_wrapper.style.top = building_posy[iter];
				geo_wrapper.style.left = building_posx[iter];

				//set their locations !!!

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
				main_status_update_textarea.placeholder ="Share something babu...";
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
			
			//document.getElementById("GL_100").style.top = "100px";
			loadworld();
			console.log("above none");
			onclicks(act_user_name,act_user_pic,act_user_pic);
			console.log("below none");
			// call this onload !!!  makeworldvisible(building_names);
			document.getElementById("loader").style.display="block";
			document.getElementById("logger").style.display="none";
			document.getElementById("logger_out").style.display="block";
		}
		if(resp.success==99){
			console.log("Already logged in!");
		}
	});
});


$("#logout").click(function(e){
	$.ajax({url:"backend.php?code=101"}).done(function(data){
		resp=JSON.parse(data.split('\n').join(''));
		if(resp.success==200){
			document.body.innerHTML="Logged Out";
		}
		if(resp.success==99){
			// alert("Already logged in!");
		}
	});
});


$('#iith-map-button').mouseover(function(){
    // $("p").css("background-color","yellow");
    console.log("upar");
    $('#iith-map-img').animate({
    	height: '400px',
    	width: '350px',
    },200);
  });

$('#iith-map-button').mouseout(function(){
    console.log("neeche");
    $('#iith-map-img').animate({
    	height: '70px',
    	width: '70px',
    },400);
  });