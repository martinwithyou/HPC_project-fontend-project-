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
	
	'customUI/monitor/widgets/singleNodeDetails/singleNodeHistoryChart/oneDayHistory/widgets/oneDaycpuView',
	'customUI/monitor/widgets/singleNodeDetails/singleNodeHistoryChart/oneDayHistory/widgets/oneDaydiskView',
	'customUI/monitor/widgets/singleNodeDetails/singleNodeHistoryChart/oneDayHistory/widgets/oneDayenergyView',
	'customUI/monitor/widgets/singleNodeDetails/singleNodeHistoryChart/oneDayHistory/widgets/oneDayloadView',
	'customUI/monitor/widgets/singleNodeDetails/singleNodeHistoryChart/oneDayHistory/widgets/oneDaymemoryView',
	'customUI/monitor/widgets/singleNodeDetails/singleNodeHistoryChart/oneDayHistory/widgets/oneDaynetworkView',
	'customUI/monitor/widgets/singleNodeDetails/singleNodeHistoryChart/oneDayHistory/widgets/oneDaytemperatureView',
	
	'customUI/monitor/widgets/singleNodeDetails/singleNodeHistoryChart/oneDayHistoryMax/oneDaycpuMaxView',
	'customUI/monitor/widgets/singleNodeDetails/singleNodeHistoryChart/oneDayHistoryMax/oneDaydiskMaxView',
	'customUI/monitor/widgets/singleNodeDetails/singleNodeHistoryChart/oneDayHistoryMax/oneDayenergyMaxView',
	'customUI/monitor/widgets/singleNodeDetails/singleNodeHistoryChart/oneDayHistoryMax/oneDayloadMaxView',
	'customUI/monitor/widgets/singleNodeDetails/singleNodeHistoryChart/oneDayHistoryMax/oneDaymemoryMaxView',
	'customUI/monitor/widgets/singleNodeDetails/singleNodeHistoryChart/oneDayHistoryMax/oneDaynetworkMaxView',
	'customUI/monitor/widgets/singleNodeDetails/singleNodeHistoryChart/oneDayHistoryMax/oneDaytemperatureMaxView',
	
	'text!./templates/allNodesTmpl.mustache',
	'i18n!./nls/allNodes'
	],function(Marionette,urlConstants, constants, eventBus,
		     oneDaycpuView,oneDaydiskView,oneDayenergyView,oneDayloadView,oneDaymemoryView,oneDaynetworkView,oneDaytemperatureView,
		     oneDaycpuMaxView,oneDaydiskMaxView,oneDayenergyMaxView,oneDayloadMaxView,oneDaymemoryMaxView,oneDaynetworkMaxView,oneDaytemperatureMaxView,
//		     oneHourHistoryView,oneHourcpuMaxView,
//		     oneWeekHistoryView,oneWeekcpuMaxView,
//		     oneMonthHistoryView,oneMonthcpuMaxView,
		     template, nls){
		return Marionette.ItemView.extend({
			template:template,
			templateHelpers:function(){
				return {
					nls:nls
				};
			},

			onDestroy: function(){
		    // custom cleanup or destroying code, here
		    $("body").css("background-color", "#F6F6F4");
		    
			},

           onRender:function(){
           
	            var cpu=new oneDaycpuView({el:$('#oneHourHistory_cpu')});
	                cpu.render();
	            
	            var disk=new oneDaydiskView({el:$('#oneHourHistory_disk')});
	                disk.render();
	                  
	            var energy=new oneDayenergyView({el:$('#oneHourHistory_enery')});
	                energy.render();
	            
	            var load=new oneDayloadView({el:$('#oneHourHistory_load')});
	                load.render();
	            
	            var memory=new oneDaymemoryView({el:$('#oneHourHistory_memory')});
	                memory.render();
	                     
	            var network=new oneDaynetworkView({el:$('#oneHourHistory_network')});
	                network.render();
	            
	            var temperature=new oneDaytemperatureView({el:$('#oneHourHistory_temperature')});
	                temperature.render();
	            
	            //默认选中cpu
	            $("#select_oneHourHistory_cpu").css("background-color","#f2f2f2");
	            
	            //点击新建具体load视图开始
	            $("#select_oneHourHistory_load").click(function(){
	            	
	            	//change background-color
	            	$("#select_oneHourHistory_load").css("background-color","#f2f2f2");
	            	$("#select_oneHourHistory_network").css("background-color","#ffffff");
	            	$("#select_oneHourHistory_cpu").css("background-color","#ffffff");
	            	$("#select_oneHourHistory_temprature").css("background-color","#ffffff");
	            	$("#select_oneHourHistory_memory").css("background-color","#ffffff");
	            	$("#select_oneHourHistory_enery").css("background-color","#ffffff");
	            	$("#select_oneHourHistory_disk").css("background-color","#ffffff");

                        eventBus.off(constants.refreshOneDayCpuMax);
	            	var loadMax=new oneDayloadMaxView({el:$('#monitor_modal_down_right')});           
	                    loadMax.render();
                    
	            });
	            //点击新建具体load视图结束
                
                //点击network视图开始执行
                $("#select_oneHourHistory_network").click(function(){
	            	$("#select_oneHourHistory_load").css("background-color","#ffffff");
	            	$("#select_oneHourHistory_network").css("background-color","#f2f2f2");
	            	$("#select_oneHourHistory_cpu").css("background-color","#ffffff");
	            	$("#select_oneHourHistory_temprature").css("background-color","#ffffff");
	            	$("#select_oneHourHistory_memory").css("background-color","#ffffff");
	            	$("#select_oneHourHistory_enery").css("background-color","#ffffff");
	            	$("#select_oneHourHistory_disk").css("background-color","#ffffff");
	            	//alert("开始执行");
	            	 
	                    eventBus.off(constants.refreshOneDayCpuMax);
	            	var networkMax=new oneDaynetworkMaxView({el:$('#monitor_modal_down_right')});
	                    networkMax.render();
	               
	            });
                //点击network视图结束执行
                
                //点击cpu视图开始执行
                $("#select_oneHourHistory_cpu").click(function(){
	            	$("#select_oneHourHistory_load").css("background-color","#ffffff");
	            	$("#select_oneHourHistory_network").css("background-color","#ffffff");
	            	$("#select_oneHourHistory_cpu").css("background-color","#f2f2f2");
	            	$("#select_oneHourHistory_temprature").css("background-color","#ffffff");
	            	$("#select_oneHourHistory_memory").css("background-color","#ffffff");
	            	$("#select_oneHourHistory_enery").css("background-color","#ffffff");
	            	$("#select_oneHourHistory_disk").css("background-color","#ffffff");
	            	//alert("开始执行");
	            	 eventBus.off(constants.refreshOneDayCpuMax);
	            	var cpuMax=new oneDaycpuMaxView({el:$('#monitor_modal_down_right')});
	                    cpuMax.render();
	                
                   
	            });
                //点击cpu视图结束执行
                
                //点击temprature视图开始执行
                $("#select_oneHourHistory_temprature").click(function(){
	            	$("#select_oneHourHistory_load").css("background-color","#ffffff");
	            	$("#select_oneHourHistory_network").css("background-color","#ffffff");
	            	$("#select_oneHourHistory_cpu").css("background-color","#ffffff");
	            	$("#select_oneHourHistory_temprature").css("background-color","#f2f2f2");
	            	$("#select_oneHourHistory_memory").css("background-color","#ffffff");
	            	$("#select_oneHourHistory_enery").css("background-color","#ffffff");
	            	$("#select_oneHourHistory_disk").css("background-color","#ffffff");
	            	//alert("开始执行");
	            	        
	                    eventBus.off(constants.refreshOneDayCpuMax);
	            	var temperatureMax=new oneDaytemperatureMaxView({el:$('#monitor_modal_down_right')});
	                    temperatureMax.render();
	        
	            });
                //点击temprature视图结束执行
                
                //点击memory视图开始执行
                $("#select_oneHourHistory_memory").click(function(){
	            	$("#select_oneHourHistory_load").css("background-color","#ffffff");
	            	$("#select_oneHourHistory_network").css("background-color","#ffffff");
	            	$("#select_oneHourHistory_cpu").css("background-color","#ffffff");
	            	$("#select_oneHourHistory_temprature").css("background-color","#ffffff");
	            	$("#select_oneHourHistory_memory").css("background-color","#f2f2f2");
	            	$("#select_oneHourHistory_enery").css("background-color","#ffffff");
	            	$("#select_oneHourHistory_disk").css("background-color","#ffffff");
	            	//alert("开始执行");
	            	    eventBus.off(constants.refreshOneDayCpuMax);
	            	var memoryMax=new oneDaymemoryMaxView({el:$('#monitor_modal_down_right')});
                        memoryMax.render();
                     
         
	            });
                //点击memory视图结束执行
                
                //点击memory视图开始执行
                $("#select_oneHourHistory_enery").click(function(){
	            	$("#select_oneHourHistory_load").css("background-color","#ffffff");
	            	$("#select_oneHourHistory_network").css("background-color","#ffffff");
	            	$("#select_oneHourHistory_cpu").css("background-color","#ffffff");
	            	$("#select_oneHourHistory_temprature").css("background-color","#ffffff");
	            	$("#select_oneHourHistory_memory").css("background-color","#ffffff");
	            	$("#select_oneHourHistory_enery").css("background-color","#f2f2f2");
	            //	$("#select_oneHourHistory_enery").addClass("monitor_modal_up_right_td:hover");
	            	$("#select_oneHourHistory_disk").css("background-color","#ffffff");
	            	//alert("开始执行");
	            	   	eventBus.off(constants.refreshOneDayCpuMax);
	            	var energyMax=new oneDayenergyMaxView({el:$('#monitor_modal_down_right')});
                        energyMax.render();
	                

	            });
                //点击memory视图结束执行
             
               //点击disk视图开始执行
                $("#select_oneHourHistory_disk").click(function(){
                	
	            	$("#select_oneHourHistory_load").css("background-color","#ffffff");
	            	$("#select_oneHourHistory_network").css("background-color","#ffffff");
	            	$("#select_oneHourHistory_cpu").css("background-color","#ffffff");
	            	$("#select_oneHourHistory_temprature").css("background-color","#ffffff");
	            	$("#select_oneHourHistory_memory").css("background-color","#ffffff");
	            	$("#select_oneHourHistory_enery").css("background-color","#ffffff");
	            	$("#select_oneHourHistory_disk").css("background-color","#f2f2f2");
	            	//alert("开始执行");
	            	 eventBus.off(constants.refreshOneDayCpuMax);
	            	var diskMax=new oneDaydiskMaxView({el:$('#monitor_modal_down_right')});
                        diskMax.render();
                        
                    
	            });
                //点击disk视图结束执行

           //点击select框，下拉选择，切换不同的时间段
           //根据不同的options的值，拼接出不同的url
           //再将不同的url,作为参数，传入视图中做渲染
//         	$("#monitor_the_time_of_choice").on("change",function () {
//         		
//				var id=$("#monitor_the_time_of_choice  option:selected").text();
//				
//				var data_period=$("#monitor_the_time_of_choice  option:selected").attr("data-period");
//				
//				console.log(id);
//				
//				console.log(data_period);
//				
//				if(data_period=="past_hour"){
//					
//		            var nodeOneHourHistory =new oneHourHistoryView({el: $('#new_monitor_modal_down_left')});
//		                
//		                nodeOneHourHistory.render();
//		                
//		             var cpuMax= new cpuMaxView({el: $('#new_monitor_modal_down_right')});		                  
//		                  
//		                cpuMax.render();
//		                 
//					
//				}else if(data_period=="past_day"){
//					
//				//	var nodeOneDayHistory = new oneDayHistoryView({el: $('#new_monitor_modal_down_left')});
//					
//				//	    nodeOneDayHistory.render();
//					    
//				//	 var nodeOneDaycpuMax = new oneDaycpuMaxView({el: $('#new_monitor_modal_down_right')});
//					    
//				//	    nodeOneDaycpuMax.render();
//					
//				}else if(data_period=="past_week"){
//					
//				    
//				   	var nodeOneWeekHistory = new oneWeekHistoryView({el: $('#new_monitor_modal_down_left')});
//				
//				        nodeOneWeekHistory.render();
//				    
//				    var nodeOneWeekcpuMax = new oneWeekcpuMaxView({el: $('#new_monitor_modal_down_right')});
//					    
//					    nodeOneWeekcpuMax.render();
//				  
//				}else if(data_period=="past_month"){
//					
//				    var nodeOneMonthHistory = new oneMonthHistoryView({el: $('#new_monitor_modal_down_left')});
//				
//				        nodeOneMonthHistory.render();
//				    
//				    var nodeOneMonthcpuMax = new oneMonthcpuMaxView({el: $('#new_monitor_modal_down_right')});
//					    
//					    nodeOneMonthcpuMax.render();
//				
//				}
//
//			});	
//         
           
           

           
           
           
           
           
           
           
           
           
           
           
           
          },
          

		

		
		});
	});