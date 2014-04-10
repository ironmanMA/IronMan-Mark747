var active_location="";
var active_geo_location="";
var active_activity_container="";
var active_activity_container_id="";
var active_geo_location_id_array = new Array("1","2","3","4","5","6","7","8","9");
// var building_namez  = new Array("100", "300", "400","music","tvttgym","girl","cafty","700", "800", "900");
var fb_1logggeIn=0;

var active_admin_notif_index=0;
var active_admin_notif_text_array = new Array();

var active_story_type = "r";//recent

var active_user_name="";
var active_user_pic = "";
var active_user_pic_comment = "";

var width = window.innerWidth;
var height = window.innerHeight;


function onclicks(uname, upic, upiccom){
	dropmodel("zoot");
	active_user_name=uname;
	active_user_pic = upic;
	active_user_pic_comment = upiccom;
	console.log(active_user_name);
	// console.log(active_user_pic);
	// console.log(active_user_pic_comment);
			
	$(document).ready(function(){
	    $('textarea').autosize();   
	    // adjust overlay container height and post_list
	});

		// know which series is being clicked
	// so spawn activity container pertaining to that series
	// console.log("called");

	$('.map-hover-marker').click(function(e) {
		//stop canvas manipulation !!!
		cdpr.listen = false;


		if (active_activity_container.length>0) {
			$(active_activity_container).css('display','none');
			$(active_geo_location).fadeTo(200,1);
		};

	    var geo_loc = $(this).attr('id');
	    active_geo_location="#"+geo_loc;
	    active_location=active_geo_location.substring(4);

	    // converting geolocation to activity container
	    var active_container = geo_loc.substring(3);
	    console.log("Clicked : "+active_geo_location+" at:"+e.pageX+", "+e.pageY+" spawning:"+active_container);
	  	active_activity_container="#AC_"+active_container;
	  	console.log("Active Cotainer is :"+active_activity_container);

	    $(active_geo_location).fadeTo(200,0.1);


	    // get location, adjust, populate,  spawn the container.
	    var finx=0,finy=0;
	    if(e.pageX+500<cdpr.canvas.width){
	    	finx=e.pageX;
	    }else{
	    	finx = e.pageX-500;}

	    if(e.pageY>400){
	    	if((e.pageY+400)<cdpr.canvas.height){
	    		finy = e.pageY-400;
	    	}
		else{
	    		finy=cdpr.canvas.height-720;
			if (finy<10) {
			    finy=10;
			}
	    	}
	    }else{
	    	finy = 10;
	    }

	    //##populate Admin Notifs############################################################################################
	 	
	 	 $.ajax({url:"backend.php?code=107&location="+active_location}).done(function(data){
				resp=JSON.parse(data.split('\n').join(''));
				if(resp.success==200){
					for(var iter=0;iter<resp.admin_posts.length;iter++){
						console.log(resp.admin_posts[iter].ap_text);
						active_admin_notif_text_array.push(resp.admin_posts[iter].ap_text);
					}
					// console.log()
					var admin_notif_text_container_id = "AdminNotif_Text_AC_"+active_activity_container.substring(4);
					console.log("admin post id "+admin_notif_text_container_id);
					if(active_admin_notif_text_array.length>0){
						document.getElementById(admin_notif_text_container_id).innerHTML=active_admin_notif_text_array[active_admin_notif_index];	
						document.getElementById("Admin_Num_"+active_geo_location.substring(1)).innerHTML = active_admin_notif_text_array.length;//setting number of otifications
					}
		 	 		
				}
				if(resp.success==99){
					alert("could not push notifications");
				}
		});

	 	 
	 	 
	    
	    //populate status ######################################################################################

	    var main_post_appendlist_id = "PL_"+active_geo_location.substring(4);
		var required_appendlist_element = document.getElementById(main_post_appendlist_id);

		//change 904, 984 into 9__
		var active_location_like_id=active_geo_location.substring(4);
		if(active_geo_location_id_array.indexOf(active_location_like_id.substring(0,1))>1){
			if(active_location_like_id.length<4){
				active_location_like_id=active_location_like_id.substring(0,1)+"__";
			}else{
				active_location_like_id=active_location_like_id.substring(0,1)+"0__";
			}
		}

		$.ajax({url:"backend.php?code=105&location="+active_location_like_id+"&method="+active_story_type}).done(function(data){
			resp=JSON.parse(data.split('\n').join(''));
			if(resp.success==200){
				required_appendlist_element.innerHTML="";//emptying whats present
				for(var iter=0;iter<resp.posts.length;iter++){
					var post_id =resp.posts[iter].post_id;
					//list element
					var mainpostlist = document.createElement('li');

					//single unit post
					var mainpost = document.createElement('div');
					mainpost.className += 'main-post';

					//main post-poster
					var mpposter =document.createElement('div');
					mpposter.className += 'main-post-poster';
					
					var mpposter_pic = document.createElement('div');//poster pic
					mpposter_pic.className += 'main-post-poster-pic';
					
					var mpposter_pic_img = document.createElement('img');//image tag
					mpposter_pic_img.className +="main-post-poster-pic-img";
					mpposter_pic_img.src = resp.posts[iter].poster_img_url;
					mpposter_pic.appendChild(mpposter_pic_img);//add image
					
					var mpposter_info =document.createElement('div');//info
					mpposter_info.className += 'main-post-poster-info';
					
					var mpposter_info_name = document.createElement('div');//name
					mpposter_info_name.className += 'main-post-poster-name';
					mpposter_info_name.id = "Name_"+resp.posts[iter].post_id;
					mpposter_info_name.innerHTML = resp.posts[iter].poster_name;
					
					var mpposter_info_time = document.createElement('div');//time
					mpposter_info_time.className += 'main-post-poster-time';
					mpposter_info_time.innerHTML =resp.posts[iter].post_time;

					mpposter_info.appendChild(mpposter_info_name); //add name
					mpposter_info.appendChild(mpposter_info_time); //add time stamp

					mpposter.appendChild(mpposter_pic); //add img block
					mpposter.appendChild(mpposter_info); // add guy info

					mainpost.appendChild(mpposter); //

					//main post text
					var mpcontent =document.createElement('div');//text
					mpcontent.className += 'main-post-poster-content';
					mpcontent.id = "PostText_"+resp.posts[iter].post_id;
					var disptext = resp.posts[iter].post_text;
					console.log(disptext);
					disptext = disptext.split('<hash>').join('#');
					console.log(disptext);
					mpcontent.innerHTML +=disptext;//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

					// console.log("post inner text "+)
					mainpost.appendChild(mpcontent); //  adding status

					// main post activity
					var mpactivity = document.createElement('div'); // likes, dis-likes, comment
					mpactivity.className += 'main-post-poster-activity';

					var mpactivity_likes = document.createElement('div'); // likes
					mpactivity_likes.className += 'main-post-poster-activity-likes';
					mpactivity_likes.id = "L_"+resp.posts[iter].post_id;
					
					
					var mpactivity_dis_likes = document.createElement('div'); //dis-likes
					mpactivity_dis_likes.className += 'main-post-poster-activity-dislikes';
					mpactivity_dis_likes.id = "DL_"+resp.posts[iter].post_id;

					if(resp.posts[iter].ifvoted=="n"){
						mpactivity_dis_likes.innerHTML +=resp.posts[iter].downvotes+" <span><img src='images/down.png'></span> "	
						mpactivity_likes.innerHTML +=resp.posts[iter].upvotes+" <span><img src='images/up.png'></span> "
					}else if (resp.posts[iter].ifvoted=="u") {
						mpactivity_dis_likes.innerHTML +=resp.posts[iter].downvotes+" <span><img src='images/down.png'></span> "	
						mpactivity_likes.innerHTML +="liked "+resp.posts[iter].upvotes+" <span><img src='images/up.png'></span> "
					}else if(resp.posts[iter].ifvoted=="d"){
						mpactivity_dis_likes.innerHTML +="disliked "+resp.posts[iter].downvotes+" <span><img src='images/down.png'></span> "	
						mpactivity_likes.innerHTML +=resp.posts[iter].upvotes+" <span><img src='images/up.png'></span> "
					};
					
					
					var mpactivity_comment = document.createElement('div'); // comment
					mpactivity_comment.className += 'main-post-poster-activity-total-comment';
					mpactivity_comment.id = "C_"+resp.posts[iter].post_id;
					mpactivity_comment.innerHTML += resp.posts[iter].comments_count+" <span><img src='images/comment.png'></span> "

					var mpactivity_fshare = document.createElement('div');//fshare
					mpactivity_fshare.className += 'main-post-poster-activity-fshare';
					mpactivity_fshare.id = "Fs_"+resp.posts[iter].post_id;
					mpactivity_fshare.innerHTML = 'f';

					mpactivity.appendChild(mpactivity_likes);//add likes
					mpactivity.appendChild(mpactivity_dis_likes); //add dis-likes
					mpactivity.appendChild(mpactivity_comment); // add comments
					mpactivity.appendChild(mpactivity_fshare);//add facebook

					mainpost.appendChild(mpactivity); // adding activity

					// main post comment list
					var mpcomment_list = document.createElement('div'); //list and then append
					mpcomment_list.className += 'main-post-poster-comment-list';
					mpcomment_list.id = "CList_"+resp.posts[iter].post_id;

					var mpcomment_new_input = document.createElement('div'); //block for new comment
					mpcomment_new_input.className += 'main-post-poster-comment-input';
					mpcomment_new_input.id = "Send_CList_"+resp.posts[iter].post_id;

					var mpcomment_new_input_button = document.createElement('div'); // send button
					mpcomment_new_input_button.className += 'main-post-poster-comment-submit-button';
					mpcomment_new_input_button.innerHTML += "<img src='images/send.png'>";
					mpcomment_new_input_button.id = "NewC_Send_CList_"+resp.posts[iter].post_id;

					var mpcomment_new_input_textarea_box = document.createElement('div'); //textarea for new comment
					mpcomment_new_input_textarea_box.className += 'main-post-poster-comment-input-box';

					mpcomment_new_input_textarea= document.createElement('textarea');
					if(active_user_name.localeCompare("Guest ")==0){
						mpcomment_new_input_textarea.placeholder = "Guests cannot comment...";
					}else{
						mpcomment_new_input_textarea.placeholder = "comment...";	
					}
					
					mpcomment_new_input_textarea.className = "main-post-poster-comment-input-area";

					// mpcomment_new_input_textarea.innerHTML += "<textarea placeholder='comment karna be...' class='main-post-poster-comment-input-area'></textarea>";
					mpcomment_new_input_textarea.id = "NewC_CList_"+resp.posts[iter].post_id;
					mpcomment_new_input_textarea_box.appendChild(mpcomment_new_input_textarea);

					var mpcomment_new_input_pic = document.createElement('div'); // commentor pic
					mpcomment_new_input_pic.className += 'main-post-poster-commenter-pic';
					mpcomment_new_input_pic.innerHTML += "<img class='main-post-poster-commenter-pic-img' src='"+active_user_pic_comment+"'>";//active guuy ka photu

					mpcomment_new_input.appendChild(mpcomment_new_input_button);//added button
					mpcomment_new_input.appendChild(mpcomment_new_input_textarea_box);//added text area
					mpcomment_new_input.appendChild(mpcomment_new_input_pic);//added commentor pic
					
					mpcomment_list.appendChild(mpcomment_new_input); // added new comment to list
					mpcomment_list.style.display = "none";

					mainpost.appendChild(mpcomment_list); // adding list

					mainpostlist.appendChild(mainpost); // added to be inserted

					required_appendlist_element.appendChild(mainpostlist);

				}
				onclicksactivity(uname, upic, upiccom);
				onclickscomments(uname, upic, upiccom);
				facebookapp(uname);showlikes();
			}
			if(resp.success==99){
				alert("could not push status updates notifications");
			}
		});

	    //spawning
	    $(active_activity_container).css({'opacity':'0','display':'block', 'left':finx, 'top':finy});
	    $(active_activity_container).fadeTo(200,1);	

	});


	//hide activity container when clicked outside the div !!!
	// re-initialise some of fields like notif array !!!
	$('.main_overlay_container_close').click(function(e){
		//get back the canvas
		cdpr.listen = true;

		var container_id = this.id;
		container_id = container_id.substring(9);
		$("#AC_"+container_id).hide();
		$("#GL_"+container_id).fadeTo(200,1);
		active_location="";
		active_activity_container="";
		active_activity_container_id="";
		active_geo_location="";
		active_activity_container="";
		active_admin_notif_index=0;
		active_admin_notif_text_array = new Array();
		active_story_type= "r";
	});


	// change notifs when prev button is clicked
	$('.main-admin-notif-prev-button').click(function(e){
		if(active_admin_notif_index==0 && active_admin_notif_text_array.length>1){
			active_admin_notif_index = active_admin_notif_text_array.length-1;
			var admin_notif_text_container_id = "AdminNotif_Text_AC_"+active_location;
	 	 	document.getElementById(admin_notif_text_container_id).innerHTML=active_admin_notif_text_array[active_admin_notif_index];
		}else if(active_admin_notif_index>0 && active_admin_notif_text_array.length>1){
			active_admin_notif_index = active_admin_notif_index-1;
			var admin_notif_text_container_id = "AdminNotif_Text_AC_"+active_location;
	 	 	document.getElementById(admin_notif_text_container_id).innerHTML=active_admin_notif_text_array[active_admin_notif_index];
		}

		console.log("clicked on prev on container "+active_activity_container);
	});

	// change notifs when next button is clicked
	$('.main-admin-notif-next-button').click(function(e){
		if(active_admin_notif_index==active_admin_notif_text_array.length-1 && active_admin_notif_text_array.length>1){
			active_admin_notif_index = 0;
			var admin_notif_text_container_id = "AdminNotif_Text_AC_"+active_location;
	 	 	document.getElementById(admin_notif_text_container_id).innerHTML=active_admin_notif_text_array[active_admin_notif_index];
		}else if(active_admin_notif_index<active_admin_notif_text_array.length-1 && active_admin_notif_text_array.length>1){
			active_admin_notif_index = active_admin_notif_index+1;
			var admin_notif_text_container_id = "AdminNotif_Text_AC_"+active_location;
	 	 	document.getElementById(admin_notif_text_container_id).innerHTML=active_admin_notif_text_array[active_admin_notif_index];
		}

		console.log("clicked on next on container "+active_activity_container);
	});

	// update your status and push to data base !!!
	$('.main-status-update-button').click(function(e){

		if(active_user_name.localeCompare("Guest ")==0){
			// document.getElementById('login_info').innerHTML = "block";
			document.getElementById('login_info').innerHTML = "Currently Guests cannot post on wall";
			$('#login_info').animate({ top: "+=32" }, 500)
							.animate({ top: "-=32" }, 4500);
		}
		var location_status_id = "#main-status-update-text-input-box-"+active_geo_location.substring(1);

		var inputext111 = $(location_status_id);
		var tttext = inputext111[0].value;
		tttext = tttext.split("#").join("<hash>");

		//empty status updates are not entered and guests cannot add status
		if(tttext.length>=1 && active_user_name.localeCompare("Guest ")!=0){
				//send ajax request to update the database, get postid
				$.ajax({url:"backend.php?code=102&post="+tttext+"&location="+active_location}).done(function(data){
					resp=JSON.parse(data.split('\n').join(''));
					console.log(resp);
					if(resp.success==200){
								//if success create div with post-id and prepend it to recent/top-story
						var post_id =resp.post_id;

						//list element
						var mainpostlist = document.createElement('li');

						//single unit post
						var mainpost = document.createElement('div');
						mainpost.className += 'main-post';

						//main post-poster
						var mpposter =document.createElement('div');
						mpposter.className += 'main-post-poster';
						
						var mpposter_pic = document.createElement('div');//poster pic
						mpposter_pic.className += 'main-post-poster-pic';
						
						var mpposter_pic_img = document.createElement('img');//image tag
						mpposter_pic_img.src = active_user_pic;
						mpposter_pic_img.className += 'main-post-poster-pic-img';
						mpposter_pic.appendChild(mpposter_pic_img);//add image
						
						var mpposter_info =document.createElement('div');//info
						mpposter_info.className += 'main-post-poster-info';
						
						var mpposter_info_name = document.createElement('div');//name
						mpposter_info_name.className += 'main-post-poster-name';
						mpposter_info_name.id = "Name_"+post_id;
						mpposter_info_name.innerHTML = active_user_name;
						
						var mpposter_info_time = document.createElement('div');//time
						mpposter_info_time.className += 'main-post-poster-time';
						mpposter_info_time.innerHTML =resp.timer;

						mpposter_info.appendChild(mpposter_info_name); //add name
						mpposter_info.appendChild(mpposter_info_time); //add time stamp

						mpposter.appendChild(mpposter_pic); //add img block
						mpposter.appendChild(mpposter_info); // add guy info

						mainpost.appendChild(mpposter); //

						//main post text
						var mpcontent =document.createElement('div');//text
						mpcontent.className += 'main-post-poster-content';
						mpcontent.innerHTML += inputext111[0].value;//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
						mpcontent.id = "PostText_"+post_id;
						console.log("inhome post text "+mpcontent.innerHTML);
						mainpost.appendChild(mpcontent); //  adding status

						// main post activity
						var mpactivity = document.createElement('div'); // likes, dis-likes, comment
						mpactivity.className += 'main-post-poster-activity';

						var mpactivity_likes = document.createElement('div'); // likes
						mpactivity_likes.className += 'main-post-poster-activity-likes';
						mpactivity_likes.id = "L_"+post_id;
						mpactivity_likes.innerHTML +="0 <span><img src='images/up.png'></span> "
						
						var mpactivity_dis_likes = document.createElement('div'); //dis-likes
						mpactivity_dis_likes.className += 'main-post-poster-activity-dislikes';
						mpactivity_dis_likes.id = "DL_"+post_id;
						mpactivity_dis_likes.innerHTML +="0 <span><img src='images/down.png'></span> "
						
						var mpactivity_comment = document.createElement('div'); // comment
						mpactivity_comment.className += 'main-post-poster-activity-total-comment';
						mpactivity_comment.id = "C_"+post_id;
						mpactivity_comment.innerHTML += "0 <span><img src='images/comment.png'></span> "

						var mpactivity_fshare = document.createElement('div');//fshare
						mpactivity_fshare.className += 'main-post-poster-activity-fshare';
						mpactivity_fshare.id = "Fs_"+post_id;
						mpactivity_fshare.innerHTML = 'f';

						mpactivity.appendChild(mpactivity_likes);//add likes
						mpactivity.appendChild(mpactivity_dis_likes); //add dis-likes
						mpactivity.appendChild(mpactivity_comment); // add comments
						mpactivity.appendChild(mpactivity_fshare); // add fshare

						mainpost.appendChild(mpactivity); // adding activity

						// main post comment list
						var mpcomment_list = document.createElement('div'); //list and then append
						mpcomment_list.className += 'main-post-poster-comment-list';
						mpcomment_list.id = "CList_"+post_id;

						var mpcomment_new_input = document.createElement('div'); //block for new comment
						mpcomment_new_input.className += 'main-post-poster-comment-input';
						mpcomment_new_input.id = "Send_CList_"+post_id;

						var mpcomment_new_input_button = document.createElement('div'); // send button
						mpcomment_new_input_button.className += 'main-post-poster-comment-submit-button';
						mpcomment_new_input_button.innerHTML += "<img src='images/send.png'>";
						mpcomment_new_input_button.id = "NewC_Send_CList_"+post_id;

						var mpcomment_new_input_textarea_box = document.createElement('div'); //textarea for new comment
						mpcomment_new_input_textarea_box.className += 'main-post-poster-comment-input-box';

						mpcomment_new_input_textarea= document.createElement('textarea');
						if(active_user_name.localeCompare("Guest ")==0){
							mpcomment_new_input_textarea.placeholder = "Guests cannot comment...";
						}else{
							mpcomment_new_input_textarea.placeholder = "comment...";	
						}
						
						mpcomment_new_input_textarea.className = "main-post-poster-comment-input-area";

						// mpcomment_new_input_textarea.innerHTML += "<textarea placeholder='comment karna be...' class='main-post-poster-comment-input-area'></textarea>";
						mpcomment_new_input_textarea.id = "NewC_CList_"+post_id;
						mpcomment_new_input_textarea_box.appendChild(mpcomment_new_input_textarea);

						var mpcomment_new_input_pic = document.createElement('div'); // commentor pic
						mpcomment_new_input_pic.className += 'main-post-poster-commenter-pic';
						// mpcomment_new_input_pic.innerHTML += "<img src='images/silvers.png'>";
						mpcomment_new_input_pic.innerHTML += "<img class='main-post-poster-commenter-pic-img' src='"+active_user_pic_comment+"'>";//active guuy ka photu

						mpcomment_new_input.appendChild(mpcomment_new_input_button);//added button
						mpcomment_new_input.appendChild(mpcomment_new_input_textarea_box);//added text area
						mpcomment_new_input.appendChild(mpcomment_new_input_pic);//added commentor pic
						mpcomment_list.appendChild(mpcomment_new_input); // added new comment to list
						mpcomment_list.style.display = "none";
						mainpost.appendChild(mpcomment_list); // adding list

						mainpostlist.appendChild(mainpost); // added to be inserted

						//get the main-post-list-id to be appended
						var main_post_list_id = "PL_"+active_geo_location.substring(4);
						console.log("prepending at "+main_post_list_id);
						var required_element = document.getElementById(main_post_list_id);
						required_element.insertBefore(mainpostlist, required_element.firstChild);		
						onclicksactivity(uname, upic, upiccom);
						onclickscomments(uname, upic, upiccom);
						facebookapp(uname);showlikes();

						// after adding remove the text from the text area !!1
						inputext111[0].value="";
						console.log("updating status: "+ inputext111[0].value +", with location "+ active_geo_location);
					}
					if(resp.success==99){
						alert("did not update");
					}
				});
		}		

		
	});

};

