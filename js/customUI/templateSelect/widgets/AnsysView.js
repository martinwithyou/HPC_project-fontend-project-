define(['marionette',
		'text!./templates/AnsysViewTmpl.mustache',
		'i18n!./nls/AllJobViewNls',
		'css!./styles/AllJobView.css'
	],function(Marionette,template,nls){
	'use strict';
	return Marionette.ItemView.extend({
		template:template,
		templateHelpers:function(){
			return {
				nls:nls
			};
		},

		// validate
		onShow:function(){}
	});
});