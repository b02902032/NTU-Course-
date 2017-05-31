//var who = window.prompt("What is your name");
//var favcolor = window.prompt("What is your favorite color");
//document.write("Hello " + who);
//document.bgColor = favcolor;
var coursemap;
function courseObj(link,sweet,cool,hard,courseid){
	this.link = link;
	this.sweet = sweet;
	this.cool = cool;
	this.hard = hard;
	this.courseid = courseid;

	var ansdiv;
	var color = ["","",""];
	console.log(link);
	this.search = function(professor,course){

		console.log("??");
		if(sweet>=66)	color[0] = "style=\"background-color:#5BD7AD;\"";
		else if(sweet<66 && sweet>=33)	color[0] = "style=\"background-color:#FCFF7C;\"";
		else	color[0] = "style=\"background-color:#FF7579;\"";
		
		if(cool>=66)	color[1] = "style=\"background-color:#5BD7AD;\"";
		else if(cool<66 && cool>=33)	color[1] = "style=\"background-color:#FCFF7C;\"";
		else	color[1] = "style=\"background-color:#FF7579;\"";
		
		if(hard>=66)	color[2] = "style=\"background-color:#5BD7AD;\"";
		else if(hard<66 && hard>=33)	color[2] = "style=\"background-color:#FCFF7C;\"";
		else	color[2] = "style=\"background-color:#FF7579;\"";

		//red:#FF7579
		//green:#5BD7AD
		//yellow:#FCFF7C

		var showOrNot = 0;
		var professorInd = courseid.indexOf(professor);
		var courseInd = courseid.indexOf(course);
		if(professorInd>0 || courseInd >0)	showOrNot = 1;

		ansdiv = "<span class = \"circle_container\">"
					+  "<div class=\"circle\""+		color[0]	+"><h3>"+sweet+"%</div>"  
					+  "<div class=\"circle\""+		color[1]	+"><h3>"+cool+"%</div>"  
					+  "<div class=\"circle\""+		color[2]	+"><h3>"+hard+"%</div>"  
					+  "</span>";

		return showOrNot;
	};

	this.addProperty = function(){
		$(ansdiv).appendTo($('.urlive-container'));			
		right_container = $('<span/>', {'class':'right_container'});
		right_container.appendTo($('.urlive-container'));
		$(link).appendTo(right_container);
	};

}
function readData(listname,professor,course,search){
	var list = new Array;
	$.get(listname, 
		function(data) {
			list = data.split("\n");
			for(var i=0; i < list.length; i++){
				//console.log(list[i]);
				
				$(".list").append(list[i]);
				//<a href = "https://www.ptt.cc/bbs/NTUCourse/M.1437076255.A.A90.html" class = "link" ></a> +100+51+50+[評價] 102-2 鄭明燕 機率導論

 				/*var splitList = list[i].split('+');

				var showOrNot = 0;
				var ans = ["","","",""];
				var color = ["","",""];
				var ansdiv;
				ans[0] = splitList[1];
				ans[1] = splitList[2];
				ans[2] = splitList[3];
				ans[3] = splitList[4];
				console.log(ans[3]);
				console.log(ans[0]+" "+ans[1]+" "+ans[2]);

				var courseobj = new courseObj(splitList[0],ans[0],ans[1],ans[2],ans[3]);
				console.log(courseobj);
				console.log(courseobj.search(professor,course));
				if(courseobj.search(professor,course)==1){
					courseobj.addProperty();
				}
				break;*/

			}
			$('.link').urlive({ container: '.urlive-container' },professor,course,search);
			
			//console.log();
		});

	

}
$(document).ready(function(){
	var listname = "http://homepage.ntu.edu.tw/~b02902032/result_sweet2.html";

	$('#searchbtn').click(function(){
		$( "a" ).remove();
		$( ".circle_container" ).remove();
		var professor = $('.searchProfessor').val(), course = $('.searchCourse').val();
		console.log(professor+" "+course);
		//readData(listname,professor,course);
		readData(listname,professor,course,1);
	});
	$('#sweetbtn').click(function(){
		$( "a" ).remove();
		$( ".circle_container" ).remove();
		readData(listname,"","",0);
	});
	$('#coolbtn').click(function(){
		listname = "http://homepage.ntu.edu.tw/~b02902032/result_cool2.html";
		$( "a" ).remove();
		$( ".circle_container" ).remove();
		readData(listname,"","",0);
	});
	$('#hardbtn').click(function(){
		listname = "http://homepage.ntu.edu.tw/~b02902032/result_hard2.html";
		$( "a" ).remove();
		$( ".circle_container" ).remove();
		readData(listname,"","",0);
	});

});
	
