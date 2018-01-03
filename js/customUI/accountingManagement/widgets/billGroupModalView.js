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
	'text!./templates/billGroupModalTmpl.mustache',
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

				$('#createBillingGroupModal').modal('show');

				$('#newBillGroupName,#chargeRate,#billAmount').keyup(function(e){
					
					var billGroupNameRuleRegExp=/^[a-zA-Z][a-zA-Z0-9_]{1,19}$/;
					var chargeRateRegExp=/^(([1-9]\d{0,6})|\d)(\.\d{1,4})?$/;
					var amountRegExp=/^(([1-9]\d{0,6})|\d)(\.\d{1,4})?$/;

					var _billGroupName=$('#newBillGroupName').val();
					var _chargeRateVal=$('#chargeRate').val();
					var _billAmountVal=$('#billAmount').val();

					var _billGroupNameOKFlag=false;
					var _chargeRateOKFlag=false;
					var _billAmountOKFlag=false;

					if(_billGroupName!==""&&billGroupNameRuleRegExp.test(_billGroupName)){
						_billGroupNameOKFlag=true;
						utils.hideMessageOnSpot('#newBillGroupName');
					}

					if(chargeRateRegExp.test(_chargeRateVal)){
						var _chargeRate=parseFloat(_chargeRateVal);
						if(_chargeRate>1000000){
							utils.showMessageOnSpot('#chargeRate',nls.chargeRateRuleText);
						}else{
							_chargeRateOKFlag=true;
							utils.hideMessageOnSpot('#chargeRate');	
						}						
					}					
					if(amountRegExp.test(_billAmountVal)){
						var _amount=parseFloat(_billAmountVal);
						if(_amount>1000000){
							utils.showMessageOnSpot('#billAmount',nls.amountRuleText);
						}else{
							_billAmountOKFlag=true;
							utils.hideMessageOnSpot('#billAmount');
						}						
					}

					if(_billGroupNameOKFlag&&_chargeRateOKFlag&&_billAmountOKFlag){
						$('#createBillGroupOKBtn').removeAttr('disabled');
						var _chargeRate=parseFloat(_chargeRateVal);
						var _billAmount=parseFloat(_billAmountVal);
						if(_chargeRate==0){
							$('#hintforHours').text(nls.hintforInfinitHours);							
						}else{
							var _hours=parseInt(_billAmount/_chargeRate);//show the int hours
							$('#hintforHours').text(_hours);
						}	
						$('#hintArea').css('display','block');					
					}else{
						$('#hintArea').css('display','none');
						if(!_billGroupNameOKFlag&&e.target.id=="newBillGroupName"){
							utils.showMessageOnSpot('#newBillGroupName',nls.billGroupNameRuleText,'right');
						}
						if(!_chargeRateOKFlag&&e.target.id=="chargeRate"){
							utils.showMessageOnSpot('#chargeRate',nls.chargeRateRuleText,'right');
						}
						if(!_billAmountOKFlag&&e.target.id=="billAmount"){
							utils.showMessageOnSpot('#billAmount',nls.amountRuleText,'right');
						}
						$('#createBillGroupOKBtn').attr('disabled','disabled');
					}
				});

				$('#createBillGroupOKBtn').click(function(){
					var _groupName=$('#newBillGroupName').val();
					var _creditsToDeposit=$('#billAmount').val();
					var _rate=$('#chargeRate').val();
					
					var _data={
						name:_groupName,
						charge_rate:Number(_rate).toFixed(1),
						//charged:_creditsToDeposit
						credits:Number(_creditsToDeposit).toFixed(1)
					};
					var _billGroupTable=$('#accountingGrid').dataTable();
					$.ajax({
						type:'POST',
						url:urlConstants.billGroup,
						
						dataType:'json',
						contentType:'application/json',
						data:$.toJSON(_data),
						success:function(res){
							$('#createBillingGroupModal').modal('hide');
							var _groupData=res;
							var _groupID=_groupData.id;
							var _progressModal=new progressModalView({
								el:'#progressArea'
							});
							_progressModal.render();
							_this.groupQuery=setInterval(function(){_this.queryGroupInfo(_groupID);},2000);
						
							//_billGroupTable.fnAddData(_groupData);
							
						},
						error:function(res){
							var responseObj=res.responseJSON;
							if(responseObj&&responseObj.detail){
								$('#billGroupMsgArea').addClass('alert alert-danger').text(responseObj.detail);
							}
							if(res.status==400){
								if(responseObj&&responseObj.name&&responseObj.name.length>0){
									$('#billGroupMsgArea').addClass('alert alert-danger').text(responseObj.name[0]);
								}
								if(responseObj&&responseObj.charge_rate&&responseObj.charge_rate.length>0){
									$('#billGroupMsgArea').addClass('alert alert-danger').text(responseObj.charge_rate[0]);
								}
								if(responseObj&&responseObj.credits&&responseObj.credits.length>0){
									$('#billGroupMsgArea').addClass('alert alert-danger').text(responseObj.credits[0]);
								}
							}
						}
					})
				});
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
							_this.showGroupStatusMsgModal({
								type:'success',
								message:nls.createGroupSuccessMsg,
								groupData:_data
							});	

						}
						if(_data.status=="Error"){
							_this.showGroupStatusMsgModal({
								type:'error',
								message:_data.last_operation_message,
								groupData:_data
							});
						}
					},
					error:function(res){
						console.log('query failed');
					}
				});
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
				var _billGroupTable=$('#accountingGrid').dataTable();
				_billGroupTable.fnAddData(options.groupData);
				$('#accountingGrid').trigger('click');
			}
		});
	});