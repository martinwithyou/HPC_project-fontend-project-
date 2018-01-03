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
	'bootstrap',
	'datatables',
    'datatables_bootstrap',
    'term',
	'termwindow',
	'customUI/monitor/widgets/listView/weight/modal/modalView',
	'utils/constants/urlConstants',
	'utils/constants/constants',
	'utils/eventBus',
	'customUI/monitor/widgets/singleNodeDetails/nodeInfoModle/nodeInfoModleView',
	'text!./templates/gListTmpl.mustache',
	'i18n!./nls/gList',
	'css!./style/gList.css'
	],function(Marionette ,bootstrap, dataTable, datatable_bootstrap, term,termwindow,modalView,
		        urlConstants, constants,
		        eventBus,nodeInfoModleView,template, nls){
		return Marionette.ItemView.extend({
			template:template,
			templateHelpers:function(){
				return {
					nls:nls
				};
			},
			ui:{
				gListTable:'#gListTable'
			},
			onDestroy: function(){
		    	$("body").css("background-color", "#F6F6F4");
		  	},
            onRender:function(){
				var _this=this;
				var id=this.options.id;
				this.ui.gListTable.dataTable({
					responsive: true,
				    bPaginate:true,
				    bInfo:true,
				    sLengthMenu:'',
				    bLengthChange:true,
					//				    language: {
					//                  "url": require.toUrl('') + "translation/datatables.chinese.json"
					//                  },
					columns:[										
					{data:null,"title": "<input id=\"checkbox_id_all\" name=\"checkbox_name_all\" type=\"checkbox\" value=\"\">" },
					{'data': 'hostname','title': nls.nodeName,'className': 'dt-center'},
					{'data': 'status','title': nls.nodeStatus,'className': 'dt-center'},
					{'data': 'power_status','title': nls.monitor_turn_on_off,'className': 'dt-center'},
					{'data': 'type','title': nls.nodeType,'className': 'dt-center'},
					{'data': 'bmc_ipv4','title': nls.managementIP,'className': 'dt-center'},
					{'data': 'mgt_ipv4','title': nls.OSIP,'className': 'dt-center'},
					{'data': 'cpuCores','title': nls.CPUCores,'className': 'dt-center'},
					{'data': 'memoryUsage','title': nls.usedMemory + "/" + nls.totalMemory,'className': 'dt-center'},
					{'data': 'storageUsage','title': nls.usedStorage + "/" + nls.totleStorage,'className': 'dt-center'},
					{'data': 'groups','title': nls.groups ,'className': 'dt-center'}
					],
                    language:{
					  "sProcessing":   nls.sProcessing,
					  "sLengthMenu":   nls.sLengthMenu,
					  "sZeroRecords":  nls.sZeroRecords,
					  "sInfo":         nls.sInfo,
					  "sInfoEmpty":    nls.sInfoEmpty,
					  "sInfoFiltered": nls.sInfoFiltered,
					  "sInfoPostFix":  "",
					  "sSearch":      nls.sSearch,
					  "sUrl":          "",
					  "sEmptyTable":    nls.sEmptyTable,
					  "sLoadingRecords": nls.sLoadingRecords,
					  "sInfoThousands":  ",",
					  "oPaginate": {
					    "sFirst":    nls.sFirst,
					    "sPrevious": nls.sPrevious,
					    "sNext":     nls.sNext,
					    "sLast":     nls.sLast
					  },
					  "oAria": {
					    "sSortAscending":  nls.sSortAscending,
					    "sSortDescending": nls.sSortDescending
					  }
					},
                	aaSorting: [[1, "desc"]],
	                aoColumnDefs:[//设置列的属性，此处设置第一列不排序,
                    	{"bSortable": false,
                         "targets": 0,
                    	 "data":null,
                    	 "defaultContent":'<input type="checkbox" value="" name="checkname">'
                    	},
						{
						  "targets": [1], // 目标列位置，下标从0开始
						  "data": "hostname", // 数据列名
						  "render": function(data, type, full) { // 返回自定义内容
						      return data+"<span class='g_monitor_node_details' id='g_icon_details' title='"+nls.prompt_node_details+"'></span>";
						  }
						},
						{
						  "targets": [3], // 目标列位置，下标从0开始
						  "data": "power_status", // 数据列名
						  "render": function(data, type, full) { // 返回自定义内容
							if(data.toLowerCase()=="off"){
						      return "<span class='g_list_power_on' id='g_icon_on'  title='"+nls.prompt_power_on+"'></span>";
							} else {	
						      return "<span class='g_list_power_off' id='g_icon_off'  title='"+nls.prompt_power_off+"'></span>";
							}
						  }
						},
						{
						  "targets": [5], // 目标列位置，下标从0开始
						  "data": "bmc_ipv4", // 数据列名
						  "render": function(data, type, full) { // 返回自定义内容
							if (data != "") {
								return '<a href="https://' +data + '" target="_blank">' + data + '</a>' + "<span class='g_list_kvm' id='g_icon_kvm' title='"+nls.prompt_kvm+"'></span>"
							} else {
							    return "<span class='g_list_kvm' id='g_icon_kvm' title='"+nls.prompt_kvm+"'></span>"
							}
						  }
						},
						{
						  "targets": [6], // 目标列位置，下标从0开始
						  "data": "mgt_ipv4", // 数据列名
						  "render": function(data, type, full) { // 返回自定义内容
							return data+"<span class='g_list_ssh' id='g_icon_ssh' title='"+nls.prompt_ssh+"'></span>"
						  }
						}
	                ],	
					ajax:{
						'url':urlConstants.nodegroups+id+'/',
						// 'url':'/static/js/customUI/monitor/widgets/groups/groupView/widgets/gListView/data/gList.json',
						'dataSrc':function(res){
							var data=res.nodes,
								_nodeStatus=[],
								_nodesType=[];
							$.each(data,function(index,item){
								var _usedMemory=parseInt(item.memory_used/1024),
									_totalMemory=parseInt(item.memory_total/1024),
									_usedStorage=parseInt(item.disk_used),
								    _totalStorage=parseInt(item.disk_total),
								    _typeArr=item.type.split(',');
								item['memoryUsage']=_usedMemory+"GB/"+_totalMemory+"GB";
								item['storageUsage']=_usedStorage+"GB/"+_totalStorage+"GB";
								item['cpuCores']=item.processors_total+nls.CPUCoreUnit;
								switch(item.status.toLowerCase()){
									case "off":
										item.status=nls.offStatus;
										break;
									case "busy":
										item.status=nls.busyStatus;
										break;
									case "used":
										item.status=nls.workingStatus;
										break;
									case "idle":
										item.status=nls.idleStatus;
										break;
								}
								$.each(_typeArr,function(i,type){
									switch(type.toLowerCase()){
										case "head":
											_typeArr[i]=nls.headNodeType;
											break;
										case "compute":
											_typeArr[i]=nls.computeNodeType;
											break;
										case "gpu":
											_typeArr[i]=nls.gpuNodeType
											;break;
										case "io":
											_typeArr[i]=nls.ioNodeType;
											break;
										case "login":
											_typeArr[i]=nls.loginNodeType;
											break;
									}
									if($.inArray(_typeArr[i],_nodesType)==-1){
										if($.trim(_typeArr[i])!=''){
											_nodesType.push(_typeArr[i]);
										}										
									}
								});								
								item.type=_typeArr.join(',');
								if($.inArray(item.status,_nodeStatus)==-1){
									if($.trim(item.status)!=''){
										_nodeStatus.push(item.status);
									}									
								}								
							});
							_this.nodeStatusArr=_nodeStatus;
							_this.nodeTypeArr=_nodesType;
							return data;
						}
					}
				});
				eventBus.off(constants.refreshGListTable);
				eventBus.on(constants.refreshGListTable,_this.refreshTable);
				$('#gListTable').click(function(){
					var _checkedLen=$("input:checked:not(#checkbox_id_all)").length;
					if(_checkedLen>0){
						$('#g_shutup').removeAttr('disabled');
						$('#g_shutdown').removeAttr('disabled');
						$('#g_kvm').removeAttr('disabled');
						$('#g_ssh').removeAttr('disabled');
					}else{
						$('#g_node').attr('disabled','disabled');
						$('#g_shutup').attr('disabled','disabled');
						$('#g_shutdown').attr('disabled','disabled');
						$('#g_kvm').attr('disabled','disabled');
						$('#g_ssh').attr('disabled','disabled');
					};
				});
		        // 点击单个input框
		        $('#gListTable tbody').on('click', 'input[name="checkname"]', function () {
					$(this).parents("tr").toggleClass('selected');
		        });

	            /**
	             * 全选/全不选
	             */

	            $('#checkbox_id_all').click( function () {
				    if(this.checked){ 
				        $("input[name='checkname']").prop('checked', true);
						$('#gListTable tbody tr[role="row"]').addClass('selected');
				    }else{ 
				        $("input[name='checkname']").removeAttr('checked');
						$('#gListTable tbody tr[role="row"]').removeClass('selected');
				    } 
	            })
	            // 翻页取消选中状态和排序
				$('#gListTable').on('page.dt order.dt',function() {
					$('#gListTable tbody tr[role="row"]').removeClass('selected');
					$("input[type='checkbox']").removeAttr("checked");
		        });

		        // 点击icon
		        $('#gListTable tbody').on('click', '#g_icon_details', function () {
			        // 开关机摸态框
			        var g_modalView=new modalView({el:$('#g_status_model')});
			        g_modalView.render();
					var data=$('#gListTable').DataTable().row($(this).parents('tr')).data();
					var id = data.id;
	            	$("#body").attr("data-node_id",id);
					var g_modal_view=new nodeInfoModleView({el:$("#g_mymodal")});
					g_modal_view.render();
                	$("#fourth_mymodal").modal("show");
		        });
		        $('#gListTable tbody').on('click', '#g_icon_on', function () {
					var data=$('#gListTable').DataTable().row($(this).parents('tr')).data();
					var id = data.id;
					$("#g_on_id").text(data.hostname);
					$("#g_powon_modal").attr("data-id",id);
					$("#g_powon_modal").modal("show");
		        });
		        $('#gListTable tbody').on('click', '#g_icon_off', function () {
					var data=$('#gListTable').DataTable().row($(this).parents('tr')).data();
					var id = data.id;
					$("#g_off_id").text(data.hostname);
					$("#g_powoff_modal").attr("data-id",id);
					$("#g_powoff_modal").modal("show");
		        });
		        $('#gListTable tbody').on('click', '#g_icon_kvm', function () {		
					var data=$('#gListTable').DataTable().row($(this).parents('tr')).data();
					var hostname=data.hostname;				
					new TerminalWindow('api/nodes/'+hostname+'/console/sessions/', hostname, 0, 60);
		        });
		        $('#gListTable tbody').on('click', '#g_icon_ssh', function () {
					var data=$('#gListTable').DataTable().row($(this).parents('tr')).data();
					var hostname=data.hostname;	
					new TerminalWindow('/api/nodes/'+hostname+'/shell/sessions/', hostname, 0, 60);
		        });
				// 单行关机
				$('#g_powoff_modal').on('shown.bs.modal',function(){
      	   			var _id=$("#g_powoff_modal").attr("data-id");
					$('#confirmPowerOff').unbind('click');
					$('#confirmPowerOff').click(function(e){
						e.preventDefault();
						e.stopPropagation();
						$("#g_powoff_modal").modal("hide");
          	   			$("#progressDialog_loading").modal('show');
                  	    $.ajax({
		              	   	type:"put",
              	   			url:urlConstants.onOrOff+_id+'/',
		              	   	// type:"get",
		              	   	// url:'/static/js/customUI/monitor/widgets/groups/groupView/widgets/gListView/data/turn_off.json',
      						data:{"operation":"turn_off"},
		              	   	async:false,
		              	   	success:function(res){
		              	   		var _data=res;
		              	   		if(_data.ret == "success"){
                  	   				$("#progressDialog_loading").modal('hide');
                  	   				$("#progressDialog_line_off").modal('show');
                  	   				$("#progressDialog_line_off .g-state").text(nls.success);
                  	   				$("#progressDialog_line_off .state_off img").attr("src","/static/js/customUI/user/dashboard/job/resources/ic_check_green_36x36.png");
		              	   		} else {
                  	   				$("#progressDialog_loading").modal('hide');
                  	   				$("#progressDialog_line_off").modal('show');
                  	   				$("#progressDialog_line_off .g-state").text(nls.error);
              	   					$("#progressDialog_line_off .state_off img").attr("src","/static/js/customUI/user/dashboard/job/resources/ic_clear_red_36x36.png");
		              	   		}
		          	    	},
		              	   	error:function(XMLHttpRequest, textStatus, errorThrown) {
							 console.log("XMLHttpRequest.status:"+XMLHttpRequest.status+"\n"+
							 	"XMLHttpRequest.readyState:"+XMLHttpRequest.readyState+"\n"+"textStatus:"+textStatus);
						    },
                  	    });
					});
				});

				// 单行开机
				$('#g_powon_modal').on('shown.bs.modal',function(){
      	   			var _id=$("#g_powon_modal").attr("data-id");
					$('#confirmPowerOn').unbind('click');
					$('#confirmPowerOn').click(function(e){
						e.preventDefault();
						e.stopPropagation();
						$("#g_powon_modal").modal("hide");
          	   			$("#progressDialog_loading").modal('show');
                  	    $.ajax({
		              	   	type:"put",
              	   			url:urlConstants.onOrOff+_id+'/',
		              	   	// type:"get",
		              	   	// url:'/static/js/customUI/monitor/widgets/groups/groupView/widgets/gListView/data/turn_on.json',
      						data:{"operation":"turn_on"},
		              	   	async:false,
		              	   	success:function(res){
		              	   		var _data=res;
		              	   		if(_data.ret == "success"){
                  	   				$("#progressDialog_loading").modal('hide');
                  	   				$("#progressDialog_line_on").modal('show');
                  	   				$("#progressDialog_line_on .g-state").text(nls.success);
                  	   				$("#progressDialog_line_on .state_on img").attr("src","/static/js/customUI/user/dashboard/job/resources/ic_check_green_36x36.png");
		              	   		} else {
                  	   				$("#progressDialog_loading").modal('hide');
                  	   				$("#progressDialog_line_on").modal('show');
                  	   				$("#progressDialog_line_on .g-state").text(nls.error);
              	   					$("#progressDialog_line_on .state_on img").attr("src","/static/js/customUI/user/dashboard/job/resources/ic_clear_red_36x36.png");
		              	   		}
		          	    	},
		              	   	error:function(XMLHttpRequest, textStatus, errorThrown) {
							 console.log("XMLHttpRequest.status:"+XMLHttpRequest.status+"\n"+
							 	"XMLHttpRequest.readyState:"+XMLHttpRequest.readyState+"\n"+"textStatus:"+textStatus);
						    },
                  	    });
					});
				});

				// 多行开机
				$("#g_shutup").unbind("click");
				$("#g_shutup").on("click",function(){
					var _shutup=$('#gListTable').DataTable().rows('.selected').data(),
						_shutupList=[];
					$.each(_shutup,function(index,item){
						_shutupList.push(item.hostname);
					});
					$("#g_powonrow_modal .tips-content").empty();
					$("#g_powonrow_modal .tips-content").append(_shutupList.join("，"));
					if(_shutupList.length > 0){
						$("#g_powonrow_modal").modal("show");
					}
				});
				$('#g_powonrow_modal').on('shown.bs.modal',function(){
					$('#confirmPowerOnRow').unbind("click");
					$('#confirmPowerOnRow').click(function(e){
						e.preventDefault();
						e.stopPropagation();
						$("#g_powonrow_modal").modal("hide");
						var _shutup=$('#gListTable').DataTable().rows('.selected').data(),
							_shutupList=[];
						$.each(_shutup,function(index,item){
							_shutupList.push({id:item.id,name:item.hostname});
						});
						var _shutupLen=_shutupList.length;
						var _shutupState=[];
						var _stateup=null;
              	   		$("#progressDialog_loading").modal('show');
						$.each(_shutupList,function(index,item){	
							_this.shutUpRow(index,item.id,item.name,_shutupState);
						});
              	   		$("#progressDialog_loading").modal('hide');
              	   		$("#progressDialog_on").modal("show");
          	   			$("#progressDialog_on .state_on").empty();
              	   		$.each(_shutupState,function(index,item){
              	   			if(item.ret == "success"){
              	   				$("#progressDialog_on .state_on").append("<img/><div class='g-state'>"+item.name+nls.success_turn_on+"</div>");
              	   				$("#progressDialog_on .state_on img").attr("src","/static/js/customUI/user/dashboard/job/resources/ic_check_green_36x36.png");
              	   			} else {
              	   				$("#progressDialog_on .state_on").append("<img/><div class='g-state'>"+item.name+nls.error_turn_on+"</div>");
              	   				$("#progressDialog_on .state_on img").attr("src","/static/js/customUI/user/dashboard/job/resources/ic_clear_red_36x36.png");
              	   			}
              	   		});
					});
				});


				// 多行关机
				$("#g_shutdown").unbind("click");
				$("#g_shutdown").on("click",function(){
					var _shutdown=$('#gListTable').DataTable().rows('.selected').data(),
						_shutdownList=[];
					$.each(_shutdown,function(index,item){
						_shutdownList.push(item.hostname);
					});
					$("#g_powoffrow_modal .tips-content").empty();
					$("#g_powoffrow_modal .tips-content").append(_shutdownList.join("，"));
					if(_shutdownList.length > 0){
						$("#g_powoffrow_modal").modal("show");
					}
				});
				$('#g_powoffrow_modal').on('shown.bs.modal',function(){
					$('#confirmPowerOffRow').unbind("click");
					$('#confirmPowerOffRow').click(function(e){
						e.preventDefault();
						e.stopPropagation();
						$("#g_powoffrow_modal").modal("hide");
						var _shutdown=$('#gListTable').DataTable().rows('.selected').data(),
							_shutdownList=[];
						$.each(_shutdown,function(index,item){
							_shutdownList.push({id:item.id,name:item.hostname});
						});
						var _shutdownLen=_shutdownList.length;
						var _shutdownState=[];
						var _statedown=null;
              	   		$("#progressDialog_loading").modal('show');
						$.each(_shutdownList,function(index,item){	
							_this.shutDownRow(index,item.id,item.name,_shutdownState);
						});
              	   		$("#progressDialog_loading").modal('hide');
              	   		$("#progressDialog_off").modal("show");
          	   			$("#progressDialog_off .state_off").empty();
              	   		$.each(_shutdownState,function(index,item){
              	   			if(item.ret == "success"){
              	   				$("#progressDialog_off .state_off").append("<img/><div class='g-state'>"+item.name+nls.success_turn_off+"</div>");
              	   				$("#progressDialog_off .state_off img").attr("src","/static/js/customUI/user/dashboard/job/resources/ic_check_green_36x36.png");
              	   			} else {
              	   				$("#progressDialog_off .state_off").append("<img/><div class='g-state'>"+item.name+nls.error_turn_off+"</div>");
              	   				$("#progressDialog_off .state_off img").attr("src","/static/js/customUI/user/dashboard/job/resources/ic_clear_red_36x36.png");
              	   			}
              	   		});
					});
				});


				// 多行kvm
				$("#g_kvm").unbind("click");
				$("#g_kvm").on("click",function(){
					var _kvm=$('#gListTable').DataTable().rows('.selected').data(),
						_kvmList=[];
					$.each(_kvm,function(index,item){
						_kvmList.push(item.hostname);
					});
					$.each(_kvmList,function(index,item){
						_this.kvmRow(item,index*580+60);
					});
				});
				// 多行ssh
				$("#g_ssh").unbind("click");
				$("#g_ssh").on("click",function(){
					var _ssh=$('#gListTable').DataTable().rows('.selected').data(),
						_sshList=[];
					$.each(_ssh,function(index,item){
						_sshList.push(item.hostname);
					});
					$.each(_sshList,function(index,item){
						_this.sshRow(item,index*580+60);
					});
				});

        	},
        	shutUpRow:function(index,node_id,node_name,_shutupState){
          	    $.ajax({
              	   	type:"put",
      	   			url:urlConstants.onOrOff+node_id+'/',
              	   	// type:"get",
              	   	// url:'/static/js/customUI/monitor/widgets/groups/groupView/widgets/gListView/data/turn_on.json',
              	   	data:{"operation":"turn_on"},
              	   	async:false,
              	   	success:function(res){
              	   		var _data=res;
              	   		// 暂时当后台返回success时当做开机成功,''开机失败
              	   		if(_data.ret == "success"||_data.ret == "failed"){
              	   			_stateup={name:node_name,ret:_data.ret};
              	   			_shutupState.push(_stateup);
              	   		} 
          	    	},
              	   	error:function(XMLHttpRequest, textStatus, errorThrown) {
					 console.log("XMLHttpRequest.status:"+XMLHttpRequest.status+"\n"+
					 	"XMLHttpRequest.readyState:"+XMLHttpRequest.readyState+"\n"+"textStatus:"+textStatus);
				    }
          	    });
        	},
        	shutDownRow:function(index,node_id,node_name,_shutdownState){
          	    $.ajax({
              	   	type:"put",
      	   			url:urlConstants.onOrOff+node_id+'/',
              	   	// type:"get",
              	   	// url:'/static/js/customUI/monitor/widgets/groups/groupView/widgets/gListView/data/turn_off.json',
      				data:{"operation":"turn_off"},
              	   	async:false,
              	   	success:function(res){
              	   		var _data=res;
              	   		// 暂时当后台返回success时当做关机成功,''关机失败
              	   		if(_data.ret == "success"||_data.ret == "failed"){
              	   			_statedown={name:node_name,ret:_data.ret};
              	   			_shutdownState.push(_statedown);
              	   		} 
          	    	},
              	   	error:function(XMLHttpRequest, textStatus, errorThrown) {
					 console.log("XMLHttpRequest.status:"+XMLHttpRequest.status+"\n"+
					 	"XMLHttpRequest.readyState:"+XMLHttpRequest.readyState+"\n"+"textStatus:"+textStatus);
				    }
          	    });
        	},
        	kvmRow:function(node_hostname,num){
        		// 第一个参数url+hostname，第二个参数是显示的窗口标题，第三四个是定位的left，top
        		new TerminalWindow('api/nodes/'+node_hostname+'/console/sessions/', node_hostname, 0, num);
        	},
        	sshRow:function(node_hostname,num){
        		new TerminalWindow('api/nodes/'+node_hostname+'/console/sessions/', node_hostname, 0, num);
        	},
			refreshTable:function(){
				if ($(".modal.in").length > 0 || $(".termwindow").length > 0) {
					return;
				};
				var _checkedLen=$("input:checked:not(#checkbox_id_all)").length;
				if(_checkedLen>0){
					return
				};
				var _gListTable=$('#gListTable').DataTable();
				_gListTable.ajax.reload();
				$('#listTable tbody tr[role="row"]').removeClass('selected');
				$("input[type='checkbox']").removeAttr("checked");

				$('#g_node').attr('disabled','disabled');
				$('#g_shutup').attr('disabled','disabled');
				$('#g_shutdown').attr('disabled','disabled');
				$('#g_kvm').attr('disabled','disabled');
				$('#g_ssh').attr('disabled','disabled');
			}
		});
	});