function onclicksactivity(uname, upic, upiccom){

	$(document).ready(function(){
	    $('textarea').autosize();   
	    // adjust overlay container height and post_list
	});

	//toggle top-recent
	$('.main-post-top').click(function(e){
		var story_id = this.id;
		if(active_story_type!="t"){
			console.log("Change to recent");
			active_story_type="t";
			$("#"+story_id).removeClass('unclicked');
			$("#"+story_id).addClass('clicked');

			$("#recent"+story_id.substring(3)).removeClass('clicked');
			$("#recent"+story_id.substring(3)).addClass('unclicked');

			var main_post_appendlist_id = "PL_"+active_geo_location.substring(4);
			var required_appendlist_element = document.getElementById(main_post_appendlist_id);
			required_appendlist_element.innerHTML="";

			//change 904, 984 into 9__
			var active_location_like_id=active_geo_location.substring(4);
			if(active_geo_location_id_array.indexOf(active_location_like_id.substring(0,1))>1){
				if(active_location_like_id.length<4){
					active_location_like_id=active_location_like_id.substring(0,1)+"__";
				}else{
					active_location_like_id=active_location_like_id.substring(0,1)+"0__";
				}
			}

			$.ajax({url:"backend.php?code=105&location="+active_location_like_id+"&method="+active_story_type}).done(function(data){
				resp=JSON.parse(data.split('\n').join(''));
				if(resp.success==200){
					required_appendlist_element.innerHTML="";//emptying whats present
					for(var iter=0;iter<resp.posts.length;iter++){
						var post_id =resp.posts[iter].post_id;
						//list element
						var mainpostlist = document.createElement('li');

						//single unit post
						var mainpost = document.createElement('div');
						mainpost.className += 'main-post';

						//main post-poster
						var mpposter =document.createElement('div');
						mpposter.className += 'main-post-poster';
						
						var mpposter_pic = document.createElement('div');//poster pic
						mpposter_pic.className += 'main-post-poster-pic';
						
						var mpposter_pic_img = document.createElement('img');//image tag
						mpposter_pic_img.className +="main-post-poster-pic-img";
						mpposter_pic_img.src = resp.posts[iter].poster_img_url;
						mpposter_pic.appendChild(mpposter_pic_img);//add image
						
						var mpposter_info =document.createElement('div');//info
						mpposter_info.className += 'main-post-poster-info';
						
						var mpposter_info_name = document.createElement('div');//name
						mpposter_info_name.className += 'main-post-poster-name';
						mpposter_info_name.id = "Name_"+resp.posts[iter].post_id;
						mpposter_info_name.innerHTML = resp.posts[iter].poster_name;
						
						var mpposter_info_time = document.createElement('div');//time
						mpposter_info_time.className += 'main-post-poster-time';
						mpposter_info_time.innerHTML =resp.posts[iter].post_time;

						mpposter_info.appendChild(mpposter_info_name); //add name
						mpposter_info.appendChild(mpposter_info_time); //add time stamp

						mpposter.appendChild(mpposter_pic); //add img block
						mpposter.appendChild(mpposter_info); // add guy info

						mainpost.appendChild(mpposter); //

						//main post text
						var mpcontent =document.createElement('div');//text
						mpcontent.className += 'main-post-poster-content';
						mpcontent.innerHTML += resp.posts[iter].post_text.split("<hash>").join("#");//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
						mpcontent.id = "PostText_"+resp.posts[iter].post_id;					
						// console.log("post inner text "+)
						mainpost.appendChild(mpcontent); //  adding status

						// main post activity
						var mpactivity = document.createElement('div'); // likes, dis-likes, comment
						mpactivity.className += 'main-post-poster-activity';

						var mpactivity_likes = document.createElement('div'); // likes
						mpactivity_likes.className += 'main-post-poster-activity-likes';
						mpactivity_likes.id = "L_"+resp.posts[iter].post_id;
						
						
						var mpactivity_dis_likes = document.createElement('div'); //dis-likes
						mpactivity_dis_likes.className += 'main-post-poster-activity-dislikes';
						mpactivity_dis_likes.id = "DL_"+resp.posts[iter].post_id;

						if(resp.posts[iter].ifvoted=="n"){
							mpactivity_dis_likes.innerHTML +=resp.posts[iter].downvotes+" <span><img src='images/down.png'></span> "	
							mpactivity_likes.innerHTML +=resp.posts[iter].upvotes+" <span><img src='images/up.png'></span> "
						}else if (resp.posts[iter].ifvoted=="u") {
							mpactivity_dis_likes.innerHTML +=resp.posts[iter].downvotes+" <span><img src='images/down.png'></span> "	
							mpactivity_likes.innerHTML +="liked "+resp.posts[iter].upvotes+" <span><img src='images/up.png'></span> "
						}else if(resp.posts[iter].ifvoted=="d"){
							mpactivity_dis_likes.innerHTML +="disliked "+resp.posts[iter].downvotes+" <span><img src='images/down.png'></span> "	
							mpactivity_likes.innerHTML +=resp.posts[iter].upvotes+" <span><img src='images/up.png'></span> "
						};
						
						
						var mpactivity_comment = document.createElement('div'); // comment
						mpactivity_comment.className += 'main-post-poster-activity-total-comment';
						mpactivity_comment.id = "C_"+resp.posts[iter].post_id;
						mpactivity_comment.innerHTML += resp.posts[iter].comments_count+" <span><img src='images/comment.png'></span> "

						var mpactivity_fshare = document.createElement('div');//fshare
						mpactivity_fshare.className += 'main-post-poster-activity-fshare';
						mpactivity_fshare.id = "Fs_"+resp.posts[iter].post_id;
						mpactivity_fshare.innerHTML = 'f';

						mpactivity.appendChild(mpactivity_likes);//add likes
						mpactivity.appendChild(mpactivity_dis_likes); //add dis-likes
						mpactivity.appendChild(mpactivity_comment); // add comments
						mpactivity.appendChild(mpactivity_fshare);//add fshare

						mainpost.appendChild(mpactivity); // adding activity

						// main post comment list
						var mpcomment_list = document.createElement('div'); //list and then append
						mpcomment_list.className += 'main-post-poster-comment-list';
						mpcomment_list.id = "CList_"+resp.posts[iter].post_id;

						var mpcomment_new_input = document.createElement('div'); //block for new comment
						mpcomment_new_input.className += 'main-post-poster-comment-input';
						mpcomment_new_input.id = "Send_CList_"+resp.posts[iter].post_id;

						var mpcomment_new_input_button = document.createElement('div'); // send button
						mpcomment_new_input_button.className += 'main-post-poster-comment-submit-button';
						mpcomment_new_input_button.innerHTML += "<img src='images/send.png'>";
						mpcomment_new_input_button.id = "NewC_Send_CList_"+resp.posts[iter].post_id;

						var mpcomment_new_input_textarea_box = document.createElement('div'); //textarea for new comment
						mpcomment_new_input_textarea_box.className += 'main-post-poster-comment-input-box';

						mpcomment_new_input_textarea= document.createElement('textarea');
						if(active_user_name.localeCompare("Guest ")==0){
							mpcomment_new_input_textarea.placeholder = "Guests cannot comment...";
						}else{
							mpcomment_new_input_textarea.placeholder = "comment...";
						}
						
						mpcomment_new_input_textarea.className = "main-post-poster-comment-input-area";

						// mpcomment_new_input_textarea.innerHTML += "<textarea placeholder='comment karna be...' class='main-post-poster-comment-input-area'></textarea>";
						mpcomment_new_input_textarea.id = "NewC_CList_"+resp.posts[iter].post_id;
						mpcomment_new_input_textarea_box.appendChild(mpcomment_new_input_textarea);

						var mpcomment_new_input_pic = document.createElement('div'); // commentor pic
						mpcomment_new_input_pic.className += 'main-post-poster-commenter-pic';
						mpcomment_new_input_pic.innerHTML += "<img class='main-post-poster-commenter-pic-img' src='"+active_user_pic_comment+"'>";//active guuy ka photu

						mpcomment_new_input.appendChild(mpcomment_new_input_button);//added button
						mpcomment_new_input.appendChild(mpcomment_new_input_textarea_box);//added text area
						mpcomment_new_input.appendChild(mpcomment_new_input_pic);//added commentor pic
						mpcomment_list.appendChild(mpcomment_new_input); // added new comment to list
						mpcomment_list.style.display = "none";

						mainpost.appendChild(mpcomment_list); // adding list

						mainpostlist.appendChild(mainpost); // added to be inserted

						required_appendlist_element.appendChild(mainpostlist);

					}
					onclicksactivity(uname, upic, upiccom);
					facebookapp(uname);showlikes();
				}
				if(resp.success==99){
					alert("could not push status updates notifications");
				}
			});
		}

	});

	//toggle recent-top
	$('.main-post-recent').click(function(e){
		var story_id = this.id;
		if(active_story_type!="r"){
			console.log("Change to top");
			active_story_type="r";
			$("#"+story_id).removeClass('unclicked');
			$("#"+story_id).addClass('clicked');

			$("#top"+story_id.substring(6)).removeClass('clicked');
			$("#top"+story_id.substring(6)).addClass('unclicked');

			var main_post_appendlist_id = "PL_"+active_geo_location.substring(4);
			var required_appendlist_element = document.getElementById(main_post_appendlist_id);
			required_appendlist_element.innerHTML="";

			//change 904, 984 into 9__
			var active_location_like_id=active_geo_location.substring(4);
			if(active_geo_location_id_array.indexOf(active_location_like_id.substring(0,1))>1){
				if(active_location_like_id.length<4){
					active_location_like_id=active_location_like_id.substring(0,1)+"__";
				}else{
					active_location_like_id=active_location_like_id.substring(0,1)+"0__";
				}
			}

			$.ajax({url:"backend.php?code=105&location="+active_location_like_id+"&method="+active_story_type}).done(function(data){
				resp=JSON.parse(data.split('\n').join(''));
				if(resp.success==200){
					required_appendlist_element.innerHTML="";//emptying whats present
					for(var iter=0;iter<resp.posts.length;iter++){
						var post_id =resp.posts[iter].post_id;
						//list element
						var mainpostlist = document.createElement('li');

						//single unit post
						var mainpost = document.createElement('div');
						mainpost.className += 'main-post';

						//main post-poster
						var mpposter =document.createElement('div');
						mpposter.className += 'main-post-poster';
						
						var mpposter_pic = document.createElement('div');//poster pic
						mpposter_pic.className += 'main-post-poster-pic';
						
						var mpposter_pic_img = document.createElement('img');//image tag
						mpposter_pic_img.className +="main-post-poster-pic-img";
						mpposter_pic_img.src = resp.posts[iter].poster_img_url;
						mpposter_pic.appendChild(mpposter_pic_img);//add image
						
						var mpposter_info =document.createElement('div');//info
						mpposter_info.className += 'main-post-poster-info';
						
						var mpposter_info_name = document.createElement('div');//name
						mpposter_info_name.className += 'main-post-poster-name';
						mpposter_info_name.id = "Name_"+resp.posts[iter].post_id;
						mpposter_info_name.innerHTML = resp.posts[iter].poster_name;
						
						var mpposter_info_time = document.createElement('div');//time
						mpposter_info_time.className += 'main-post-poster-time';
						mpposter_info_time.innerHTML =resp.posts[iter].post_time;

						mpposter_info.appendChild(mpposter_info_name); //add name
						mpposter_info.appendChild(mpposter_info_time); //add time stamp

						mpposter.appendChild(mpposter_pic); //add img block
						mpposter.appendChild(mpposter_info); // add guy info

						mainpost.appendChild(mpposter); //

						//main post text
						var mpcontent =document.createElement('div');//text
						mpcontent.className += 'main-post-poster-content';
						mpcontent.innerHTML += resp.posts[iter].post_text.split("<hash>").join("#");//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
						mpcontent.id = "PostText_"+resp.posts[iter].post_id;
						// console.log("post inner text "+)
						mainpost.appendChild(mpcontent); //  adding status

						// main post activity
						var mpactivity = document.createElement('div'); // likes, dis-likes, comment
						mpactivity.className += 'main-post-poster-activity';

						var mpactivity_likes = document.createElement('div'); // likes
						mpactivity_likes.className += 'main-post-poster-activity-likes';
						mpactivity_likes.id = "L_"+resp.posts[iter].post_id;
						
						
						var mpactivity_dis_likes = document.createElement('div'); //dis-likes
						mpactivity_dis_likes.className += 'main-post-poster-activity-dislikes';
						mpactivity_dis_likes.id = "DL_"+resp.posts[iter].post_id;

						if(resp.posts[iter].ifvoted=="n"){
							mpactivity_dis_likes.innerHTML +=resp.posts[iter].downvotes+" <span><img src='images/down.png'></span> "	
							mpactivity_likes.innerHTML +=resp.posts[iter].upvotes+" <span><img src='images/up.png'></span> "
						}else if (resp.posts[iter].ifvoted=="u") {
							mpactivity_dis_likes.innerHTML +=resp.posts[iter].downvotes+" <span><img src='images/down.png'></span> "	
							mpactivity_likes.innerHTML +="liked "+resp.posts[iter].upvotes+" <span><img src='images/up.png'></span> "
						}else if(resp.posts[iter].ifvoted=="d"){
							mpactivity_dis_likes.innerHTML +="disliked "+resp.posts[iter].downvotes+" <span><img src='images/down.png'></span> "	
							mpactivity_likes.innerHTML +=resp.posts[iter].upvotes+" <span><img src='images/up.png'></span> "
						};
						
						
						var mpactivity_comment = document.createElement('div'); // comment
						mpactivity_comment.className += 'main-post-poster-activity-total-comment';
						mpactivity_comment.id = "C_"+resp.posts[iter].post_id;
						mpactivity_comment.innerHTML += resp.posts[iter].comments_count+" <span><img src='images/comment.png'></span> "

						var mpactivity_fshare = document.createElement('div');//fshare
						mpactivity_fshare.className += 'main-post-poster-activity-fshare';
						mpactivity_fshare.id = "Fs_"+resp.posts[iter].post_id;
						mpactivity_fshare.innerHTML = 'f';

						mpactivity.appendChild(mpactivity_likes);//add likes
						mpactivity.appendChild(mpactivity_dis_likes); //add dis-likes
						mpactivity.appendChild(mpactivity_comment); // add comments
						mpactivity.appendChild(mpactivity_fshare);//add fshare

						mainpost.appendChild(mpactivity); // adding activity

						// main post comment list
						var mpcomment_list = document.createElement('div'); //list and then append
						mpcomment_list.className += 'main-post-poster-comment-list';
						mpcomment_list.id = "CList_"+resp.posts[iter].post_id;

						var mpcomment_new_input = document.createElement('div'); //block for new comment
						mpcomment_new_input.className += 'main-post-poster-comment-input';
						mpcomment_new_input.id = "Send_CList_"+resp.posts[iter].post_id;

						var mpcomment_new_input_button = document.createElement('div'); // send button
						mpcomment_new_input_button.className += 'main-post-poster-comment-submit-button';
						mpcomment_new_input_button.innerHTML += "<img src='images/send.png'>";
						mpcomment_new_input_button.id = "NewC_Send_CList_"+resp.posts[iter].post_id;

						var mpcomment_new_input_textarea_box = document.createElement('div'); //textarea for new comment
						mpcomment_new_input_textarea_box.className += 'main-post-poster-comment-input-box';

						mpcomment_new_input_textarea= document.createElement('textarea');
						if(active_user_name.localeCompare("Guest ")==0){	
							mpcomment_new_input_textarea.placeholder = "Guests cannot comment...";
						}else{
							mpcomment_new_input_textarea.placeholder = "comment...";	
						}
						
						mpcomment_new_input_textarea.className = "main-post-poster-comment-input-area";

						// mpcomment_new_input_textarea.innerHTML += "<textarea placeholder='comment karna be...' class='main-post-poster-comment-input-area'></textarea>";
						mpcomment_new_input_textarea.id = "NewC_CList_"+resp.posts[iter].post_id;
						mpcomment_new_input_textarea_box.appendChild(mpcomment_new_input_textarea);

						var mpcomment_new_input_pic = document.createElement('div'); // commentor pic
						mpcomment_new_input_pic.className += 'main-post-poster-commenter-pic';
						mpcomment_new_input_pic.innerHTML += "<img class='main-post-poster-commenter-pic-img' src='"+active_user_pic_comment+"'>";//active guuy ka photu

						mpcomment_new_input.appendChild(mpcomment_new_input_button);//added button
						mpcomment_new_input.appendChild(mpcomment_new_input_textarea_box);//added text area
						mpcomment_new_input.appendChild(mpcomment_new_input_pic);//added commentor pic
						mpcomment_list.appendChild(mpcomment_new_input); // added new comment to list
						mpcomment_list.style.display = "none";
						mainpost.appendChild(mpcomment_list); // adding list

						mainpostlist.appendChild(mainpost); // added to be inserted

						required_appendlist_element.appendChild(mainpostlist);

					}
					onclicksactivity(uname, upic, upiccom);facebookapp(uname);showlikes();
				}
				if(resp.success==99){
					alert("could not push status updates notifications");
				}
			});
		}
	});

	// status likes
	$('.main-post-poster-activity-likes').click(function(e){
		console.log("statussslikes");
		//ajax request to update database
		var clciked_id = this.id;
		var inn = document.getElementById(this.id).innerHTML;
		console.log(inn);
		var dlid = "D"+this.id;
		var inn2 = document.getElementById(dlid).innerHTML;
		console.log(inn2);

		//no like or dis-like
		if(inn.charAt(0)!='l' && inn2.charAt(0)!='d'){//now like
			$.ajax({url:"backend.php?code=104&post_id="+clciked_id.substring(2)+"&uord=u"}).done(function(data){
					resp=JSON.parse(data.split('\n').join(''));
					if(resp.success==200){
						// alert(resp.fname);
						for(var i=0;i<inn.length;i++){
							if(inn.charAt(i)=='<'){
							var num = parseInt(inn.substring(0,i));
							num++;
							
							inn = "liked "+num+" "+inn.substring(i);
							
							document.getElementById(clciked_id).innerHTML = inn;
							console.log(clciked_id+", "+document.getElementById(clciked_id).innerHTML);
							break;
							}			
						}

					}
					if(resp.success==99){
						console.log("could not register up vote");
					}
				});
		}else if(inn2.charAt(0)=='d'){//already dislikes
			//decrease dislikes and send ajax for new-likes
			$.ajax({url:"backend.php?code=104&post_id="+clciked_id.substring(2)+"&uord=u"}).done(function(data){
					resp=JSON.parse(data.split('\n').join(''));
					if(resp.success==200){
						// increase likes and decrease dis-likes
						for(var i=0;i<inn.length;i++){
							if(inn.charAt(i)=='<'){
							var num = parseInt(inn.substring(0,i));
							num++;
							
							inn = "liked "+num+" "+inn.substring(i);
							
							document.getElementById(clciked_id).innerHTML = inn;
							console.log(clciked_id+", Increasing Likes "+document.getElementById(clciked_id).innerHTML);
							
							//decrease dislikes
							inn2 = inn2.substring(8);
							for( var j =0;j<inn2.length;j++){
								if(inn2.charAt(j)=='<'){
									var num = parseInt(inn2.substring(0,j));
									num--;
									inn2 = num+" "+inn2.substring(j);	
									document.getElementById(dlid).innerHTML = inn2;
									console.log(clciked_id+", Decreasing dis-likes "+document.getElementById(clciked_id).innerHTML);
									break;	
								}
							}							
							break;
							}			
						}
					}
					if(resp.success==99){
						console.log("could not register up vote");
					}
				});

		}else if(inn.charAt(0)=='l'){// already likes
			//decrease likes thats all

			$.ajax({url:"backend.php?code=104&post_id="+clciked_id.substring(2)+"&uord=n"}).done(function(data){
				resp=JSON.parse(data.split('\n').join(''));
				if(resp.success==200){
					inn = inn.substring(5);
					//decrease likes
					for(var i=0;i<inn.length;i++){
							if(inn.charAt(i)=='<'){
							var num = parseInt(inn.substring(0,i));
							num--;
							
							inn = " "+num+" "+inn.substring(i);
							document.getElementById(clciked_id).innerHTML = inn;
							break;
						}
					}
				}
			});

		}
	});

	//status dis-likes
	$('.main-post-poster-activity-dislikes').click(function(e){
		console.log("dissylike");
		//ajax request to update this on success
		var clciked_id = this.id;
		var inn = document.getElementById(this.id).innerHTML;
		var dlid = this.id.substring(1);
		var inn2 = document.getElementById(dlid).innerHTML;


		//no like or dis-like
		if(inn2.charAt(0)!='l' && inn.charAt(0)!='d'){//now dis-like
			console.log("not disliked till now : "+clciked_id);
			$.ajax({url:"backend.php?code=104&post_id="+clciked_id.substring(3)+"&uord=d"}).done(function(data){
					resp=JSON.parse(data.split('\n').join(''));
					if(resp.success==200){
						// alert(resp.fname);
						for(var i=0;i<inn.length;i++){
							if(inn.charAt(i)=='<'){
							var num = parseInt(inn.substring(0,i));
							num++;
							
							inn = "disliked "+num+" "+inn.substring(i);
							
							document.getElementById(clciked_id).innerHTML = inn;
							console.log(clciked_id+", "+document.getElementById(clciked_id).innerHTML);
							break;
							}			
						}

					}
					if(resp.success==99){
						console.log("could not register up vote");
					}
				});
		}else if(inn2.charAt(0)=='l'){//already likes
			console.log("alredy liked"+clciked_id);
			//decrease likes and send ajax for new-dis-likes
			$.ajax({url:"backend.php?code=104&post_id="+clciked_id.substring(3)+"&uord=d"}).done(function(data){
					resp=JSON.parse(data.split('\n').join(''));
					if(resp.success==200){
						// increase dis-likes and decrease likes
						for(var i=0;i<inn.length;i++){
							if(inn.charAt(i)=='<'){
							var num = parseInt(inn.substring(0,i));
							num++;
							
							inn = "disliked "+num+" "+inn.substring(i);
							
							document.getElementById(clciked_id).innerHTML = inn;
							console.log(clciked_id+", Increasing dislikes "+document.getElementById(clciked_id).innerHTML);
							
							//decrease likes
							inn2 = inn2.substring(5);
							for( var j =0;j<inn2.length;j++){
								if(inn2.charAt(j)=='<'){
									var num = parseInt(inn2.substring(0,j));
									num--;
									inn2 = num+" "+inn2.substring(j);	
									document.getElementById(dlid).innerHTML = inn2;
									console.log(clciked_id+", Decreasing likes "+document.getElementById(clciked_id).innerHTML);
									break;	
								}
							}							
							break;
							}			
						}



					}
					if(resp.success==99){
						console.log("could not register up vote");
					}
				});

		}else if(inn.charAt(0)=='d'){// already likes
			//decrease likes thats all

			$.ajax({url:"backend.php?code=104&post_id="+clciked_id.substring(3)+"&uord=n"}).done(function(data){
				resp=JSON.parse(data.split('\n').join(''));
				if(resp.success==200){
					//decrease likes
					inn = inn.substring(8);
					for(var i=0;i<inn.length;i++){
							if(inn.charAt(i)=='<'){
							var num = parseInt(inn.substring(0,i));
							num--;
							
							inn = " "+num+" "+inn.substring(i);
							document.getElementById(clciked_id).innerHTML = inn;
							break;
						}
					}
				}
			});

		}

	});

	//view comments of a status
	$('.main-post-poster-activity-total-comment').click(function(e){
		console.log(this.id+" , "+ active_activity_container);
		// ajax request to load comments nd show by un-hiding   main-post-comment-list
		var ide = this.id;
		 	ide = ide.substring(2);//post id
		console.log(ide);
		var commentlist_ide = document.getElementById("CList_"+ide);
		commentlist_ide.style.display = "block";
		commentlist_ide.innerHTML="";//empty before giving
		//add new comment
		var mpcomment_new_input = document.createElement('div'); //block for new comment
		mpcomment_new_input.className += 'main-post-poster-comment-input';
		mpcomment_new_input.id = "Send_CList_"+ide;

		var mpcomment_new_input_button = document.createElement('div'); // send button
		mpcomment_new_input_button.className += 'main-post-poster-comment-submit-button';
		mpcomment_new_input_button.innerHTML += "<img src='images/send.png'>";
		mpcomment_new_input_button.id = "NewC_Send_CList_"+ide;

		var mpcomment_new_input_textarea_box = document.createElement('div'); //textarea for new comment
		mpcomment_new_input_textarea_box.className += 'main-post-poster-comment-input-box';

		mpcomment_new_input_textarea= document.createElement('textarea');
		if(active_user_name.localeCompare("Guest ")==0){
			mpcomment_new_input_textarea.placeholder = "Guests cannot comment...";
		}else{
			mpcomment_new_input_textarea.placeholder = "comment...";	
		}
		
		mpcomment_new_input_textarea.className = "main-post-poster-comment-input-area";

		// mpcomment_new_input_textarea.innerHTML += "<textarea placeholder='comment karna be...' class='main-post-poster-comment-input-area'></textarea>";
		mpcomment_new_input_textarea.id = "NewC_CList_"+ide;
		mpcomment_new_input_textarea_box.appendChild(mpcomment_new_input_textarea);

		var mpcomment_new_input_pic = document.createElement('div'); // commentor pic
		mpcomment_new_input_pic.className += 'main-post-poster-commenter-pic';
		mpcomment_new_input_pic.innerHTML += "<img class='main-post-poster-commenter-pic-img' src='"+active_user_pic_comment+"'>";//active guuy ka photu

		mpcomment_new_input.appendChild(mpcomment_new_input_button);//added button
		mpcomment_new_input.appendChild(mpcomment_new_input_textarea_box);//added text area
		mpcomment_new_input.appendChild(mpcomment_new_input_pic);//added commentor pic
		commentlist_ide.appendChild(mpcomment_new_input);

		//load by ajax request !!!
		$.ajax({url:"backend.php?code=106&post_id="+ide}).done(function(data){
			resp=JSON.parse(data.split('\n').join(''));
			if(resp.success==200){
				// alert(resp.fname);
				for(var iter=resp.comments.length-1;iter>=0;iter--){
					//add each comment to list
					var comment_main_wrapper = document.createElement('div');
					comment_main_wrapper.className += "main-post-poster-comment";
					comment_main_wrapper.id = resp.comments[iter].com_id;

					var commenter_pic = document.createElement('div');
					commenter_pic.className += "main-post-poster-comment-pic";
					var commenter_pic_img = document.createElement('img');
					commenter_pic_img.src = resp.comments[iter].commentor_img_url;
					commenter_pic_img.className +="main-post-poster-comment-pic-img";
					commenter_pic.appendChild(commenter_pic_img);

					var commenter_text = document.createElement('div');
					commenter_text.className +="main-post-poster-comment-content";
					commenter_text.id = "CPostText_"+resp.comments[iter].com_id;
					var commenter_name = document.createElement('a');
					commenter_name.className += "main-post-poster-commenter-name";
					commenter_name.id = "CName_"+resp.comments[iter].com_id;
					commenter_name.innerHTML += resp.comments[iter].commentor_name;
					commenter_text.appendChild(commenter_name);
					commenter_text.innerHTML += " " +resp.comments[iter].comment_text.split("<hash>").join("#");

					var post_commenter_activity = document.createElement('div');
					post_commenter_activity.className += 'main-post-poster-comment-activity';

					var post_commenter_activity_time = document.createElement('div');
					post_commenter_activity_time.className += 'main-post-poster-comment-time';
					post_commenter_activity_time.innerHTML += resp.comments[iter].post_time;

					var post_commenter_activity_likes = document.createElement('div');
					post_commenter_activity_likes.className += 'main-post-poster-comment-likes';
					post_commenter_activity_likes.id = "L_CList_"+resp.comments[iter].com_id;

					var post_commenter_activity_dislikes = document.createElement('div');
					post_commenter_activity_dislikes.className += 'main-post-poster-comment-dislikes';
					post_commenter_activity_dislikes.id = "DL_CList_"+resp.comments[iter].com_id;

					var post_commenter_activity_fshare = document.createElement('div');
					post_commenter_activity_fshare.className = 'main-post-poster-comment-fshare';
					post_commenter_activity_fshare.id = "Fs_CList_"+resp.comments[iter].com_id;
					post_commenter_activity_fshare.innerHTML = 'f';

					if(resp.comments[iter].ifvoted == "n"){
						post_commenter_activity_likes.innerHTML += resp.comments[iter].upvotes+" <span><img src='images/up.png'></span>";		
						post_commenter_activity_dislikes.innerHTML += resp.comments[iter].downvotes+" <span><img src='images/down.png'></span>";
					}else if (resp.comments[iter].ifvoted == "u") {
						post_commenter_activity_likes.innerHTML += "liked "+resp.comments[iter].upvotes+" <span><img src='images/up.png'></span>";		
						post_commenter_activity_dislikes.innerHTML += resp.comments[iter].downvotes+" <span><img src='images/down.png'></span>";
					}else if (resp.comments[iter].ifvoted=="d") {
						post_commenter_activity_likes.innerHTML += resp.comments[iter].upvotes+" <span><img src='images/up.png'></span>";		
						post_commenter_activity_dislikes.innerHTML += "disliked "+resp.comments[iter].downvotes+" <span><img src='images/down.png'></span>";
					};

					post_commenter_activity.appendChild(post_commenter_activity_time);
					post_commenter_activity.appendChild(post_commenter_activity_likes);
					post_commenter_activity.appendChild(post_commenter_activity_dislikes);
					post_commenter_activity.appendChild(post_commenter_activity_fshare);

					comment_main_wrapper.appendChild(commenter_pic);
					comment_main_wrapper.appendChild(commenter_text);
					comment_main_wrapper.appendChild(post_commenter_activity);

					// commentlist_ide.appendChild(comment_main_wrapper);
					var input_dabba = document.getElementById("Send_CList_"+ide);
					commentlist_ide.insertBefore(comment_main_wrapper,input_dabba );

				}

				onclickscomments(uname, upic, upiccom);facebookapp(uname);showlikes();
			}
			if(resp.success==99){
				alert("could not load comments");
			}
		});
		
		// element.style.display = "block";

	});

};

