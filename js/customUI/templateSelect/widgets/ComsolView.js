define(['marionette','customUI/jobSelection/widgets/assets/validate',
		'text!./templates/ComsolViewTmpl.mustache',
		'i18n!./nls/AllJobViewNls',
		'css!./styles/AllJobView.css'
	],function(Marionette,validate,template,nls){
	'use strict';
	return Marionette.ItemView.extend({
		template:template,
		templateHelpers:function(){
			return {
				nls:nls
			};
		},

		// validate
		onRender:function(){
			$("#confirm_submit").click(function(){
				validate.validateEmail("#wallTimeComsol");
			});
			
		}
	});
});