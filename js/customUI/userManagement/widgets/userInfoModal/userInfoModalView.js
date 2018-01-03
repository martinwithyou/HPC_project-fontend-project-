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
	'multiselect',
	'jqueryJson',
	'utils/utils',
	'utils/constants/urlConstants',
	'text!./templates/userInfoModalTmpl.mustache',
	'i18n!../../nls/userMgt',
	'css!../../style/userManagement'
	],function(Marionette,multiselect, jqueryJson, utils, urlConstants, template,nls){
		'use strict';
		return Marionette.ItemView.extend({
			template:template,	
			_userPwd:'',	
			_pwdEdited:false,	

			templateHelpers:function(){
				return {
					nls:nls
				};
			},

			checkPwdStatus:function(){
				var _newPwd=$.trim($('#newUserPassword').val());
				var _newPwdAgain=$.trim($('#confirmNewPwd').val());
				this._userPwd='';
				
				if(_newPwd!=''&&_newPwd==_newPwdAgain){
					$('#newPwdStateIcon').removeClass('glyphicon glyphicon-remove').addClass('glyphicon glyphicon-ok');
					this._userPwd=_newPwdAgain;
				}else{
					$('#newPwdStateIcon').removeClass('glyphicon glyphicon-ok').addClass('glyphicon glyphicon-remove');
				}
			},

			initUserInfoModal:function(data){
				if(data.is_admin){
					$('#newUserRole').val('administrator');
				}else{
					$('#newUserRole').val('operator');
				}
				$('#newUserName').val(data.username).attr('disabled','disabled');
				$('#newUserPassword').attr('placeholder','******');
				$('#confirmNewPwd').attr('placeholder','******');
				$('#userGroupSelect').val(data.os_group.name);
				$('#accountingGroupSelect').val(data.bill_group.name);
				$('#newUserEmail').val(data.email);
			},
			
			onRender:function(){
				var _options=this.options;
				var queue_options=[];
				var _this=this;
				var _userid;

				if(_options.allOSGroups.length>0){
					$.each(_options.allOSGroups,function(index,item){
						$('#userGroupSelect').append("<option value='"+item+"'>"+item+"</option>");
					})
				}else{
					$('#userGroupSelect').append("<option value='noGroup'>No User Group</option>");
				}
				if(_options.allBillGroups.length>0){
					$.each(_options.allBillGroups,function(index,item){
						$('#accountingGroupSelect').append("<option value='"+item+"'>"+item+"</option>");
					})
				}else{
					$('#accountingGroupSelect').append("<option value='noGroup'>No Accounting Group</option>");
				}

				if(_options.editMode){
					_this.initUserInfoModal(_options.originalUserInfo);
					_userid=_options.originalUserInfo.id;
				}else{//create new user
					$('#userInfoOKBtn').attr('disabled','disabled');
				}	

				$('#newUserName,#newUserEmail').keyup(function(){
					_this.changeOKBtnStatus($(this).attr('name'));
				});				
				
				/*removed in MVP version
				if(_options.allQueues){
					queue_options=_options.allQueues;
				}
				
				$('#availableQueue').multiselect({
					templates:{
						button: '<button type="button" class="multiselect dropdown-toggle" data-toggle="dropdown"><span class="multiselect-selected-text"></span> <b class="caret" style="float:right;margin-top:10px;"></b></button>',
						li: '<li style="width:200px;padding-left:10px;"><a tabindex="0"><label style="margin-top:0px;margin-bottom:0px;font-weight:400;"></label></a></li>'
					},
					buttonWidth:'200px',
					includeSelectAllOption:true,
					selectAllText:nls.selectAllQueue	
				});
				$('#availableQueue').multiselect('dataprovider',queue_options);
				*/

				$('#userInfoModal').modal("show");
				$('#newUserPassword, #confirmNewPwd').keyup(function(e){
					if(e.keyCode!=9){
						_this._pwdEdited=true;//for edit mode
						_this.checkPwdStatus();

						_this.changeOKBtnStatus();
					}					
				});				

				/* removed in MVP version				
				$('#initialPassword').change(function(){
					if($(this).val()=='userDefinedPwd'){
						$('#userDefinePwd').css('display','block');
					}else{
						$('#userDefinePwd').css('display','none');
					}
				});
				*/
				$('#userInfoOKBtn').click(function(){
					var tr=$('.DTTT_selected.selected')[0];
					
					var _url=urlConstants.users;
					var _type='POST';

					if(_options.editMode){
						_url=urlConstants.users+_userid+'/';
						_type='PUT';
					}
					var userInfo=_this.getUserInfo(_options.editMode);
					$.ajax({
						url:_url,
						type:_type,
						data:$.toJSON(userInfo),
						dataType:'json',						
						
	      				contentType:'application/json',

	      				success:function(res){	      					
	      					var _newUserData=res;
	      					if(res.is_admin){
	      						_newUserData['role']=nls.administratorRole;
	      					}else{
	      						_newUserData['role']=nls.operatorRole;
	      					}	      					
	      					//$('#userInfoOKBtn').unbind('click');
	      					$("#userInfoModal").modal("hide");
	      					if(_options.editMode){
	      						$('#userGrid').dataTable().fnUpdate(_newUserData,tr);
	      						console.log("Edit user finished");
	      					}else{
	      						$('#userGrid').dataTable().fnAddData(_newUserData);
	      						console.log("New user added");
	      					}
	      				},
	      				error:function(res){
	      					var responseObj=res.responseJSON;
	      					$('#userModalMsg').text("");
	      					if(res.status==400){	      						
	      						if(responseObj.username&&responseObj.username.length>0){
	      							$('#userModalMsg').addClass('alert alert-danger').append(nls.userName+": "+responseObj.username[0]);//if user exists already
	      						}
	      						if(responseObj.bill_group&&responseObj.bill_group.name.length>0){
	      							$('#userModalMsg').addClass('alert alert-danger').append(responseObj.bill_group.name[0]);
	      						}
	      						if(responseObj.os_group&&responseObj.os_group.name.length>0){
	      							$('#userModalMsg').addClass('alert alert-danger').append(responseObj.os_group.name[0]);
	      						}
	      						if(responseObj.email&&responseObj.email.length>0){
	      							$('#userModalMsg').addClass('alert alert-danger').append(responseObj.email[0]);
	      						}
	      					}
	      					if(res.status==404){
	      						$('#userModalMsg').addClass('alert alert-danger').text(nls.notFoundMsg);
	      					}
	      					if(responseObj&&responseObj.detail){
      							$('#userModalMsg').addClass('alert alert-danger').text(responseObj.detail);
      						}
	      				}
					})
				});
				$("#userInfoCancelBtn").click(function(){
					$("#userInfoModal").modal("hide");
				});
			},

			changeOKBtnStatus:function(item){
				var _userName=$.trim($('#newUserName').val());
				var _email=$.trim($('#newUserEmail').val());
				var _userNameRegExp=/^[a-zA-Z][a-zA-Z0-9_]{1,19}$/;
				var _emailRegExp=/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-]+)+/;
				
				var userNameOKFlag=_userName!=""&&_userNameRegExp.test(_userName);
				var emailOKFlag=_email!=""&&_emailRegExp.test(_email);
				var pwdOKFlag=(this.options.editMode)?((!this._pwdEdited||(this._pwdEdited&&this._userPwd!=""))?true:false):((this._pwdEdited&&this._userPwd!="")?true:false);
				if($('#userModalMsg').hasClass('alert alert-danger')){
					$('#userModalMsg').removeClass('alert alert-danger').text("");					
				}

				if(userNameOKFlag||item!='newUserName'){
					utils.hideMessageOnSpot('#newUserName');
				}
				if(emailOKFlag||item!='newUserEmail'){
					utils.hideMessageOnSpot('#newUserEmail');
				}
				if(userNameOKFlag&&pwdOKFlag&&emailOKFlag){	
					$('#userInfoOKBtn').removeAttr('disabled');					
				}else{
					$('#userInfoOKBtn').attr('disabled','disabled');
					if(!userNameOKFlag&&item=='newUserName'){
						utils.showMessageOnSpot('#newUserName',nls.userNameRuleText);
					}
					if(!emailOKFlag&&item=='newUserEmail'){
						utils.showMessageOnSpot('#newUserEmail',nls.emailIllegalText);
					}
				}
			},

			getUserInfo:function(mode){
				var userInfo={
					is_admin:false,			
					email:'',
					bill_group:{name:''},
					os_group:{name:''}
				};
				if(mode){//is editing user info
					//if user password is changed
					//add password to UserInfo
					//else do not pass this k-v
					if(this._userPwd!=""){
						userInfo['password']=this._userPwd;
					}
					
				}else{
					userInfo['username']=$('#newUserName').val();
					userInfo['password']=$('#newUserPassword').val();
				}
				var userRole=$('#newUserRole').val();
				if(userRole=="administrator"){
					userInfo.is_admin=true;
				}else{
					userInfo.is_admin=false;
				}
				
				//userInfo.password=$('#newUserPassword').val();
				userInfo.os_group.name=$('#userGroupSelect').val();
				userInfo.bill_group.name=$('#accountingGroupSelect').val();
				userInfo.email=$('#newUserEmail').val();
				
				return userInfo;
			}
		});
	});