function onclickscomments(uname, upic, upiccom){

	console.log("commentinering");

	$(document).ready(function(){
	    $('textarea').autosize();   
	    // adjust overlay container height and post_list
	});

	// like on comment 
	$('.main-post-poster-comment-likes').click(function(e){
		console.log("comment likeee");
		//ajax request to update database
		var comm_id = this.id;
		var inn = document.getElementById(this.id).innerHTML;
		// console.log(inn);
		var dlid = "D"+this.id;
		var inn2 = document.getElementById(dlid).innerHTML;
		// console.log(inn2);

				//no like or dis-like
		if(inn.charAt(0)!='l' && inn2.charAt(0)!='d'){//now like
			$.ajax({url:"backend.php?code=104&post_id="+comm_id.substring(8)+"&uord=u"}).done(function(data){
					resp=JSON.parse(data.split('\n').join(''));
					if(resp.success==200){
						// alert(resp.fname);
						for(var i=0;i<inn.length;i++){
							if(inn.charAt(i)=='<'){
							var num = parseInt(inn.substring(0,i));
							num++;
							
							inn = "liked "+num+" "+inn.substring(i);
							
							document.getElementById(comm_id).innerHTML = inn;
							break;
							}			
						}

					}
					if(resp.success==99){
						console.log("could not register up vote");
					}
				});
		}else if(inn2.charAt(0)=='d'){//already dislikes
			//decrease dislikes and send ajax for new-likes
			$.ajax({url:"backend.php?code=104&post_id="+comm_id.substring(8)+"&uord=u"}).done(function(data){
					resp=JSON.parse(data.split('\n').join(''));
					if(resp.success==200){
						// increase likes and decrease dis-likes
						for(var i=0;i<inn.length;i++){
							if(inn.charAt(i)=='<'){
							var num = parseInt(inn.substring(0,i));
							num++;
							
							inn = "liked "+num+" "+inn.substring(i);
							
							document.getElementById(comm_id).innerHTML = inn;
							
							//decrease dislikes
							inn2 = inn2.substring(8);
							for( var j =0;j<inn2.length;j++){
								if(inn2.charAt(j)=='<'){
									var num = parseInt(inn2.substring(0,j));
									num--;
									inn2 = num+" "+inn2.substring(j);	
									document.getElementById(dlid).innerHTML = inn2;
									break;	
								}
							}							
							break;
							}			
						}
					}
					if(resp.success==99){
						console.log("could not register up vote");
					}
				});

		}else if (inn.charAt(0)=='l') {//already likes
			$.ajax({url:"backend.php?code=104&post_id="+comm_id.substring(8)+"&uord=n"}).done(function(data){
					resp=JSON.parse(data.split('\n').join(''));
					if(resp.success==200){
						inn = inn.substring(5);
						// increase likes and decrease dis-likes
						for(var i=0;i<inn.length;i++){
							if(inn.charAt(i)=='<'){
							var num = parseInt(inn.substring(0,i));
							num--;
							
							inn = " "+num+" "+inn.substring(i);
							
							document.getElementById(comm_id).innerHTML = inn;					
							break;
							}			
						}
					}
					if(resp.success==99){
						console.log("could not register up vote");
					}
				});
		}

	});

	//dis-like on comment
	$('.main-post-poster-comment-dislikes').click(function(e){
		console.log("comment not likee");
		//ajax request to update this on success
		var comm_id = this.id;
		var inn = document.getElementById(this.id).innerHTML;
		var dlid = this.id.substring(1);
		var inn2 = document.getElementById(dlid).innerHTML;

				//no like or dis-like
		if(inn2.charAt(0)!='l' && inn.charAt(0)!='d'){//now dis-like
			$.ajax({url:"backend.php?code=104&post_id="+comm_id.substring(9)+"&uord=d"}).done(function(data){
					resp=JSON.parse(data.split('\n').join(''));
					if(resp.success==200){
						// alert(resp.fname);
						for(var i=0;i<inn.length;i++){
							if(inn.charAt(i)=='<'){
							var num = parseInt(inn.substring(0,i));
							num++;
							
							inn = "disliked "+num+" "+inn.substring(i);
							
							document.getElementById(comm_id).innerHTML = inn;
							break;
							}			
						}

					}
					if(resp.success==99){
						console.log("could not register up vote");
					}
				});
		}else if(inn2.charAt(0)=='l'){//already likes
			//decrease likes and send ajax for new-dis-likes
			$.ajax({url:"backend.php?code=104&post_id="+comm_id.substring(9)+"&uord=d"}).done(function(data){
					resp=JSON.parse(data.split('\n').join(''));
					if(resp.success==200){
						// increase dis-likes and decrease likes
						for(var i=0;i<inn.length;i++){
							if(inn.charAt(i)=='<'){
							var num = parseInt(inn.substring(0,i));
							num++;
							
							inn = "disliked "+num+" "+inn.substring(i);
							
							document.getElementById(comm_id).innerHTML = inn;
							
							//decrease likes
							inn2 = inn2.substring(5);
							for( var j =0;j<inn2.length;j++){
								if(inn2.charAt(j)=='<'){
									var num = parseInt(inn2.substring(0,j));
									num--;
									inn2 = num+" "+inn2.substring(j);	
									// console.log("afterdecreasing likes "+inn2);
									document.getElementById(dlid).innerHTML = inn2;
									break;	
								}
							}							
							break;
							}			
						}



					}
					if(resp.success==99){
						console.log("could not register up vote");
					}
				});

		}else if (inn.charAt(0)=='d') {
				$.ajax({url:"backend.php?code=104&post_id="+comm_id.substring(9)+"&uord=n"}).done(function(data){
					resp=JSON.parse(data.split('\n').join(''));
					if(resp.success==200){
						// decrease dis-likes
						inn = inn.substring(8);
						for(var i=0;i<inn.length;i++){
							if(inn.charAt(i)=='<'){
							var num = parseInt(inn.substring(0,i));
							num--;
							
							inn = " "+num+" "+inn.substring(i);
							
							document.getElementById(comm_id).innerHTML = inn;
														
							break;
							}			
						}



					}
					if(resp.success==99){
						console.log("could not register up vote");
					}
				});
		}
	});

		// post new comment on a status
	$('.main-post-poster-comment-submit-button').click(function(e){

		if(active_user_name.localeCompare("Guest ")==0){
			// document.getElementById('login_info').innerHTML = "block";
			document.getElementById('login_info').innerHTML = "Currently Guests cannot comment on wall";
			$('#login_info').animate({ top: "+=32" }, 500)
							.animate({ top: "-=32" }, 4500);
		}

		var button_id = this.id;//NewC_Send_Clist_post_id
		var textarea_id = "#"+button_id.substring(0,4)+button_id.substring(9);
		var inputcomment_text = $(textarea_id);
		var tttctext = inputcomment_text[0].value;
		tttctext = tttctext.split("#").join("<hash>");
		console.log(inputcomment_text[0].value);	

		if(tttctext.length>=1 && active_user_name.localeCompare("Guest ")!=0 ){
			//send ajax request to update db
				$.ajax({url:"backend.php?code=103&comment="+tttctext+"&post_id="+textarea_id.substring(12)}).done(function(data){
				resp=JSON.parse(data.split('\n').join(''));
				if(resp.success==200){
					//resp.com_id is the comment id
					// alert(resp.fname);
					var comment_appendlist_id=textarea_id.substring(6);

					var comment_list = document.getElementById(comment_appendlist_id);

					var comment_main_wrapper = document.createElement('div');
					comment_main_wrapper.className += "main-post-poster-comment";
					comment_main_wrapper.id = resp.com_id;

					var commenter_pic = document.createElement('div');
					commenter_pic.className += "main-post-poster-comment-pic";
					var commenter_pic_img = document.createElement('img');
					commenter_pic_img.src = active_user_pic_comment;
					commenter_pic_img.className += "main-post-poster-comment-pic-img";
					commenter_pic.appendChild(commenter_pic_img);

					var commenter_text = document.createElement('div');
					commenter_text.className +="main-post-poster-comment-content";
					commenter_text.id = "CPostText_"+resp.com_id;
					var commenter_name = document.createElement('a');
					commenter_name.className += "main-post-poster-commenter-name";
					commenter_name.id = "CName"+resp.com_id;
					commenter_name.innerHTML += active_user_name;
					commenter_text.appendChild(commenter_name);
					commenter_text.innerHTML += " " +inputcomment_text[0].value;

					var post_commenter_activity = document.createElement('div');
					post_commenter_activity.className += 'main-post-poster-comment-activity';

					var post_commenter_activity_time = document.createElement('div');
					post_commenter_activity_time.className += 'main-post-poster-comment-time';
					post_commenter_activity_time.innerHTML += "few seconds ago";

					var post_commenter_activity_likes = document.createElement('div');
					post_commenter_activity_likes.className += 'main-post-poster-comment-likes';
					post_commenter_activity_likes.innerHTML += "0 <span><img src='images/up.png'></span>";
					post_commenter_activity_likes.id = "L_CList_"+resp.com_id;

					var post_commenter_activity_dislikes = document.createElement('div');
					post_commenter_activity_dislikes.className += 'main-post-poster-comment-dislikes';
					post_commenter_activity_dislikes.innerHTML += "0 <span><img src='images/down.png'></span>";
					post_commenter_activity_dislikes.id = "DL_CList_"+resp.com_id;

					var post_commenter_activity_fshare = document.createElement('div');
					post_commenter_activity_fshare.className = 'main-post-poster-comment-fshare';
					post_commenter_activity_fshare.id = "Fs_CList_"+resp.com_id;
					post_commenter_activity_fshare.innerHTML = 'f';

					post_commenter_activity.appendChild(post_commenter_activity_time);
					post_commenter_activity.appendChild(post_commenter_activity_likes);
					post_commenter_activity.appendChild(post_commenter_activity_dislikes);
					post_commenter_activity.appendChild(post_commenter_activity_fshare);

					comment_main_wrapper.appendChild(commenter_pic);
					comment_main_wrapper.appendChild(commenter_text);
					comment_main_wrapper.appendChild(post_commenter_activity);

					
					// console.log(comment_list.childNodes.length);
					// var test = "#"+comment_appendlist_id+" > div";	
					// var insert_place = 2*($(test).length);
					// comment_list.insertBefore(comment_main_wrapper, comment_list.childNodes[insert_place]);
					var input_dabba = document.getElementById("Send_"+comment_appendlist_id);
					comment_list.insertBefore(comment_main_wrapper,input_dabba );

					//remove text from area
					inputcomment_text[0].value="";
					 onclickscomments(uname, upic, upiccom);facebookapp(uname);showlikes();
				}
				if(resp.success==99){
					alert("could not post comment!");
				}
			});
		
		}
	});

};

