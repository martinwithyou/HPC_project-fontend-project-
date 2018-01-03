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
    'utils/eventBus',
    'utils/constants/constants',
	'utils/constants/urlConstants',
	'datatables',
    'datatables_bootstrap',
    'dataTables_tableTools',
    'customUI/accountingManagement/widgets/billGroupModalView',
    'customUI/accountingManagement/widgets/chargeRateModalView',
    'customUI/accountingManagement/widgets/depositModalView',
    'customUI/accountingManagement/widgets/progressModalView',
    'customUI/accountingManagement/widgets/messageModalView',
	'text!./templates/accountingMgtTmpl.mustache',
	'i18n!./nls/accountingMgt',
	'css!./style/accountingMgt'
],function(Marionette, cookie, eventBus, constants, urlConstants, dataTable, datatable_bootstrap, dataTables_tableTools,
	billGroupModalView, chargeRateModalView, depositModalView, progressModalView, messageModalView, template, nls){
	'use strict';

	return Marionette.ItemView.extend({
		template:template,
		queryGroup:null,

		templateHelpers:function(){
			return {
				nls:nls
			};
		},

		ui:{
			accountingTable:'#accountingGrid'
		},

		onShow:function(){
			
			$("body").css("background-color","#ffffff");
			
			var _this=this;
			this.ui.accountingTable.dataTable({
				responsive: true,
				bPaginate:true,
				bInfo:true,
				sLengthMenu:'',
				bLengthChange:true,
	


				language: {
                "url": require.toUrl('') + "translation/datatables.chinese.json"
                },

				columns:[
				{
					'data':null, defaultContent:''
				},{
					'title': nls.accountingGroup, 'data':'name',
					'className':'dt-center'
				},
				/*{
					'title': nls.groupStatus, 'data':'status',
					'className': 'dt-center'
				},
				*/{
					'title': nls.rate+"("+nls.moneyType+"/"+nls.rateUnit+")", 'data':'charge_rate',
					'className':'dt-center'
				},{
					'title': nls.usedHours, 'data':'used_time',
					'className':'dt-center'
				},{
					'title': nls.usedCredits+"("+nls.moneyType+")", 'data': 'used_credits',
					'className':'dt-center'
				},{
					'title': nls.balance+"("+nls.moneyType+")", 'data':'balance',
					'className':'dt-center'
				}
				/*,{
					'title': nls.lastOperation, 'data':'last_operation_time',
					'className':'dt-center'
				}*/
				],
				ajax:{
					//'url':'/static/js/json/accountingGroups.json',
					'url':urlConstants.billGroup,
					'dataSrc':''
				},
				aoColumnDefs:[//设置列的属性，此处设置第一列不排序,
                	{"bSortable": false,
                     "targets": 0,
                	 "className":"check"
                	}
            	],
				dom: 'T<"clear">lfrtip',
				tableTools:{
					sRowSelect:'single',
					sRowSelector:'td:first-child',
					aButtons:[]
				}
				/*
				fnRowCallback:function(nRow,aData,iDisplayIndex){
					var _groupStatus=aData.status;
					var _iconClass=_groupStatus.toLowerCase()+"StatusIcon";
					if(_groupStatus!="Ready"){
						$('td:eq(2)',nRow).html('<div><span class="'+_iconClass+'"></span><span>'+_groupStatus+'</span></div>');
					}
					if(aData.last_operation_result=="failed"){
						$('td:eq(7)',nRow).html('<div><div>'+aData.last_operation_time+'</div><div><span class="warningIcon"></span><span>'+aData.last_operation_message+'</span></div></div>');
					}
					return nRow;
				},
				*/
			});

			eventBus.on(constants.refreshAccountGroup,_this.refreshTable);

			$('#accountingGrid').click(function(){
				var _selectedRow=$('.DTTT_selected.selected');
				if(_selectedRow.length>0){
					$('#changeRateBtn').removeAttr('disabled');
					$('#depositBtn').removeAttr('disabled');
					$('#deductBtn').removeAttr('disabled');
					$('#deleteBtn').removeAttr('disabled');
				}else{
					$('#changeRateBtn').attr('disabled','disabled');
					$('#depositBtn').attr('disabled','disabled');
					$('#deductBtn').attr('disabled','disabled');
					$('#deleteBtn').attr('disabled','disabled');
				}
			});
			$('#addNewBillGroupBtn').click(function(){
				var createBillGroupModalView=new billGroupModalView({
					el:'#createAccountingGroup'
				});
				createBillGroupModalView.render();
			});
			$('#changeRateBtn').click(function(){
				var _selectedRow=$('#accountingGrid').DataTable().rows('.selected').data()[0];
				if(_selectedRow.status=='Ready'){
					var changeRateModalView=new chargeRateModalView({
						el:'#changeChargeRate',
						selectedGroup:_selectedRow
					});
					changeRateModalView.render();
				}else if(_selectedRow.status=="Error"){
					var _messageModal=new messageModalView({
						el:'#messageArea',
						type:'error',
						message:nls.groupErrorStatusMsg+nls.changeRate+nls.groupErrorInstruction
					});
					_messageModal.render();
				}else{
					var _messageModal=new messageModalView({
						el:'#messageArea',
						type:'warning',
						message:nls.groupUpdatingMsg+nls.changeRate
					});
					_messageModal.render();
				}
			});
			$('#depositBtn, #deductBtn').click(function(e){
				var _selectedRow=$('#accountingGrid').DataTable().rows('.selected').data()[0];
				var _depositMode=false;
				var _addonMsg=nls.deductCredits;
				if(e.target.id=="depositBtn"){
					_depositMode=true;
					_addonMsg=nls.depositCredits;
				}
				if(_selectedRow.status=='Ready'){
					var depositsModalView=new depositModalView({
						el:'#depositBalance',
						selectedGroup:_selectedRow,
						depositMode:_depositMode
					});
					depositsModalView.render();
				}else if(_selectedRow.status=="Error"){
					var _msgKeyword=nls.deductCredits;
					if(_depositMode){
						_msgKeyword=nls.depositCredits;
					}
					var _messageModal=new messageModalView({
						el:'#messageArea',
						type:'error',
						message:nls.groupErrorStatusMsg+_msgKeyword+nls.groupErrorInstruction
					});
					_messageModal.render();
				}else{
					var _messageModal=new messageModalView({
						el:'#messageArea',
						type:'warning',
						message:nls.groupUpdatingMsg+_addonMsg
					});
					_messageModal.render();
				}
			});

			$('#deleteBtn').click(function(){
				var _selectedRow=$('#accountingGrid').DataTable().rows('.selected').data()[0];
				if(_selectedRow.bill_members.length>0){
					//can not delete the selected group
					//show a message box instead of confirmation dialog
					var _messageModal=new messageModalView({
						el:'#messageArea',
						type:'warning',
						message:nls.usersNonEmptyMessage
					});
					_messageModal.render();
				}else{
					//show confirmation modal and click ok to start deleting
					$('#selectedBillGroupName').text(_selectedRow.name);
					$('#deleteBillGroupBody').css('display','none');
					$('#deleteConfirmationModal').modal('show');
				}
			});
			$('#confirmDeleteBillGroup').click(function(){
				var _table=$('#accountingGrid').DataTable();

				var _selectedRow=_table.rows('.selected').data()[0];
				var _selectedGroupID=_selectedRow.id;

				$.ajax({
					type:'DELETE',
					url:urlConstants.billGroup+_selectedGroupID+'/',

					success:function(res){
						var _data=res;
						$('#deleteConfirmationModal').modal('hide');
						var _progressModal=new progressModalView({
							el:'#progressArea'
						});
						_progressModal.render();
						//query latest status of this group
						_this.queryGroup=setInterval(function(){_this.doQueryGroupStatus(_selectedGroupID);},2000);

					},
					error:function(res){
						var responseObj=res.responseJSON;
						if(responseObj&&responseObj.detail){
							$('#deleteErrorMsg').addClass('alert alert-danger').text(responseObj.detail);
							$('#deleteBillGroupBody').css('display','block');
						}
					}
				});
			});
		},

		refreshTable:function(){
			// if modal dialog exists, don't update
				if ($(".modal.in").length > 0) {
					return;
				}
			var _billGroupTable=$('#accountingGrid').DataTable();
			_billGroupTable.ajax.reload();
		},

		doQueryGroupStatus:function(groupID){
			var _url=urlConstants.billGroup+groupID;
			var _this=this;
			$.ajax({
				type:'GET',
				url:_url,
				dataType:'json',
				success:function(res){
					var _data=res;
					if(_data.status=="Error"){
						//deleting failed
						clearInterval(_this.queryGroup);
						$('#progressModal').modal('hide');
						var _messageModal=new messageModalView({
							el:'#messageArea',
							type:'error',
							message:nls.deleteGroupErrorMsg
						});
						_messageModal.render();
					}
				},
				error:function(res){
					//if 404, the group is deleted already
					//show delete success message and remove the group from table
					if(res.status==404){
						clearInterval(_this.queryGroup);
						$('#progressModal').modal('hide');
						var _messageModal=new messageModalView({
							el:'#messageArea',
							type:'success',
							message:nls.deleteGroupSuccessMsg
						});
						_messageModal.render();
						var _table=$('#accountingGrid').dataTable();
						var _groupTRNode=$('.DTTT_selected.selected')[0];
						_table.fnDeleteRow(_groupTRNode._DT_RowIndex);
					}
				}
			})
		}

	});
});