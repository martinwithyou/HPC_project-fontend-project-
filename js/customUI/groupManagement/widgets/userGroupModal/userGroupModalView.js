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
	'multiselect',
	'utils/utils',
	'utils/constants/urlConstants',
	'text!./templates/userGroupModalTmpl.mustache',
	'i18n!../../nls/userGroup',
	'css!../../style/userGroup'
	],function(Marrionette, cookie, multiselect, utils, urlConstants, template, nls){
		'use strict';
		return Marionette.ItemView.extend({
			template:template,

			templateHelpers:function(){
				return {
					nls:nls
				};
			},
			onRender:function(){
				var _options=this.options;
				//var _allQueues=_options.availableQueues;
				//var _editMode:_options.editMode;
				//var _selectedRowData=_options.selectedGroupData;

				$("#groupInfoModal").modal("show");

				this.initiateGroupModal(_options);	
				
				$('#userGroupName').keyup(function(){
					var userGroupNameRegExp=/^[a-zA-Z][a-zA-Z0-9_]{1,19}$/;
					var _groupName=$(this).val();
					if(_groupName!=""&&userGroupNameRegExp.test(_groupName)){
						utils.hideMessageOnSpot('#userGroupName');
						$("#groupOKBtn").removeAttr('disabled');						
					}else{
						utils.showMessageOnSpot('#userGroupName',nls.osGroupNameRuleText,'right');
						$("#groupOKBtn").attr('disabled','disabled');
					}
				});
				$("#groupOKBtn").click(function(){
					var _allQueues=[];					
					var _groupName=$('#userGroupName').val();
					var _allQueuesSelectedOptions=$('#availableQueue option:selected');
					$.each(_allQueuesSelectedOptions,function(index,item){
						_allQueues.push({name:item.value});
					});
					var _groupInfoData={
							name:_groupName,
							queues:_allQueues
						};
					var _type="POST";
					var _url=urlConstants.userGroup;
					if(_options.editMode){
						_type="PUT";
						_url=urlConstants.userGroup+_options.selectedGroupData.id+'/';
					}
					var tr=$('.DTTT_selected.selected')[0];
					$.ajax({
						type:_type,
						url:_url,
						data:$.toJSON(_groupInfoData),
						dataType:'json',
	      				contentType:'application/json',

						success:function(res){
							var _groupData=res;
							_groupData['queueList']=[];
								if(_groupData.os_users){
									_groupData['userCount']=_groupData.os_users.length;
								}
								if(_groupData.queues){
									$.each(_groupData.queues,function(i,j){
										_groupData['queueList'].push(j.name);
									});
								}
							$("#groupInfoModal").modal("hide");
							if(_options.editMode){
								$('#groupTable').dataTable().fnUpdate(_groupData,tr);
							}else{
								$('#groupTable').dataTable().fnAddData(_groupData);
							}
							console.log("New user group added");
						},
						error:function(res){
							console.log("New user group add failed");
							var msg="";
							var responseObj=res.responseJSON;
							/*
							$.each(resObj,function(k,v){
								msg+=v;
							});
							*/
							if(res.status==400){
								if(responseObj&&responseObj.name){
									$('#userGroupMsg').addClass('alert alert-danger').text(nls.groupName+": "+responseObj.name[0]);
								}
							}
							if(res.status==404){
								$('#userGroupMsg').addClass('alert alert-danger').text(nls.notFoundMsg);
							}
							if(responseObj&&responseObj.detail){
								$('#userGroupMsg').addClass('alert alert-danger').text(responseObj.detail);
							}														
						}
					});
				});
				$("#groupCancelBtn").click(function(){
					$("#groupInfoModal").modal("hide");
				});
			},

			initiateGroupModal:function(options){
				//initiate the multiselect options
				var groupRowData=options.selectedGroupData;
				if(options.editMode){
					$('#userGroupName').val(groupRowData.name);
					$('#userGroupName').attr('disabled','disabled');
				}else{
					$('#userGroupName').val('');
					$('#groupOKBtn').attr('disabled','disabled');
					$('#userGroupName').focus();
				}
				$('#availableQueue').multiselect({
					templates:{
						button: '<button type="button" class="multiselect dropdown-toggle" data-toggle="dropdown" style="width:300px !important;height:34px !important;"><div class="multiselect-selected-text" style="width:150px;height:100%;float:left;margin-left:60px;"></div> <div style="width:0px;height:0px;border-left:5px solid transparent; border-right: 5px solid transparent;border-top:8px solid #000000;float:right;margin-top:5px;"></div></button>',
						li: '<li style="width:200px;"><a tabindex="0"><label style="margin-top:0px;margin-bottom:0px;font-weight:400;"></label></a></li>'
					},
					buttonWidth:'300px',
					includeSelectAllOption:true,
					selectAllText:nls.selectAllQueue,
					disableIfEmpty: true
				});

				$('#availableQueue').multiselect('dataprovider',options.availableQueues);
			}
		});
	});