function makeworldvisible( ) {
    console.log("making world ");
    dropmodel("zoot");
    document.getElementById("loader").style.display="none";
    //cdpr.canvas.height
    var loadbulidings = new Array("100", "300", "400","music","tvttgym","girl","cafty","700", "800", "900");
    for(var iter=0;iter<loadbulidings.length;iter++){
    	// console.log(loadbulidings[iter]);
    	var geolocater = document.getElementById("GL_"+loadbulidings[iter]);
    	geolocater.style.display = "block";
    }    

    console.log("visible");
};

function rearrangeworld( ){
	// console.log("");
	var pos1=inscreenxy(1.7,1.7,0.2);
    var pos2=inscreenxy(0,2.5,0.3);
    var pos3=inscreenxy(-1.4,0.5,0.3);
    var pos4=inscreenxy(-0.7,0.5,0.2);
    var pos5=inscreenxy(0.1,0.7,0.2);//music
    var pos6=inscreenxy(0,0.3,0.2);//tv room
    var pos7=inscreenxy(1.7,-1,0.3);//girls hostel

    var pos8=inscreenxy(-2.3,-1,0.3);//700
    var pos9=inscreenxy(-1.2,-2,0.3);//800
    var pos10=inscreenxy(-1,-3,0.3);//900

    var array_z_index = new Array();
    array_z_index.push(pos1[2]);array_z_index.push(pos3[2]);array_z_index.push(pos5[2]);
    array_z_index.push(pos2[2]);array_z_index.push(pos4[2]);array_z_index.push(pos6[2]);
	array_z_index.push(pos7[2]);array_z_index.push(pos8[2]);array_z_index.push(pos9[2]);
								array_z_index.push(pos10[2]);    							

   array_z_index.sort(function(a,b){return a-b});

    if(pos1[0]<cdpr.canvas.width && pos1[2]<cdpr.canvas.height){
    	document.getElementById('GL_100').style.display="block";
    	// document.getElementById('GL_100').style.display=+"block";	
    	document.getElementById('GL_100').style.left=pos1[0]-30+"px";
    	document.getElementById('GL_100').style.top=pos1[1]-60+"px";	
    }else{
    	document.getElementById('GL_100').style.display="none";
    	// document.getElementById('GL_100').style.display=+"none";	
    }
    // document.getElementById('GL_100').style.zIndex =Math.floor(100*pos1[2]);
    if(jQuery.inArray( pos1[2] , array_z_index )>0){

    	document.getElementById('GL_100').style.zIndex =1+Math.floor(5*(jQuery.inArray( pos1[2] , array_z_index )));
    	// console.log("100 z:"+document.getElementById('GL_100').style.zIndex);
    };
    

    if(pos2[0]<cdpr.canvas.width && pos2[2]<cdpr.canvas.height){
    	document.getElementById('GL_300').style.display="block";
    	// document.getElementById('GL_300').style.display=+"block";	
    	document.getElementById('GL_300').style.left=pos2[0]-30+"px";
    	document.getElementById('GL_300').style.top=pos2[1]-60+"px";	
    }else{
    	document.getElementById('GL_300').style.display="none";
    	// document.getElementById('GL_300').style.display=+"none";	
    }
    // document.getElementById('GL_300').style.zIndex =Math.floor(100*pos2[2]);
    if(jQuery.inArray( pos2[2] , array_z_index )>0){
    	document.getElementById('GL_300').style.zIndex =1+Math.floor(5*(jQuery.inArray( pos2[2] , array_z_index )));
    	// console.log("300 z:"+document.getElementById('GL_300').style.zIndex);
    };

    if(pos3[0]<cdpr.canvas.width && pos3[2]<cdpr.canvas.height){
    	document.getElementById('GL_400').style.display="block";
    	// document.getElementById('GL_400').style.display=+"block";	
    	document.getElementById('GL_400').style.left=pos3[0]-30+"px";
    	document.getElementById('GL_400').style.top=pos3[1]-60+"px";	
    }else{
    	document.getElementById('GL_400').style.display="none";
    	// document.getElementById('GL_400').style.display=+"none";	
    }
    // document.getElementById('GL_400').style.zIndex =Math.floor(100*pos3[2]);
    if(jQuery.inArray( pos3[2] , array_z_index )>0){
    	document.getElementById('GL_400').style.zIndex =1+Math.floor(5*(jQuery.inArray( pos3[2] , array_z_index )));
    	// console.log("400 z:"+document.getElementById('GL_400').style.zIndex);
    };

    if(pos4[0]<cdpr.canvas.width && pos4[2]<cdpr.canvas.height){
    	document.getElementById('GL_cafty').style.display="block";
    	// document.getElementById('GL_cafty').style.display=+"block";	
    	document.getElementById('GL_cafty').style.left=pos4[0]-30+"px";
    	document.getElementById('GL_cafty').style.top=pos4[1]-60+"px";	
    }else{
    	document.getElementById('GL_cafty').style.display="none";
    	// document.getElementById('GL_cafty').style.display=+"none";	
    }
    // document.getElementById('GL_cafty').style.zIndex =Math.floor(100*pos4[2]);
    if(jQuery.inArray( pos4[2] , array_z_index )>0){
    	document.getElementById('GL_cafty').style.zIndex =1+Math.floor(5*(jQuery.inArray( pos4[2] , array_z_index )));
    	// console.log("cafty z:"+document.getElementById('GL_cafty').style.zIndex);
    };

    if(pos5[0]<cdpr.canvas.width && pos5[2]<cdpr.canvas.height){
    	document.getElementById('GL_music').style.display="block";
    	// document.getElementById('GL_music').style.display=+"block";	
    	document.getElementById('GL_music').style.left=pos5[0]-30+"px";
    	document.getElementById('GL_music').style.top=pos5[1]-60+"px";	
    }else{
    	document.getElementById('GL_music').style.display="none";
    	// document.getElementById('GL_music').style.display=+"none";	
    }
    // document.getElementById('GL_music').style.zIndex =Math.floor(100*pos5[2]);
    if(jQuery.inArray( pos5[2] , array_z_index )>0){
    	document.getElementById('GL_music').style.zIndex =1+Math.floor(5*(jQuery.inArray( pos5[2] , array_z_index )));
    	// console.log("music z:"+document.getElementById('GL_music').style.zIndex);
    };

    if(pos6[0]<cdpr.canvas.width && pos6[2]<cdpr.canvas.height){
    	document.getElementById('GL_tvttgym').style.display="block";
    	// document.getElementById('GL_tvttgym').style.display=+"block";	
    	document.getElementById('GL_tvttgym').style.left=pos6[0]-30+"px";
    	document.getElementById('GL_tvttgym').style.top=pos6[1]-60+"px";	
    }else{
    	document.getElementById('GL_tvttgym').style.display="none";
    	// document.getElementById('GL_tvttgym').style.display=+"none";	
    }
    // document.getElementById('GL_tvttgym').style.zIndex =Math.floor(100*pos6[2]);
    if(jQuery.inArray( pos6[2] , array_z_index )>0){
    	document.getElementById('GL_tvttgym').style.zIndex =1+Math.floor(5*(jQuery.inArray( pos6[2] , array_z_index )));
    	// console.log("tv/gym z:"+document.getElementById('GL_tvttgym').style.zIndex);
    };

    if(pos7[0]<cdpr.canvas.width && pos7[2]<cdpr.canvas.height){
    	document.getElementById('GL_girl').style.display="block";
    	// document.getElementById('GL_girl').style.display=+"block";	
    	document.getElementById('GL_girl').style.left=pos7[0]-30+"px";
    	document.getElementById('GL_girl').style.top=pos7[1]-60+"px";	
    }else{
    	document.getElementById('GL_girl').style.display="none";
    	// document.getElementById('GL_girl').style.display=+"none";	
    }
    // document.getElementById('GL_girl').style.zIndex =Math.floor(100*pos7[2]);
    if(jQuery.inArray( pos7[2] , array_z_index )>0){
    	document.getElementById('GL_girl').style.zIndex =1+Math.floor(5*(jQuery.inArray( pos7[2] , array_z_index )));
    	// console.log("girl z:"+document.getElementById('GL_girl').style.zIndex);
    };

    //700-8
    if(pos8[0]<cdpr.canvas.width && pos8[2]<cdpr.canvas.height){
    	document.getElementById('GL_700').style.display="block";
    	// document.getElementById('GL_700').style.display=+"block";	
    	document.getElementById('GL_700').style.left=pos8[0]-30+"px";
    	document.getElementById('GL_700').style.top=pos8[1]-60+"px";	
    }else{
    	document.getElementById('GL_700').style.display="none";
    	// document.getElementById('GL_400').style.display=+"none";	
    }
    // document.getElementById('GL_400').style.zIndex =Math.floor(100*pos3[2]);
    if(jQuery.inArray( pos8[2] , array_z_index )>0){
    	document.getElementById('GL_700').style.zIndex =1+Math.floor(5*(jQuery.inArray( pos8[2] , array_z_index )));
    	// console.log("400 z:"+document.getElementById('GL_400').style.zIndex);
    };

    //800-9
    if(pos9[0]<cdpr.canvas.width && pos9[2]<cdpr.canvas.height){
    	document.getElementById('GL_800').style.display="block";
    	// document.getElementById('GL_800').style.display=+"block";	
    	document.getElementById('GL_800').style.left=pos9[0]-30+"px";
    	document.getElementById('GL_800').style.top=pos9[1]-60+"px";	
    }else{
    	document.getElementById('GL_800').style.display="none";
    	// document.getElementById('GL_400').style.display=+"none";	
    }
    // document.getElementById('GL_400').style.zIndex =Math.floor(100*pos3[2]);
    if(jQuery.inArray( pos9[2] , array_z_index )>0){
    	document.getElementById('GL_800').style.zIndex =1+Math.floor(5*(jQuery.inArray( pos9[2] , array_z_index )));
    	// console.log("400 z:"+document.getElementById('GL_400').style.zIndex);
    };

    //900-10
    if(pos10[0]<cdpr.canvas.width && pos10[2]<cdpr.canvas.height){
    	document.getElementById('GL_900').style.display="block";
    	// document.getElementById('GL_900').style.display=+"block";	
    	document.getElementById('GL_900').style.left=pos10[0]-30+"px";
    	document.getElementById('GL_900').style.top=pos10[1]-60+"px";	
    }else{
    	document.getElementById('GL_900').style.display="none";
    	// document.getElementById('GL_400').style.display=+"none";	
    }
    // document.getElementById('GL_400').style.zIndex =Math.floor(100*pos3[2]);
    if(jQuery.inArray( pos10[2] , array_z_index )>0){
    	document.getElementById('GL_900').style.zIndex =1+Math.floor(5*(jQuery.inArray( pos10[2] , array_z_index )));
    	// console.log("400 z:"+document.getElementById('GL_400').style.zIndex);
    };

    
};

