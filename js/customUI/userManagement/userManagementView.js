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
	'datatables',
    'datatables_bootstrap',
    'dataTables_tableTools',
    'utils/eventBus',
    'utils/constants/constants',
    'utils/constants/urlConstants',
    'customUI/userManagement/widgets/userInfoModal/userInfoModalView',
	'text!./templates/userManagementTmpl.mustache',
	'i18n!./nls/userMgt',
	'css!./style/userManagement'
	],function(Marionette, cookie, dataTable, datatable_bootstrap, dataTables_tableTools, eventBus, constants, urlConstants, userInfoModalView, template, nls){
		return Marionette.ItemView.extend({
			template:template,
			allOSGroupArray:[],
			allBillGroupArray:[],
			isGroupRetrieved:false,

			templateHelpers:function(){
				return {
					nls:nls
				};
			},

			ui:{
				userTable:'#userGrid'
			},

			onShow:function(){
				
				$("body").css("background-color","#ffffff");
				
				var _this=this;
				this.ui.userTable.dataTable({
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
							data:null,defaultContent:''
						},{
							'title':nls.userName,'data':'username',
							'className':'dt-center'
						},{
							'title':nls.userStatus,	'data':'status',
							'className':'dt-center'
						},{
							'title':nls.roleName,'data':'role',
							'className':'dt-center'
						},{
							'title':nls.groupName,'data':'os_group.name',
							'className':'dt-center'
						},{
							'title':nls.accountingGroup,'data':'bill_group.name',
							'className':'dt-center'
						},{
							'title':nls.lastLoginTime,'data':'last_login',
							'className':'dt-center'
						},{
							'title':nls.emailAddress,'data':'email',
							'className':'dt-center'
						},{
							'title':nls.latestOperation,'data':'last_operation_time',
							'className':'dt-center'
						}
					],
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
						var _userStatus=aData.status;
						var _iconClass=_userStatus.toLowerCase()+"StatusIcon";
						switch(_userStatus){
							case "Ready":
								_userStatus=nls.readyStatus;
								break;
							case "Creating":
								_userStatus=nls.creating;
								break;
							case "Deleting":
								_userStatus=nls.deleting;
								break;
							case "Updating":
								_userStatus=nls.updating;
								break;
							case "Error":
								_userStatus=nls.invalid;
								break;
						}
						if(aData.status!="Ready"){
							$('td:eq(2)',nRow).html('<div><span class="'+_iconClass+'"></span><span>'+_userStatus+'</span></div>');
						}else{
							$('td:eq(2)',nRow).html('<div><span>'+_userStatus+'</span></div>');
						}
						var _lastLoginTime=aData.last_login;
						if(_lastLoginTime){
							var _time=new Date(parseInt(Date.parse(_lastLoginTime))).toLocaleString();
							$('td:eq(6)',nRow).html('<div><span>'+_time+'</span></div>');
						}

						var _lastOperationTime=aData.last_operation_time;
						if(_lastOperationTime){
							var _time=new Date(parseInt(Date.parse(_lastOperationTime))).toLocaleString();
							if(aData.last_operation_result=="failed"){
								$('td:eq(8)',nRow).html('<div><div>'+_time+'</div><div><span class="warningIcon"></span><span>'+aData.last_operation_message+'</span></div></div>');
							}else{
								$('td:eq(8)',nRow).html('<div>'+_time+'</div>');
							}
						}

						return nRow;
					},

					ajax:{
						//'url':'/static/js/json/allUsers.json',
						'url':urlConstants.users,
						'dataSrc':function(res){
							var data=res;
							if(data.length>0){
								$.each(data,function(index,item){
									if(item.is_admin){
										item['role']=nls.administratorRole;
									}else{
										item['role']=nls.operatorRole;
									}
								});
							}
							return data;
						}
					}
				});
               
				eventBus.on(constants.refreshUserProfile,_this.refreshTable);
                //新增修改样式代码开始
                //  alert($("#userGrid_length").html()); 
                //新增修改样式代码结束
				/* change button status based on grid selections*/
				$('#userGrid').click(function(){
					var _table=$('#userGrid').dataTable();
					var _allRows=_table.fnGetNodes();
					/*
					//from api: to get selected rows from table
						var oTT = TableTools.fnGetInstance( 'userGrid' );
					    var aSelectedTrs = oTT.fnGetSelected();
					*/
					var _allSelected=$('.DTTT_selected.selected');
					if(_allSelected.length>0){
						if(_allSelected.length==1){
							$('#editUser').removeAttr('disabled');
							$('#deleteUser').removeAttr('disabled');
						}else{
							$('#editUser').attr('disabled','disabled');
							$('#deleteUser').attr('diabled','disabled');
						}
					}else{
						$('#editUser').attr('disabled','disabled');
						$('#deleteUser').attr('disabled','disabled');
					}
				});
				$("#addUser,#editUser").click(function(e){
					var _editMode=false;
					var userInfo=null;
					var _table=$('#userGrid').DataTable();

					if(e.target.id=="editUser"){
						_editMode=true;
						userInfo=_table.rows('.selected').data()[0];//only one row could be edited
					}

					var _userGroupRequest=$.get(urlConstants.userGroup);//to get which group that current user belongs to
			        var _accountingGroupRequest=$.get(urlConstants.billGroup);


			        $.when(_userGroupRequest,_accountingGroupRequest).done(function(res1,res2){
			        	_this.isGroupRetrieved=true;
			        	_this.getAllOSGroups(res1[0]);
			       		_this.getAllBillGroups(res2[0]);

			       		var userInfoModal=new userInfoModalView({el:'#userInfoModalID',
			       												editMode:_editMode,
			       												originalUserInfo:userInfo,
			       												allOSGroups:_this.allOSGroupArray,
			       												allBillGroups:_this.allBillGroupArray});
						userInfoModal.render();
			        });

					/* not used in MVP version
					var _allQueues=[];
					$.get("/static/js/json/allQueues.json",function(res){
					var response=$.parseJSON(res);
					if(response.availableQueue){
						var data=response.availableQueue;
						$.each(data,function(index,value){
							var _option={'label':value,'value':value};
							_allQueues.push(_option);

						});
					}
					});
					*/
				});

				$('#deleteUser').click(function(){
					$('#confirmModal-deleteUser').modal('show');
					if($('#deleteErrorMsg').hasClass('alert alert-danger')){
						$('#deleteErrorMsg').removeClass('alert alert-danger').text('');
					}
					var _userData=$('#userGrid').DataTable().rows('.selected').data();

					var _selectedUserName="";
					$.each(_userData,function(index,item){
						_selectedUserName+=item.username;
						if(index!=_userData.length-1){
							_selectedUserName+=",";
						}
					});

					$('#selectedUserName').text(_selectedUserName);

				});
				$('#confirmModal-deleteUser').on('shown.bs.modal',function(){
					$('#confirmDeleteUser').click(function(e){
						e.preventDefault();
						e.stopPropagation();
						var _userData=$('#userGrid').DataTable().rows('.selected').data();
						var _userTRNode=$('.DTTT_selected.selected');
						var _userList=[];
						$.each(_userData,function(index,item){
							var _user={
								id:item.id,
								TRNode:_userTRNode[index]
							};
							_userList.push(_user);
						});
						$.each(_userList,function(index,item){
							_this.deleteUser(item);
						});

					});
				});
                 
				/* removed in MVP version
				$("#passwordSettings").click(function(){
					$("#passwordSettingModal").modal("show");
				});

				$("#pwdSettingOKBtn,#pwdSettingCancelBtn").click(function(){
					$("#passwordSettingModal").modal('hide');
				});
				*/
			},

			refreshTable:function(){
				// if modal dialog exists, don't update
				if ($(".modal.in").length > 0) {
					return;
				}
				if($('.DTTT_selected.selected').length>0){
					return
				}
				var _userTable=$('#userGrid').DataTable();
				_userTable.ajax.reload();
			},

			deleteUser:function(user){
				var _userTable=$('#userGrid').dataTable();
				$.ajax({
					type:'DELETE',
					url:urlConstants.users+user.id+'/',

      				success:function(res){
      					var _data=res;
      					if(_data){
      						if(_data.is_admin){
	      						_data['role']=nls.administratorRole;
	      					}else{
	      						_data['role']=nls.operatorRole;
	      					}
      					}

      					console.log('user is deleted');
      					$('#confirmDeleteUser').unbind('click');
      					$('#confirmModal-deleteUser').modal('hide');
      					if(_data&&_data.status=="Deleting"){
      						_userTable.fnUpdate(_data,user.TRNode);
      					}
      					if(_data&&_data.status=="Deleted"){
      						_userTable.fnDeleteRow(user.TRNode._DT_RowIndex);
      					}
      				},
      				error:function(res){
      					console.log('fail to delete user');
      					var responseObj=res.responseJSON;
  						if(responseObj&&responseObj.detail){
  							$('#deleteErrorMsg').addClass('alert alert-danger').text(responseObj.detail);
  						}
      				}
				});
			},
			getAllAvailableQueues:function(){
				var _allQueues=[];
				$.get("/static/js/json/allQueues.json",function(res){
					var response=$.parseJSON(res);
					if(response.availableQueue){
						var data=response.availableQueue;
						$.each(data,function(index,value){
							var _option={'label':value,'value':value};
							_allQueues.push(_option);
						});
					}
				});
				return _allQueues;
			},

			getAllOSGroups:function(data){
				var _this=this;
				_this.allOSGroupArray=[];
				$.each(data,function(index,item){
					_this.allOSGroupArray.push(item.name);
				});
				return _this.allOSGroupArray;
			},
			getAllBillGroups:function(data){
				var _this=this;
				_this.allBillGroupArray=[];
				$.each(data,function(index,item){
					_this.allBillGroupArray.push(item.name);
				})
				return _this.allBillGroupArray;
			}
		});
	});