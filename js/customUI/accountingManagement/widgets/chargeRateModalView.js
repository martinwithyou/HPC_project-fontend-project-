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
	'utils/constants/urlConstants',
	'customUI/accountingManagement/widgets/progressModalView',
	'customUI/accountingManagement/widgets/messageModalView',
	'text!./templates/chargeRateModalTmpl.mustache',
	'i18n!../nls/accountingMgt'
	],function(Marionette, cookie, utils, urlConstants, progressModalView, messageModalView, template, nls){
		'use strict';
		return Marionette.ItemView.extend({
			template:template,
			groupQuery:null,

			templateHelpers:function(){
				return {
					nls:nls
				};
			},

			onRender:function(){
				var _this=this;
				var _options=this.options;
				this.initModalInfo(_options.selectedGroup);
				$('#changeRateModal').modal('show');
				$('#changeRateInput').keyup(function(){
					var chargeRateRegExp=/^(([1-9]\d{0,6})|\d)(\.\d{1,4})?$/;
					var _chargeRate=$('#changeRateInput').val();
					if(chargeRateRegExp.test(_chargeRate)){
						var _rate=parseFloat(_chargeRate);
						if(_rate>1000000){
							utils.showMessageOnSpot('#changeRateInput',nls.amountRuleText);
						}else{
							$('#changeRateOKBtn').removeAttr('disabled');
							utils.hideMessageOnSpot('#changeRateInput');
						}
						
					}else{
						$('#changeRateOKBtn').attr('disabled','disabled');
						utils.showMessageOnSpot('#changeRateInput',nls.amountRuleText);
					}
				});
				$('#changeRateOKBtn').click(function(){					
					var _rate=$('#changeRateInput').val();
					var _groupName=_options.selectedGroup.name;
					var _groupID=_options.selectedGroup.id;
					var _data={
						charge_rate:Number(_rate).toFixed(1)
					};

					$.ajax({
						type:'PUT',
						url:urlConstants.billGroup+_groupID+'/',
						dataType:'json',
						contentType:'application/json',
						data:$.toJSON(_data),
						
						success:function(res){
							var _data=res;
							$('#changeRateModal').modal('hide');
							var _progressModal=new progressModalView({
								el:'#progressArea'
							});
							_progressModal.render();
							_this.groupQuery=setInterval(function(){_this.queryGroupInfo(_groupID);},2000);
						
						},
						error:function(res){
							var reponseObj=res.responseJSON;
							if(reponseObj&&reponseObj.detail){
								$('#rateMsgArea').addClass('alert alert-danger').text(reponseObj.detail);
							}
							if(res.status==400){
								if(reponseObj&&reponseObj.charge_rate&&reponseObj.charge_rate.length>0){
									$('#rateMsgArea').addClass('alert alert-danger').text(reponseObj.charge_rate[0]);
								}
							}
						}
					});
				});
			},

			initModalInfo:function(rowData){
				$('#billGroupName').text(rowData.name);
				$('#currentRate').text(rowData.charge_rate);
			},

			queryGroupInfo:function(groupID){
				var _this=this;
				var _url=urlConstants.billGroup+groupID;
				$.ajax({
					url:_url,
					type:'GET',
					dataType:'json',
					success:function(res){
						var _data=res;
						if(_data.status=="Ready"){
							//update charge-rate finished successfully
							//close modals and show success message and then update table
							_this.showGroupStatusMsgModal({
								type:'success',
								message:nls.changeRateSuccessMsg
							});	
							var _billGroupTable=$('#accountingGrid').dataTable();
							
							var _groupTRNode=$('.DTTT_selected.selected')[0];	
							_billGroupTable.fnUpdate(_data,_groupTRNode);
							$('#accountingGrid').trigger('click');					
						}
						if(_data.status=="Error"){
							//update charge-rate failed
							_this.showGroupStatusMsgModal({
								type:'success',
								message:nls.changeRateErrorMsg
							});							
						}
					},
					error:function(res){
						//show message on dialog and do not close the dialog
						var reponseObj=res.responseJSON;
						if(reponseObj&&reponseObj.detail){
							$('#rateMsgArea').addClass('alert alert-danger').text(reponseObj.detail);
						}
					}
				})
			},
			showGroupStatusMsgModal:function(options){
				var _this=this;
				
				clearInterval(_this.groupQuery);
				
				$('#progressModal').modal('hide');
				var _messageModal=new messageModalView({
					el:'#messageArea',
					type:options.type,
					message:options.message
				});
				_messageModal.render();				
			}
		});
	});