function changebio(){

	$('#piclinktext').keypress(function(e) {
	    if(e.which == 13) {
	    	console.log("piic enter dabaya");
	        var linker = $('#piclinktext').val();
	        if(linker.length>1){
	        	$.ajax({url:"backend.php?code=109&img_url="+linker}).done(function(data){
					resp=JSON.parse(data.split('\n').join(''));
					if(resp.success==200){

						console.log("image change hogayee" + linker);
						//empty the area
						// $('#piclinktext').val()="";
						// document.getElementById('newpiclink').style.display="none";
						$('#newpiclink').remove();
						
					}
					if(resp.success==99){
						console.log("Already logged in!");
					}
				});
	        };
	        document.getElementById('newpiclink').style.display="none";
	    }
	});

	$('#piclinkcloser').click(function(e){
		$('#newpiclink').remove();
	});

	$('#newpasstext').keypress(function(e) {
	    if(e.which == 13) {
	    	console.log("pass enter dabaya");
	        var newpassword = $('#newpasstext').val();

	        if (newpassword.length>1) {
	        	$.ajax({url:"backend.php?code=108&new_password="+newpassword}).done(function(data){
					resp=JSON.parse(data.split('\n').join(''));
					if(resp.success==200){

						console.log("password change hogayee" + newpassword);
						//empty the area
						// $('#newpasstext').val()="";
						// document.getElementById('newpassholder').style.display="none";
						$('#newpassholder').remove();
						
					}
					if(resp.success==99){
						console.log("Already logged in!");
					}
				});
	        };
	        console.log("yeyyyyyyyyyyyyyyyy");
	        document.getElementById('newpassholder').style.display="none";
	    }
	});

	$('#newpasscloser').click(function(e){
		$('#newpassholder').remove();
	});
};

