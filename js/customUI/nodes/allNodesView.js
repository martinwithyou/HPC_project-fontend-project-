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
	'datatables',
	'datatables_bootstrap',
	'utils/constants/urlConstants',
	'utils/constants/constants',
	'utils/eventBus',
	'text!./templates/allNodesTmpl.mustache',
	'i18n!./nls/allNodes',
	'css!./style/allNodes.css'
	],function(Marionette, datatables, datatables_bootstrap, urlConstants, constants, eventBus, template, nls){
		return Marionette.ItemView.extend({
			template:template,
			templateHelpers:function(){
				return {
					nls:nls
				};
			},

			ui:{
				allNodesTable:'#allNodesTable'
			},

			nodeStatusArr:[],
			nodeTypeArr:[],

			onDestroy: function(){
		    // custom cleanup or destroying code, here
		    $("body").css("background-color", "#F6F6F4");
		  },

			onRender:function(){
				$("body").css("background-color", "white");
				var _this=this;
				_this.nodeStatusArr=[];
				_this.nodeTypeArr=[];

				this.ui.allNodesTable.dataTable({
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
                    	'data':'hostname','title':nls.nodeName,'className':'dt-center'
                    },{
                    	'data':'status','title':nls.nodeStatus,'className':'dt-center'
                    },{
                    	'data':'type','title':nls.nodeType,'className':'dt-center'
                    },{
                    	'data':'bmc_ipv4','title':nls.managementIP,'className':'dt-center'
                    },{
                    	'data':'mgt_ipv4','title':nls.OSIP,'className':'dt-center'
                    },{
                    	'data':'cpuCores','title':nls.CPUCores,'className':'dt-center'
                    },{
                    	'title':nls.usedMemory+"/"+nls.totalMemory,'data':'memoryUsage','className':'dt-center'
                    },{
                    	'title':nls.usedStorage+"/"+nls.totleStorage,'data':'storageUsage','className':'dt-center'
                    }
                    ],
                    ajax:{
						'url':urlConstants.nodes,
						'dataSrc':function(res){
							var data=res;
							var _nodeStatus=[];
							var _nodesType=[];
							$.each(data,function(index,item){
								var _usedMemory=parseInt(item.memory_used_kb/1024/1024);
								var _totalMemory=parseInt(item.memory_total_kb/1024/1024);
								item['memoryUsage']=_usedMemory+"GB/"+_totalMemory+"GB";
								var _usedStorage=parseInt(item.disk_used_gb);
								var _totalStorage=parseInt(item.disk_total_gb);
								item['storageUsage']=_usedStorage+"GB/"+_totalStorage+"GB";
								item['cpuCores']=item.processors_total+nls.CPUCoreUnit;

								switch(item.status.toLowerCase()){
									case "off":
										item.status=nls.offStatus;break;
									case "busy":
										item.status=nls.busyStatus;break;
									case "working":
										item.status=nls.workingStatus;break;
									case "idle":
										item.status=nls.idleStatus;break;
								}
								
								var _typeArr=item.type.split(',');
								$.each(_typeArr,function(i,type){
									switch(type.toLowerCase()){
										case "head":
											_typeArr[i]=nls.headNodeType;break;
										case "compute":
											_typeArr[i]=nls.computeNodeType;break;
										case "gpu":
											_typeArr[i]=nls.gpuNodeType;break;
										case "io":
											_typeArr[i]=nls.ioNodeType;break;
										case "login":
											_typeArr[i]=nls.loginNodeType;break;
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
					},
					fnInitComplete:function(oSettings,json){
						var _currentStatusFilter=$('#nodeStatusSelect').val();
						var _currentTypeFilter=$('#nodeTypeSelect').val();

						$('#nodeStatusSelect').empty();
						$.each(_this.nodeStatusArr,function(index,item){
							$('#nodeStatusSelect').append("<option value='"+item+"'>"+item+"</option>");
						});
						$('#nodeStatusSelect').append("<option value='showAll' selected='true'>"+nls.showAllStatus+"</option>");
						if(_currentStatusFilter!="showAll"&&$.inArray(_currentStatusFilter,_this.nodeStatusArr)==-1){
							$('#nodeStatusSelect').val("showAll");
						}else{
							$('#nodeStatusSelect').val(_currentStatusFilter);
						}

						$('#nodeTypeSelect').empty();
						$.each(_this.nodeTypeArr,function(index,item){
							$('#nodeTypeSelect').append("<option value='"+item+"'>"+item+"</option>");
						});
						$('#nodeTypeSelect').append("<option value='showAll' selected='true'>"+nls.showAllType+"</option>");
						if(_currentTypeFilter!="showAll"&&$.inArray(_currentTypeFilter,_this.nodeTypeArr)==-1){
							$('#nodeTypeSelect').val("showAll");
						}else{
							$('#nodeTypeSelect').val(_currentTypeFilter);
						}

						$('#nodesCount').text(json.length);
						$('#nodesCountArea').appendTo($('#allNodesTable_wrapper .row .col-sm-6:first'));

						$('#nodeStatusSelect').change(function(){
							var _nodeStatusFilter=$('#nodeStatusSelect').val();
							if(_nodeStatusFilter=="showAll"){
								_nodeStatusFilter="";
							}
							var _searchStr=$("input[type='search']").val();
							if($.trim(_searchStr)!=""){
								_searchStr=_this.generateSearchString(_nodeStatusFilter,_this.nodeStatusArr);
							}else{
								_searchStr=_nodeStatusFilter;
							}

							$('#allNodesTable').DataTable().search(_searchStr).draw();
						});
						$('#nodeTypeSelect').change(function(){
							var _nodeTypeFilter=$('#nodeTypeSelect').val();
							if(_nodeTypeFilter=="showAll"){
								_nodeTypeFilter="";
							}
							var _searchStr=$("input[type='search']").val();
							if($.trim(_searchStr)!=""){
								_searchStr=_this.generateSearchString(_nodeTypeFilter,_this.nodeTypeArr);
							}else{
								_searchStr=_nodeTypeFilter;
							}

							$('#allNodesTable').DataTable().search(_searchStr).draw();
						});
						$('#selectArea').prependTo($('#allNodesTable_wrapper .dataTables_filter'));
					},
					fnRowCallback:function(nRow,aData,iDisplayIndex){
						var _bmcIP=aData.bmc_ipv4;
						if(_bmcIP!=""){
							$('td:eq(3)',nRow).html('<a href="https://'+_bmcIP+'" target="_blank">'+_bmcIP+'</a>');
						}

						return nRow;
					}
				});
				eventBus.on(constants.refreshResource,_this.refreshTable);
			},

			generateSearchString:function(filter,arr){
				var _this=this;
				var _searchStr=$("input[type='search']").val();
				var _str="";
				var _flag=false;//false: the current search string do not contain status/type option
				if($.trim(_searchStr)!=''){
					var keyArr=_searchStr.split(" ");

					$.each(keyArr,function(index,item){
						if(item!=""){
							if($.inArray(item,arr)!=-1){
								item=filter;
								_flag=true;
							}

							_str+=" "+item;
						}
					});
					if(!_flag){
						_str+=" "+filter;
					}
				}
				return _str;
			},

			refreshTable:function(){
				var _table=$('#allNodesTable').DataTable();
				_table.ajax.reload();
			}
		});
	});