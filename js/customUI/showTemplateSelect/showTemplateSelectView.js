define(['marionette',
        'elfinder',
        'elfinder_i18n',
        'widgets/elfinder/chooseFolder/chooseFolder',
        'widgets/elfinder/chooseFile/chooseFile',
        'utils/utils',
        'utils/constants/urlConstants',
		'text!./templates/TemplateSelectTmpl.mustache',
		'i18n!./nls/AllJobViewNls',
		'customUI/templateSelect/widgets/GeneralView',
        'customUI/templateSelect/TemplateSelectView',
        'customUI/user/dashboard/job/jobView',
		'css!./styles/AllJobView.css', 
        'css!/static/js/libs/jquery-ui/themes/flick/jquery-ui.min.css',
        'css!/static/js/libs/elfinder/css/elfinder.min.css'
	],function(Marionette,elfinder, elfinder_i18n, chooseFolder, chooseFile,utils, urlConstants,template,nls,GeneralView,TemplateSelectView,jobView){
	'use strict';
	return Marionette.ItemView.extend({
		template:template,
		templateHelpers:function(){
			return {
				nls:nls
			};
		},
		
		onShow:function(){
			
		var windowHeight= window.innerHeight;
		
		var templateHeight=windowHeight-90;
		
		console.log(windowHeight);
		
		console.log(templateHeight);
		
		$(".select_sidebar").css("height",templateHeight);
		
		$(".select_mainContainer").css("height",templateHeight);
		
		console.log($(".select_sidebar"));
		
		console.log($(".select_mainContainer"));
		
		window.select_alltemplateview = {};
		
		window.select_currtemplateview = null;
		
       $("body").css("background-color", "white");
        
  var  job= new jobView({el: $('#dialog-region')});
  
       job.render();
       
  var  general= new GeneralView({el: $('#select_mainContainer_top')});
       
       general.render();
      
  var  newTemplateSelect= new TemplateSelectView({el: $('#select_colllection')});
			  
	   newTemplateSelect.render();
	   
		}
	});
});