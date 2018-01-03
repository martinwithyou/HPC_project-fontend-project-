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
	'utils/constants/urlConstants',
	'utils/constants/constants',
	'utils/eventBus',
	'text!./templates/allNodesTmpl.mustache',
	'i18n!./nls/allNodes',
	'css!./style/allNodes.css'
	],function(Marionette,  urlConstants, constants, eventBus, template, nls){
		return Marionette.ItemView.extend({
			template:template,
			templateHelpers:function(){
				return {
					nls:nls
				};
			},

			onDestroy: function(){

		    $("body").css("background-color", "#F6F6F4");
		    
		    },

			onRender:function(){
				
			$("body").css("background-color", "white");
			
			this.refreshTable();
			
			eventBus.on(constants.refreshNodeData,this.refreshTable);
			
			//点击开关机触发事件开始
			$("#new_icon_monitor_turn_icon_out").click(function(){
				
				var result=$(".new_icon_monitor_turn_character").html();
				
				var id=Number($("#body").attr("data-node_id"));
				
				
				if(result==nls.open){
					
					
				$("#g_powonrow_modal_sigle_model .tips-content").html("<span>"+nls.node_name+":"+ $("#node_data_hostname").text()+"</span>");
	            
	            $("#g_powonrow_modal_sigle_model").modal('show');
	                  	   		
	            $("#confirmPowerOnRow_one_sigle_model").click(function(){
	            	
	            	
	                $("#g_powonrow_modal_sigle_model").modal('hide');
	                  	   			
	                $("#progressDialog").modal('show');
	                
	                $.ajax({
						type:"put",
						url:urlConstants.node+Number($("#body").attr("data-node_id")),
						data:{"operation":"turn_on"},
	                    success:function(res){
	                    	
	                  	   		          var data=res;
                                       
	                  	   		          if(data.ret == "success"){
	                  	   		          	
	                  	   		          $("#progressDialog").modal("hide");
	                  	   		          
	                  	   		          $("#the_result_of_operation").html($("#node_data_hostname").text()+"："+nls.open);
	                  	   		          
	                  	   		          $("#progressDialog_1").modal("show");
	                  	   		
	                  	   		          }else if(data.ret == "failed"){
	                  	   		          	
	                  	   		          	 $("#progressDialog").modal("hide");
	                  	   		          
	                  	   		             $("#the_result_of_operation_close").html($("#node_data_hostname").text()+"："+nls.open);
	                  	   		             
	                  	   		          	 $("#progressDialog_4").modal("show");
	                  	   		          }
	                  	   		
	                  	},
						error:function(){
							console.log("put error!");
						}
					});
	                  	   			
	           
	              
	            });
					

					
				}else if(result==nls.shutdown){
					
					    $("#g_powoffrow_modal_sigle_model .tips-content").html("<span>"+nls.node_name+":"+ $("#node_data_hostname").text()+"</span>");
					   
	                  	$("#g_powoffrow_modal_sigle_model").modal('show');
	                  	   		
	                  	$("#confirmPowerOffRow_one_sigle_model").click(function(){

	                  	   		$("#g_powoffrow_modal_sigle_model").modal('hide');
	                  	   		
	                  	   		$("#progressDialog").modal('show');
	                  	   		
					            $.ajax({
						           type:"put",
						           url:urlConstants.node+Number($("#body").attr("data-node_id")),
						           data:{"operation":"turn_off"},
						           async:true,
	                               success:function(res){
	                  	   		       var data=res;
                                       
	                  	   		          if(data.ret == "success"){
	                  	   		          	
	                  	   		          $("#progressDialog").modal("hide");
	                  	   		          
	                  	   		          $("#the_result_of_operation").html($("#node_data_hostname").text()+":"+nls.shutdown);
	                  	   		          
	                  	   		          $("#progressDialog_1").modal("show");
	                  	   		
	                  	   		          }else if(data.ret == "failed"){
	                  	   		          	
	                  	   		          	 $("#progressDialog").modal("hide");
	                  	   		          
	                  	   		             $("#the_result_of_operation_close").html($("#node_data_hostname").text()+"："+nls.shutdown);
	                  	   		             
	                  	   		          	 $("#progressDialog_4").modal("show");
	                  	   		          }
                            
	                  	            },
						           error:function(){
							           console.log("put error!");
						            }
					            });
						
	                  	   });
	         
				}
			});
			//点击开关机触发事件结束
			
			//点击执行kvm开始
			$("#new_icon_monitor_WebKVM_out").click(function(){
				
				new TerminalWindow('api/nodes/'+ $("#node_data_hostname").text()+'/console/sessions/', $("#node_data_hostname").text(),0, 0);
				
			});
			//点击执行kvm结束
			
		    //点击执行SSH开始
		    $("#new_icon_monitor_WebSSH_out").click(function(){
				
				new TerminalWindow('/api/nodes/'+ $("#node_data_hostname").text()+'/shell/sessions/', $("#node_data_hostname").text(),0,0);
				
			});
		    //点击执行SSH结束
			
			},
			
			refreshTable:function(){
				
			  // console.log("执行该方法!");
			   $.ajax({
			   	type:"get",
			   	url:urlConstants.node+Number($("#body").attr("data-node_id"))+"/",
			   	async:true,
			   	success:function(res){
			   		
					var data= res.node;
					
					$.each(data,function(index,item){
						
						if(index=="hostname"){
							
							$("#node_data_hostname").html(item);
							
						}
						
						if(index=="status"){
							//判断状态
							var strObj=item;
							
							if(strObj=="Idle"){
								
								strObj=nls.free;
								$("#node_data_status").html(strObj);
								$("#node_data_status_picture").css("background-color","rgb(143,233,165)");
								
							}else if(strObj=="Busy"){
								
								strObj=nls.busy;
								$("#node_data_status").html(strObj);
							    $("#node_data_status_picture").css("background-color","rgb(255,204,0)");
							    
							}else if(strObj=="Used"){
								
								strObj=nls.used;
								$("#node_data_status").html(strObj);
								$("#node_data_status_picture").css("background-color","rgb(253,241,0)");
								$("#node_data_status_picture").css("margin-left","0px");
								
							}else if(strObj=="Off" ){
								
								strObj=nls.shutdown;
								$("#node_data_status").html(strObj);
								$("#node_data_status_picture").css("background-color","rgb(222,222,222)");
								
							}
							
							
						}
						
						if(index=="type"){
							var stringArr= new Array();
							
					            stringArr= item.split(",");
							 
								$.each(stringArr,function(i,type){
									switch(type.toLowerCase()){
										case "head":
											stringArr[i]=nls.head;break;
										case "compute":
											stringArr[i]=nls.compute;break;
										case "gpu":
											stringArr[i]=nls.gpu;break;
										case "io":
											stringArr[i]=nls.io;break;
										case "login":
											stringArr[i]=nls.login;break;
									}
									
								});
								
							$("#node_data_type").html(stringArr);
							
						}
						if(index=="mgt_ipv4"){
							
							$("#node_data_mgt_ipv4").html(item);
							
						}
						
						if(index=="bmc_ipv4"){
							
							$("#node_data_bmc_ipv4").html(item);
						
						}
						
						if(index=="memory_total"){
							
							var memory=parseInt(item/1024)+"";
							    
							var memoryResoult=memory +"G"
							
							$("#node_data_memory_total_kb").html(memoryResoult);
							
						}
						if(index=="disk_total"){
							
							var disk=item+"G";
							
							$("#node_data_disk_total_gb").html(disk);
						}
						
						if(index=="groups"){
							
							$("#node_data_groups").html(item);
						}
						
						if(index=="machinetype"){
							
							$("#node_data_machine_model").html(item);
						}

						if(index=="power_status"){
							
							if(item=="On"){
								
								$(".new_icon_monitor_turn_icon").addClass("new_icon_monitor_turn_off");
								$(".new_icon_monitor_turn_character").html(nls.shutdown);
								
							}else if(item=="Off"){
								
								$(".new_icon_monitor_turn_icon").addClass("new_icon_monitor_turn_on");
								$(".new_icon_monitor_turn_character").html(nls.open);
								
							}
							
						}
						
						if(index=="processors_total"){
							
							$("#node_data_processors_total").html(item+nls.core);
							
						}
					});
				
				
			   		
			   	},
			   	error:function(){
			   		console.log("error");
			   	}
			   });
			
			}

		});
	});