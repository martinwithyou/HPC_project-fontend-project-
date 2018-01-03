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
	'cookie',
	'utils/utils',
	'utils/constants/constants',
	'utils/constants/urlConstants',
	'text!./templates/loginTmpl.mustache',
	'i18n!./nls/login',
	'css!./style/login'
	],
	function(Marionette, cookie, utils, constants, urlConstants, login, nls){
		'use strict';

		return Marionette.ItemView.extend({
			template:login,
			templateHelpers: function () {
		        return {
		          nls: nls,
		          constants: constants
		        };
	      	},

	      	resetLoginMsg:function(){
	      		if($('#loginMsg').hasClass('alert alert-danger')){
      				$('#loginMsg').removeClass('alert alert-danger').text("");
      				$('#loginForm').css('padding-top','30px');
      			}
	      	},

	      	onRender:function(){
	      		var _this=this;
	      		$('.loginformArea').css('height',document.body.clientHeight-360);
	      		$('#username').css('border-color','#FFFFFF');
	      		$('#password').css('border-color','#FFFFFF');
	      		document.onkeydown=function(evt){
	      			var evt=window.event?window.event:evt;
	      			if(evt.keyCode==13){
	      				$("#submit-id-submit").trigger("click");
	      			}
	      		};
	      		$(window).resize(function(){
			        $('.loginformArea').css('height',document.body.clientHeight-360);
			 	});

	      		$('#username').on('click keyup',function(e){
	      			$('#username').css('border-color','#FFFFFF');
	      			utils.hideMessageOnSpot('#userNameArea');
	      			utils.hideMessageOnSpot('#passwordArea');
	      			_this.resetLoginMsg();
	      			var evt=window.event?window.event:e;
	      			if(evt.keyCode==13&&$.trim($(this).val())!=""){
	      				$('#password').focus();
	      			}
	      		});

	      		$('#password').on('click keyup',function(e){
	      			$('#password').css('border-color','#FFFFFF');
	      			utils.hideMessageOnSpot('#userNameArea');
	      			utils.hideMessageOnSpot('#passwordArea');
	      			_this.resetLoginMsg();
	      			var evt=window.event?window.event:e;
	      			if(evt.keyCode==13&&$.trim($(this).val())!=""){
	      				$("#submit-id-submit").trigger("click");
	      			}
	      		});

	      		$("#submit-id-submit").click(function() {
	      			var _userName = $.trim($('#username').val());
	      			var _password = $.trim($('#password').val());
	      			if(_userName==""){
	      				utils.showMessageOnSpot("#userNameArea",nls.userNameEmptyMsg);
	      			}else{
	      				utils.hideMessageOnSpot('#userNameArea');
	      			}
	      			if(_password==""){
	      				utils.showMessageOnSpot("#passwordArea",nls.passwordEmptyMsg);
	      			}else{
	      				utils.hideMessageOnSpot('#passwordArea');
	      			}
	      			
	      			var _data={
	      				username:_userName,
	      				password:_password
	      			};
	      			 
	      			//$.session.set( username , _password);
	      			//$.session.set( password , _password);
	      			var _dataString=JSON.stringify(_data);
	      			//alert(_dataString);
	      			//新增代码 开始
	      			//$.cookie('dataOfLogin', _dataString );
	      			//alert($.cookie('dataOfLogin')+'.........1');
                    var dataOfLogin=$.cookie('dataOfLogin_cookie', _dataString, { expires: 7, path: '/' });
	      			//新增代码结束
	      			//alert($.cookie('dataOfLogin_cookie'));
	      			 
	      			var _csrfToken = $.cookie('csrftoken');
	      			/*
	      			var form=document.getElementById("testForm");
	      			var formDt=new FormData(form);
	      			 */
	      			if(_userName!=""&&_password!=""){
	      				var form = $('#loginForm');
		      			var formData = form.serialize();
		      			$.ajax({
		      				type : 'POST',
		      				url : urlConstants.sessions,
		      				data : formData,

		      				headers : {
		      					"X-CSRFtoken" : _csrfToken
		      				},
		      				success : function(res,a,b) {
		      					var _isAdmin=$.cookie('is_admin');

		      					_this.clearElfinderStorage();

		      					if(_isAdmin === "True"){
		      						var _currentLocation=window.location;
		      						var _hash='#admin';
		      						if(_currentLocation.hash!=""&&_currentLocation.hash.indexOf('#admin')!=-1){
		      							_hash=_currentLocation.hash;
		      						}else{
		      							_hash+=_currentLocation.hash;
		      						}
		      						window.location.href=urlConstants.index+_hash;
		      						//_this.redirectPage(urlConstants.index+"#admin/");
		      					}else{
		      						window.location.href=urlConstants.index;
		      						//_this.redirectPage(urlConstants.index);
		      					}
		      				},
		      				error : function(res) {
		      					if(res.status==403){
		      						var responseObj=JSON.parse(res.responseText);
		      						$('#loginMsg').addClass("alert alert-danger").text(nls.loginFailureMsg);
		      						$('#loginForm').css('padding-top','70px');
		      					}
		      					if(res.status>=500){
		      						$('#loginMsg').addClass("alert alert-danger").text(nls.serverErrorMsg);
		      						$('#loginForm').css('padding-top','70px');
		      					}
		      				}
		      			});
	      			}
	      		});
	      	},

	      	clearElfinderStorage: function () {
	      		// clear elfinder last dir cookie or storage
		      	utils.storage["elfinder-lastdireditor"] = "";
		      	utils.storage["elfinder-lastdirjobfile-elfinder-dlg-content"] = "";
		      	utils.storage["elfinder-lastdiruser-files"] = "";
		      	utils.storage["elfinder-lastdirworkdir-elfinder-dlg-content"] = "";
		      	utils.storage["elfinder-lastdirmpiprog-elfinder-dlg-content"] = "";
	      	}
		});
});
