define(['marionette',
		'i18n!./nls/AllJobViewNls',
		'customUI/templateSelect/widgets/assets/newAutoJobTemp'
	],function(Marionette,nls,newAutoJobTemp){
	'use strict';
	return Marionette.ItemView.extend({

		templateHelpers:function(){
			return {
				nls:nls
			};
		},

		onRender:function(){

			newAutoJobTemp.createJobTemp();

		}
	});
});