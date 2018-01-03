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
	'text!./templates/depositModalTmpl.mustache',
	'i18n!../nls/accountingMgt'
	],function(Marionette, cookie, utils, urlConstants, progressModalView, messageModalView, template, nls){
		'use strict';
		return Marionette.ItemView.extend({
			template:template,
			queryDeposits:null,

			templateHelpers:function(){
				return {
					nls:nls
				};
			},

			onRender:function(){				
				var _options=this.options;
				var _this=this;
				this.initModalData(_options.selectedGroup,_options.depositMode);

				$('#depositModal').modal('show');

				$('#depositInput').keyup(function(){
					var amountRegExp=/^(([1-9]\d{0,6})|\d)(\.\d{1,4})?$/;
					var amountValue=$('#depositInput').val();
					var _chargeRate=parseFloat(_options.selectedGroup.charge_rate);
					if(amountRegExp.test(amountValue)){
						$('#depositOKBtn').removeAttr('disabled');
						
						if(_options.depositMode){
							var _amount=parseFloat(amountValue);
							var _sumValue = parseFloat(_options.selectedGroup.balance) + parseFloat(amountValue);
							if(_amount>1000000){
								$('#depositOKBtn').attr('disabled','disabled');
								utils.hideMessageOnSpot('#depositInput');
								utils.showMessageOnSpot('#depositInput',nls.amountRuleText);
								$('#depositHintArea').css('display','none');
							}
							if(_chargeRate!=0){
								$('#hintforSumHours').text(parseFloat(_sumValue/_chargeRate).toFixed(0));								
							}else{
								$('#hintforSumHours').text(nls.hintforInfinitHours);
							}
							$('#hintforUserDeposit').css('display','inline-block');
							$('#depositHintArea').css('display','block');							
						}else{
							var _sumValue = parseFloat(_options.selectedGroup.balance) - parseFloat(amountValue);
							if(_sumValue<0){
								$('#depositOKBtn').attr('disabled','disabled');
								utils.hideMessageOnSpot('#depositInput');
								utils.showMessageOnSpot('#depositInput',nls.deductValueMaxHint);
								$('#depositHintArea').css('display','none');
							}else{
								utils.hideMessageOnSpot('#depositInput');
								if(_chargeRate!=0){
									$('#hintforSumHours').text(parseInt(_sumValue/_chargeRate));
								}else{
									$('#hintforSumHours').text(nls.hintforInfinitHours);
								}
								
								$('#hintforUserDeduct').css('display','inline-block');
								$('#depositHintArea').css('display','block');
							}
						}
					}else{
						$('#depositOKBtn').attr('disabled','disabled');
						utils.showMessageOnSpot('#depositInput',nls.chargeRateRuleText);						
						$('#depositHintArea').css('display','none');
					}
				});
				$('#depositOKBtn').click(function(){					
					var _groupName=_options.selectedGroup.name;
					var _depositMode=_options.depositMode;					
					var _depositValue=0;
					if(_depositMode){
						_depositValue=$('#depositInput').val()
					}else{
						_depositValue=-$('#depositInput').val();
					}
					var _data={
						bill_group_name:_groupName,
						credits:Number(_depositValue).toFixed(1)
					};

					$.ajax({
						type:'POST',
						url: urlConstants.deposit,
						dataType:'json',
						contentType:'application/json',
						data:$.toJSON(_data),
						
						success:function(res){
							var _data=res;
							//to query deposit status and then update group data
							$('#depositModal').modal('hide');
							var _progressModal=new progressModalView({
								el:'#progressArea'
							});
							_progressModal.render();
							_this.queryDeposits=setInterval(function(){_this.queryDepositStatus(_data);},2000);
							
						},
						error:function(res){
							var reponseObj=res.responseJSON;
							if(reponseObj&&reponseObj.detail){
								$('#msgArea').addClass('alert alert-danger').text(reponseObj.detail);
							}
							if(res.status==400){
								if(reponseObj&&reponseObj.credits&&reponseObj.credits.length>0){
									$('#msgArea').addClass('alert alert-danger').text(reponseObj.credits[0]);
								}
							}
						}
					});
				});
			},

			initModalData:function(rowData,depositMode){
				if(depositMode){
					//show deposit view -- headers, input and tips
					$('.deductClass').css('display','none');
					$('.depositClass').css('display','block');
				}else{
					//show deduct view -- headers, input and tips
					$('.depositClass').css('display','none');
					$('.deductClass').css('display','block');
				}
				$('#accountingGroupName').text(rowData.name);
				$('#currentBalanceSpan').text(rowData.balance);
				var currentBalance=parseFloat(rowData.balance);
				var currentRate=parseFloat(rowData.charge_rate);
				if(currentRate!=0){
					var _remainingHours=parseInt(currentBalance/currentRate);
					$('#currentBalanceHours').text(_remainingHours);
				}else{
					$('#currentBalanceHours').text(nls.hintforInfinitHours);
				}				
			},
			queryDepositStatus:function(depositRes){				
				var _url=depositRes.url;
				var _this=this;
				var _groupID=depositRes.bill_group_id;
				$.ajax({
					url:_url,
					type:'GET',
					dataType:'json',
					success:function(res){
						var _data=res;
						//res.status is Ready or Error
						if(_data.status=="Ready"||_data.status=="Error"){
							//once deposit status is Ready/Error, group status is updated immediately????Or still Depositing
							clearInterval(_this.queryDeposits);
							$('#progressModal').modal('hide');
							var _message=(_this.options.depositMode)?((_data.status=="Ready")?nls.depositSuccessMsg:nls.depositErrorMsg):((_data.status=="Ready")?nls.deductSuccessMsg:nls.deductErrorMsg);
							var _messageModal=new messageModalView({
								el:'#messageArea',
								type:(_data.status=="Ready")?"success":"error",
								message:_message
							});
							_messageModal.render();
							_this.queryGroupInfo(_groupID);
						}						
					},
					error:function(res){
						var reponseObj=res.responseJSON;
						if(reponseObj&&reponseObj.detail){
							$('#msgArea').addClass('alert alert-danger').text(reponseObj.detail);
						}
					}
				})
			},
			queryGroupInfo:function(groupID){
				var _url=urlConstants.billGroup+groupID;
				var _this=this;
				
				$.ajax({
					url:_url,
					type:'GET',
					dataType:'json',
					success:function(res){
						var _data=res;
						if(_data.status=="Ready"){//group is already deposited
							//$('#messageModal').modal('hide');
							var _billGroupTable=$('#accountingGrid').dataTable();
										
							var _groupTRNode=$('.DTTT_selected.selected')[0];	
							_billGroupTable.fnUpdate(_data,_groupTRNode);
							$('#accountingGrid').trigger('click');
						}
						/*
						if deposit failed, group status is Ready/Error?????????????
						*/
					},
					error:function(res){
						var reponseObj=res.responseJSON;
						if(reponseObj&&reponseObj.detail){
							$('#msgArea').addClass('alert alert-danger').text(reponseObj.detail);
						}
					}
				})
			}
		});
	});