function facebookapp(uname){

	var appId = '440444152757286';
    FB.init( {
    appId: appId,
    frictionlessRequests: true,
    cookie: true,
    });


    function postToWall(userid,name,status_or_comment, post_or_share, text_to_post, series_nam,series_body,whoozit) {

		function callback(response) {
		  console.log(userid+" callingback");
		}

		FB.api('/'+userid+'/feed', 'post', { body: '',message: name+' activity on '+series_nam+" "+series_body, 
													  link: 'http://sunshine.iith.ac.in/zoot', 
													  picture: 'http://sunshine.iith.ac.in/zoot/images/fb_covers/'+series_nam+'_cover.png', 
													  name: name+' '+post_or_share+' on Zoot', 
													  description: whoozit+' ['+status_or_comment+'] '+text_to_post, 
													  caption: 'Zoot : Sunshine' }, 
													  callback);
	}

    postonwall=function(name,status_or_comment, post_or_share, text_to_post, series_nam, series_body,whoozit ){
			FB.login(function(response) {
				if (response.authResponse) {
					access_token =   FB.getAuthResponse()['accessToken'];
					FB.api('/me', function(response) {
						userid=response.id;
						postToWall(userid,name,status_or_comment, post_or_share, text_to_post, series_nam, series_body,whoozit);
					});
				}
				else
				{

				}
		}, {scope: 'publish_actions'});
    }

    $('.main-post-poster-activity-fshare').click(function(e){
    		var share_id = this.id;
    		console.log("clicked on "+share_id);
    		var text_id = "PostText_"+share_id.substring(3);
			var whoposted_id = "Name_"+share_id.substring(3);
			var postertext  = document.getElementById(text_id).innerHTML;
			var whoposted = document.getElementById(whoposted_id).innerHTML;
			console.log(active_user_name+"posting to fb: "+postertext);
    		postonwall(active_user_name,"status","shared", postertext, active_location, "Arena",whoposted );
    });

    $('.main-post-poster-comment-fshare').click(function(e){
    		var share_id = this.id;
    		console.log("clicked on"+ share_id);
    		var text_id = "CPostText_"+share_id.substring(9);
			var whoposted_id = "CName_"+share_id.substring(9);
    		var text_post = document.getElementById(text_id).innerHTML;
			var whoposted = document.getElementById(whoposted_id).innerHTML;
    		for (var i = 0; i<text_post.length; i++) {
    				if(text_post.charAt(i)=='/' && text_post.charAt(i+1)=='a'){
    					text_post = text_post.substring(i+2);
    					break;
    				}
    		}
			console.log(active_user_name+"posting to fb: "+text_post);
    		postonwall(active_user_name, "comment", "shared", text_post, active_location, "Arena",whoposted);	
  });

};

