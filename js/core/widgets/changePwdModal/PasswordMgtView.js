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
	'utils/constants/urlConstants',
	'text!./templates/PasswordMgtTmpl.mustache',
	'i18n!./nls/login',
	'css!../../layout/login/style/login'
	],function(Marionette, cookie, urlConstants, template, nls){
		'use strict';

		return Marionette.ItemView.extend({
			template:template,

			templateHelpers:function(){
				return {
					nls:nls
				};
			},
			
			onRender:function(){
				var _currentUser=$.cookie("username");
				var _currentUserID=$.cookie("userid");
				var _csrfToken=$.cookie("csrftoken");
				var _oldPwd="";
				var _passwordToChange="";
				var _this=this;

				$("#currentUser").text(_currentUser);

				$('#changePwdModal').modal({
					keyboard:true,
					backdrop:'static'
				});
				$('#changePwdModal').on('shown.bs.modal',function(){
					$('#oldPassword')[0].focus();
				});
				
				document.onkeydown=function(evt){
					var evt=window.event?window.event:evt;
					if(evt.keyCode==13){
						$("#okChangeBtn").trigger("click");
					}
				};
				$('#oldPassword').blur(function(){
					_oldPwd=$.trim($('#oldPassword').val());
					if(_oldPwd==""){
						$('#emptyOldPwdMsg').addClass('alert alert-danger');
						$('#emptyOldPwdMsg').text(nls.oldPwdEmptyMsg);
					}else{
						if($('#emptyOldPwdMsg').hasClass('alert alert-danger')){
							$('#emptyOldPwdMsg').removeClass('alert alert-danger');
							$('#emptyOldPwdMsg').text("");
						}
					}
				}).keyup(function(){
					_oldPwd=$.trim($('#oldPassword').val());
					if($('#emptyOldPwdMsg').hasClass('alert alert-danger')){
						$('#emptyOldPwdMsg').removeClass('alert alert-danger');
						$('#emptyOldPwdMsg').text("");
					}
					if(_oldPwd!=''&&_passwordToChange!=''){
						$('#okChangeBtn').removeAttr('disabled');
					}else{
						if(_oldPwd==""){
							$('#oldPassword')[0].focus();
						}
						$('#okChangeBtn').attr('disabled','disabled');
					}
				});

				$('#confirmPassword, #newPassword').on('click keyup blur',function(){
					var _newPwd=$.trim($('#newPassword').val());
					var _confirmPwd=$.trim($('#confirmPassword').val());					
					
					if(_newPwd!=''&&_confirmPwd!=''){
						$('#emptyNewPwdMsg').removeClass('alert alert-danger');
						$('#emptyNewPwdMsg').text("");
						$('#confirmNewPwdMsg').removeClass('alert alert-danger');
						$('#confirmNewPwdMsg').text("");
						if(_newPwd==_confirmPwd){//password match
							$('#newPwdStatusIcon').removeClass('glyphicon glyphicon-remove');
							$('#newPwdStatusIcon').addClass('glyphicon glyphicon-ok');
							$('#confirmNewPwdMsg').removeClass('alert alert-danger');
							$('#confirmNewPwdMsg').text("");
							_passwordToChange=_confirmPwd;
							if(_oldPwd!=""){
								$('#okChangeBtn').removeAttr('disabled');
							}else{
								$('#okChangeBtn').attr('disabled','disabled');
							}
						}else{//new password not match
							$('#newPwdStatusIcon').removeClass('glyphicon glyphicon-ok');
							$('#newPwdStatusIcon').addClass('glyphicon glyphicon-remove');
							$('#confirmNewPwdMsg').addClass('alert alert-danger');
							$('#confirmNewPwdMsg').text(nls.pwdNotMatch);
							$('#okChangeBtn').attr('disabled','disabled');
						}
					}else{	
						$('#okChangeBtn').attr('disabled','disabled');					
						if(_newPwd==""){
							$('#emptyNewPwdMsg').addClass('alert alert-danger');
							$('#emptyNewPwdMsg').text(nls.newPwdEmptyMsg);
						}else{
							$('#emptyNewPwdMsg').removeClass('alert alert-danger');
							$('#emptyNewPwdMsg').text("");
						}	
						if(_confirmPwd==""){
							$('#confirmNewPwdMsg').addClass('alert alert-danger');
							$('#confirmNewPwdMsg').text(nls.confirmPwdEmptyMsg);
						}else{
							$('#confirmNewPwdMsg').removeClass('alert alert-danger');
							$('#confirmNewPwdMsg').text("");
						}	
					}				
				});
				
				$('#okChangeBtn').click(function(){
					var _currentUserID=$.cookie('userid');
					var _currentUser=$.cookie('username');
					if(_oldPwd!=""&&_passwordToChange!=""&&_currentUserID!=""&&_currentUser!=""){
						$.ajax({
							//alwarys add a slash to the last of the url, otherwise this will cause FF to show a redirect dialog everytime
							url:urlConstants.users+_currentUserID+'/', 
							type:'PATCH',
							headers:{
								"X-CSRFtoken" : _csrfToken
							},
							data:{
								"old_password":_oldPwd,
								"new_password":_passwordToChange
							},
							success:function(res){
								console.log("success");
								$('#pwdChangeErrorMsgArea').css('display','none');
								$('#changePwdModal').modal('hide');
							},
							error:function(res){
								if(res.status==400){
									var responseObj=res.responseJSON;
									if(responseObj.old_password){
										if(responseObj.old_password.length>0){
											$('#emptyOldPwdMsg').addClass('alert alert-danger');
											$('#emptyOldPwdMsg').text(responseObj.old_password[0]);
										}										
									}
								}else{
									var responseObj=res.responseJSON;
									$('#pwdChangeErrorMsgArea').css('display','block');
									$('#pwdErrorMsg').html(responseObj.detail);
								}
								
								console.log("error");
							}
						});
					}
					
				});
			}
		});
});