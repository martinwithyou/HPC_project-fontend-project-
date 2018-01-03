/*
 * © Copyright Lenovo 2015.
 *
 * LIMITED AND RESTRICTED RIGHTS NOTICE:
 *
 * If data or software is delivered pursuant a General Services Administration
 * "GSA" contract, use, reproduction, or disclosure is subject to
 * restrictions set forth in Contract No. GS-35F-05925.
*/
define([
	'marionette',
	'text!./templates/messageModalTmpl.mustache'
	],function(Marionette,template){
	'use strict';
	return Marionette.ItemView.extend({
		template:template,

		onRender:function(){
			var _options=this.options;
			var _msgType=_options.type;
			var _msg=_options.message;
			if(_msgType=='error'){
				$('#msgIcon').attr('src','/static/js/customUI/accountingManagement/style/images/ic_clear_red_36x36.png');
			}else if(_msgType=="success"){
				$('#msgIcon').attr('src','/static/js/customUI/accountingManagement/style/images/ic_check_green_36x36.png');
			}else if(_msgType=="warning"){
				$('#msgIcon').attr('src','/static/js/customUI/accountingManagement/style/images/warning.png');
			}
			$('#messageContentArea').addClass("alert alert-dismissable").css("background-color", "white");
			$('#msgContent').html(_msg).css('position','relative');
			
			$('#messageModal').modal('show');
			setTimeout(function(){$('#messageModal').modal('hide');},3000);
		}
	});	
});