function showlikes(){
	$('.main-post-poster-activity-likes').mouseenter(function(e) {
	   console.log("entering "+this.id+", at x:"+e.pageX+", y:"+e.pageY);
	   var posterid = this.id;
	   var thiselement = document.getElementById('like_shower');
	   thiselement.style.top = (e.pageY+10)+"px";
	   thiselement.style.left = (e.pageX-25)+"px";
	   
	   // document.getElementById('like_shower').style.top = e.pageY;
	   // document.getElementById('like_shower').style.left = e.pageX-25;
	   // document.getElementById('like_shower').style.display = "block";

	   $.ajax({url:"backend.php?code=110&post_id="+posterid.substring(2)}).done(function(data){
				resp=JSON.parse(data.split('\n').join(''));
				if(resp.success==200){
					if(resp.users.length>0){
						thiselement.innerHTML="liked by...";
						thiselement.style.display = "block";
						for(var iter=0;iter<resp.users.length;iter++){
							var listee = document.createElement('li');
							listee.innerHTML = resp.users[iter];
							thiselement.appendChild(listee);
						}
					}
				}
				if(resp.success==99){
					alert("could not push notifications");
				}
		});

	});

	$('.main-post-poster-activity-likes').mouseleave(function(e) {
	   console.log("leaving "+this.id+", at x:"+e.pageX+", y:"+e.pageY);
	   var thiselement = document.getElementById('like_shower');
	   thiselement.style.display = "none";
	   thiselement.innerHTML = "loading...";
	});



	$('.main-post-poster-comment-likes').mouseenter(function(e) {
	   console.log("entering "+this.id+", at x:"+e.pageX+", y:"+e.pageY);
	   	   var posterid = this.id;
		   var thiselement = document.getElementById('like_shower');
		   thiselement.style.top = (e.pageY+10)+"px";
		   thiselement.style.left = (e.pageX-25)+"px";
		   // document.getElementById('like_shower').style.top = e.pageY;
		   // document.getElementById('like_shower').style.left = e.pageX-25;
		   // document.getElementById('like_shower').style.display = "block";

		   $.ajax({url:"backend.php?code=110&post_id="+posterid.substring(8)}).done(function(data){
					resp=JSON.parse(data.split('\n').join(''));
					if(resp.success==200){
							if(resp.users.length>0){
							thiselement.innerHTML="liked by...";
							thiselement.style.display = "block";
							for(var iter=0;iter<resp.users.length;iter++){
								var listee = document.createElement('li');
								listee.innerHTML = resp.users[iter];
								thiselement.appendChild(listee);
							}
						}
					}
					if(resp.success==99){
						alert("could not push notifications");
					}
			});

		});


	$('.main-post-poster-comment-likes').mouseleave(function(e) {
	   console.log("leaving "+this.id+", at x:"+e.pageX+", y:"+e.pageY);
	   var thiselement = document.getElementById('like_shower');
	   thiselement.style.display = "none";
	   thiselement.innerHTML = "loading...";
	});

}