define([
	    'marionette',
        'elfinder',
        'elfinder_i18n',
        'widgets/elfinder/chooseFolder/chooseFolder',
        'widgets/elfinder/chooseFile/chooseFile',
        'utils/utils',
        'utils/constants/urlConstants',
        'customUI/templateSelect/widgets/TryView',
        'customUI/templateSelect/widgets/GeneralView',
        'customUI/templateSelect/widgets/MPIView',
		'text!./templates/TemplateSelectTmpl.mustache',
		'i18n!./nls/AllJobViewNls',
		'css!./styles/AllJobView.css', 
        'css!/static/js/libs/jquery-ui/themes/flick/jquery-ui.min.css',
        'css!/static/js/libs/elfinder/css/elfinder.min.css'
	],function(Marionette,elfinder, elfinder_i18n, chooseFolder, chooseFile,utils, urlConstants,TryView,GeneralView,MPIView,template,nls){
	'use strict';
	
	return Marionette.ItemView.extend({
		template:template,
		templateHelpers:function(){
			return {
				nls:nls
			};
		},

		onRender:function(){
			
	 //general选项背景设置为#f2f2f2
		       
	$("#select_general").css("background-color","#f2f2f2");
		      
    var dataroot="/static/js/customUI/templateSelect/template.json"; 
        
        $.getJSON(dataroot, function(data){

        var Array=data;
        
        var strObj=JSON.stringify(Array);
       
        $.each(Array, function(idx, obj) {	
         
        $("#select_colllection").append("<div class='select_"+idx+" select_part' id=select_"+idx+" data-name="+idx+">"+
                                  
                                  "<div class='select_info'></div>"+
                                  
                                  "<div class='select_font'>"+obj.display_name+"</div>"+
                                 
                                  "</div>");
        });
                    
          $("#select_general").click(function(){
          	 
              $("#select_general").css("background-color","#f2f2f2");
              
          	  var  colorArray=[];
          	  colorArray=$(".select_part");

              for(var j=0;j<colorArray.length;j++){
              	$(colorArray[j]).css("background-color","#ffffff");
              	$(colorArray[j]).css("color","#333333");
              }
             
          	  $("#select_head_title").html("general");
          	   
          	  //打印到控制台,更换图片LOGO开始
          	  
          	  var imgObj=$("#select_logo").children();
          	  
          	  var addrVal=imgObj.attr("src");
          	  
          	  imgObj.attr("src","/static/js/customUI/showTemplateSelect/resource/general.jpg");
          	  
          	  //打印到控制台,更换图片LOGO结束
          	  
          	  //模板页面返回顶部
                  
                  document.getElementById("select_mainContainer_top_out").scrollTop=0;
                   
              var  generalView= new GeneralView({el: $('#select_mainContainer_top')});

              	   generalView.render();
              	   
              	   //从内存中清空对象方法开始
              	  
			       //console.log(generalView);
			  
			       //console.log($(generalView));
            
			  $("#select_template_reset").unbind("click");
			
			  $("#select_template_reset").click(function(){
          	  
          	      generalView.render();
          	  
              });
			   
          });
  
          
        
        var newArray=[];
        //获取类为 ".select_font"的数组   
        newArray=$(".select_part");
       //将 数组打印到控制台
        //console.log(newArray);
        
        $.each(newArray,function (index,domEle){
        	//遍历这个数组 
          	//console.log(index);
            //获取选项卡的ID
            var id=$(domEle).attr("id");
            //获取id的值
         
            var title=$(domEle).attr("data-name");
             
            //console.log("title.................:"+title);
        	//给每个id，绑定click事件。。。。
		    $("#"+id).bind("click",function(){
		    //将该按键设置为黑底白字，其他设置为白底黑字,开始
          	var  colorArray=[];
          	colorArray=$(".select_part");
            for(var j=0;j<colorArray.length;j++){
              	  $(colorArray[j]).css("background-color","#ffffff");
              	  $(colorArray[j]).css("color","#333333");
              	  var colorId=$(colorArray[j]).attr("id");
              	  if(colorId==id){
              	  //将该按键颜色设置为黑色
          	      $("#"+id).css("background-color","#f2f2f2");
          	      //将字体设置为白色
          	      $("#"+id).css("color","#333333");
        	      $("#select_general").css("background-color","#ffffff");
              	}
              }
            //将该按键设置为黑底白字，其他设置为白底黑字,结束
            
		   //遍历JSON,动态获取图片开始			   
		var pictureJson="/static/js/customUI/templateSelect/template.json";
		 
        $.getJSON(pictureJson,function(result){
           	        //将json字符串打印到控制台
           	        //console.log(result);
                    for(var p in result){
                     	if(p==title){
                     		//console.log(result[p].logo_url);
                     		//获取图片对象 
                     	    var imgObj=$("#select_logo").children();
                	        imgObj.attr("src",result[p].logo_url);
                     	}
                     }
         });

            var path="text!./customUI/templateSelect/widgets/templates/"+title+".mustache"; 

     	 if (window.select_alltemplateview.hasOwnProperty(title)){
     	 		//打印出window.select_alltemplateview对象
     	 		//console.log(window.select_alltemplateview);
     	 		//如果包含,直接那出来渲染 这个 视图
     	 		window.select_currtemplateview = window.select_alltemplateview[title];
     	 		window.select_currtemplateview.render();
     	 		//console.log(window.select_currtemplateview);
     	 	}else{
     	 		require([path],function(a){
	     	 		//console.log(path);
	     	 		var tryview= new TryView({el: $('#select_mainContainer_top'),template:a});
	                //console.log(tryview);
	     	 		window.select_alltemplateview[title] = tryview; 
	     	 		window.select_currtemplateview = tryview;
	     	 		window.select_currtemplateview.render();
     	 		});
     	 	}
         	     
          //模板页面返回顶部
                  
                   document.getElementById("select_mainContainer_top_out").scrollTop=0;
               
          //重置View事件开始
          $("#select_template_reset").unbind("click");
          $("#select_template_reset").click(function(){
            	//console.log("重置功能开始");
           require([path],function(a){
         	 //新建一个tryView对象，并且将它渲染出来	
        	  var tryView= new TryView({el: $('#select_mainContainer_top'),template:a});
         	      tryView.render();
           });
             //console.log("重置功能结束");
             
            });        
		  //重置View事件结束  
		    
		    
          
		    });
		    

        });
     
        

           
     });
       

		}
	});
});