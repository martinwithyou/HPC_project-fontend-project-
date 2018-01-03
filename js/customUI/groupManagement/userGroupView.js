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
	'datatables',
	'datatables_bootstrap',
	'dataTables_tableTools',
    'utils/eventBus',
    'utils/constants/constants',
    'utils/constants/urlConstants',
	'customUI/groupManagement/widgets/userGroupModal/userGroupModalView',
	'text!./templates/userGroupTmpl.mustache',
	'i18n!./nls/userGroup',
	'css!./style/userGroup'
	],function(Marionette, multiselect, dataTable, datatables_bootstrap, dataTables_tableTools, eventBus, constants, urlConstants,
		userGroupModalView, template, nls){
		return Marionette.ItemView.extend({
			template:template,

			templateHelpers:function(){
				return {
					nls:nls
				};
			},

			ui:{
				groupTable:'#groupTable'
			},

			onShow:function(){
				
				$("body").css("background-color","#ffffff");
				
				var _this=this;
				this.ui.groupTable.dataTable({
					responsive:true,
					bPaginate:true,
					bInfo:true,
					sLengthMenu:'',
					bLengthChange:true,
					

					language: {
                    "url": require.toUrl('') + "translation/datatables.chinese.json"
                    },

					columns:[
					{
						data:null,defaultContent:''
					},{
						'title':nls.groupName,'data':'name',
						'className':'dt-center'
					}, {
						'title':nls.groupStatus,'data':'status',
						'className':'dt-center'
					},{
						'title' : nls.currentUserCount,'data':'userCount',
						'className':'dt-center'
					},
					/*
					{
						'title':nls.maxUserCount,'data':'maxUserCount'
					}, {
						'title':nls.onlineUserCount,'data':'onlineUserCount'
					},
					*/
					{
						'title':nls.availableQueue,'data':'queueList',
						'className':'dt-center'
					},{
						'title': nls.lastOperation,'data':'last_operation_time',
						'className':'dt-center'
					}
					/*
					, {
						'title':nls.resourceLimit,'data':'resourceLimit'
					}
					*/],
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
					},

					fnRowCallback:function(nRow,aData,iDisplayIndex){
						var _groupStatus=aData.status;
						var _iconClass=_groupStatus.toLowerCase()+"StatusIcon";
						switch(_groupStatus){
							case "Ready":
								_groupStatus=nls.readyStatus;
								break;
							case "Creating":
								_groupStatus=nls.creating;
								break;
							case "Deleting":
								_groupStatus=nls.deleting;
								break;
							case "Updating":
								_groupStatus=nls.updating;
								break;
							case "Error":
								_groupStatus=nls.invalid;
								break;
						}
						if(_groupStatus!="Ready"){
							$('td:eq(2)',nRow).html('<div><span class="'+_iconClass+'"></span><span>'+_groupStatus+'</span></div>');
						}
						var _lastOperationTime=aData.last_operation_time;
						if(_lastOperationTime){
							var _time=new Date(parseInt(Date.parse(_lastOperationTime))).toLocaleString();
							if(aData.last_operation_result=="failed"){
								$('td:eq(5)',nRow).html('<div><div>'+_time+'</div><div><span class="warningIcon"></span><span>'+aData.last_operation_message+'</span></div></div>');
							}else{
								$('td:eq(5)',nRow).html('<div>'+_time+'</div>');
							}
						}

						return nRow;
					},

					ajax:{
						'url':urlConstants.userGroup,
						'dataSrc':function(res){
							var data=res;
							$.each(data,function(index,item){
								_this.extendGroupData(item);
							});
							return data;
						}
					}
				});

				eventBus.on(constants.refreshUserGroup,_this.refreshTable);

				$('#groupTable').click(function(){
					//var _table=$('#groupTable').dataTable();
					//var _allRows=_table.fnGetNodes();
					/*
					//from api: to get selected rows from table
					var oTT = TableTools.fnGetInstance( 'groupTable' );
				    var aSelectedTrs = oTT.fnGetSelected();
				    */
					var _allSelected=$('.DTTT_selected.selected');
					if(_allSelected.length>0){
						if(_allSelected.length==1){
							$('#editGroupBtn').removeAttr('disabled');
						}else{
							$('#editGroupBtn').attr('disabled','disabled');
						}
						$('#deleteGroupBtn').removeAttr('disabled');
					}else{
						$('#editGroupBtn').attr('disabled','disabled');
						$('#deleteGroupBtn').attr('disabled','disabled');
					}
				});

				$("#addGroupBtn,#editGroupBtn").click(function(e){
					var _allQueues=[];
					var _editMode=false;
					var groupInfo=null;
					var _table=$('#groupTable').DataTable();

					if(e.target.id=="editGroupBtn"){
						_editMode=true;
						groupInfo=_table.rows('.selected').data()[0];
					}
					$.ajax({
						type:'GET',
						url:urlConstants.queues+'?role=admin',
						success:function(res){
							var availableQueues=[];
							var queuesforAll=[];
							var queueOptions=[];

							//var _queuesList=$.parseJSON(res);

							$.each(res,function(index,item){
								var queue=item.name;

								if(!item.acl_group_enabled){
									queueOptions.push({'label':queue+'('+nls.mustQueue+')','value':queue,selected:true,disabled:true});
								}else{
									if(_editMode){
										if($.inArray(queue,groupInfo.queueList)!=-1){
											queueOptions.push({'label':queue,'value':queue,selected:true});
										}else{
											queueOptions.push({'label':queue,'value':queue});
										}

									}else{
										//add the original queue list to multiselect
										queueOptions.push({'label':queue,'value':queue});
									}
								}
							});
							var groupModal=new userGroupModalView({el:'#userGroupModalID',
																   availableQueues:queueOptions,
																   editMode:_editMode,
																   selectedGroupData:groupInfo
																   });//need to handle empty array!
							groupModal.render();

						},
						error:function(res){
							console.log(res);
						}
					});

				});
				$('#deleteGroupBtn').click(function(){
					$('#confirmModal-deleteGroup').modal('show');
					if($('#deleteGroupMsg').hasClass('alert alert-danger')){
						$('#deleteGroupMsg').removeClass('alert alert-danger').text('');
					}

					var _groupData=$('#groupTable').DataTable().rows('.selected').data();
					var _groupTRNode=$('.DTTT_selected.selected');
					var _groupList=[];
					var _groupName="";
					$.each(_groupData,function(index,item){
						var _group={
							id:item.id,
							TRNode:_groupTRNode[index]
						};
						_groupList.push(_group);

						_groupName+=item.name;
						if(index!=_groupData.length-1){
							_groupName+=",";
						}
						$('#selectedGroupName').text(_groupName);
					});

					$('#confirmDeleteGroup').click(function(){
						$.each(_groupList,function(index,item){
							_this.deleteGroup(item);
						});
					});
					$('#confirmModal-deleteGroup').on('shown.bs.modal',function(){

					});
				});
			},

			refreshTable:function(){
				// if modal dialog exists, don't update
				if ($(".modal.in").length > 0) {
					return;
				}
				var _userTable=$('#groupTable').DataTable();
				_userTable.ajax.reload();
			},

			deleteGroup:function(group){
				var _this=this;
				var _groupTable=$('#groupTable').dataTable();
				$.ajax({
					type:'DELETE',
					url:urlConstants.userGroup+group.id+'/',

      				success:function(res){
      					var _data=res;
      					if(_data){
  							_this.extendGroupData(_data);
      						if(_data.status=="Deleting"){
      							_groupTable.fnUpdate(_data,group.TRNode);
      						}else if(_data.status=="Deleted"){
      							_groupTable.fnDeleteRow(group.TRNode._DT_RowIndex);
      						}
      					}
      					console.log('group is deleted');
      					$('#confirmModal-deleteGroup').modal('hide');
      				},
      				error:function(res){
      					console.log('fail to delete user');
  						if(res.responseJSON&&res.responseJSON.detail){
  							$('#deleteGroupMsg').text(res.responseJSON.detail).addClass('alert alert-danger');
  						}
      				}
				});
			},

			extendGroupData:function(originalData){
				originalData['queueList']=[];
				if(originalData.os_users){
					originalData['userCount']=originalData.os_users.length;
				}
				if(originalData.queues){
					$.each(originalData.queues,function(i,j){
						originalData['queueList'].push(j.name);
					});
				}
			}

		});
	});