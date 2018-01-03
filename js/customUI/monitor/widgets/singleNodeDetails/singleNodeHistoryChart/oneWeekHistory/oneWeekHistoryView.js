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
	
	'customUI/monitor/widgets/singleNodeDetails/singleNodeHistoryChart/oneWeekHistory/widgets/oneWeekcpuView',
	'customUI/monitor/widgets/singleNodeDetails/singleNodeHistoryChart/oneWeekHistory/widgets/oneWeekdiskView',
	'customUI/monitor/widgets/singleNodeDetails/singleNodeHistoryChart/oneWeekHistory/widgets/oneWeekenergyView',
	'customUI/monitor/widgets/singleNodeDetails/singleNodeHistoryChart/oneWeekHistory/widgets/oneWeekloadView',
	'customUI/monitor/widgets/singleNodeDetails/singleNodeHistoryChart/oneWeekHistory/widgets/oneWeekmemoryView',
	'customUI/monitor/widgets/singleNodeDetails/singleNodeHistoryChart/oneWeekHistory/widgets/oneWeeknetworkView',
	'customUI/monitor/widgets/singleNodeDetails/singleNodeHistoryChart/oneWeekHistory/widgets/oneWeektemperatureView',
	
	'customUI/monitor/widgets/singleNodeDetails/singleNodeHistoryChart/oneWeekHistoryMax/oneWeekcpuMaxView',
	'customUI/monitor/widgets/singleNodeDetails/singleNodeHistoryChart/oneWeekHistoryMax/oneWeekdiskMaxView',
	'customUI/monitor/widgets/singleNodeDetails/singleNodeHistoryChart/oneWeekHistoryMax/oneWeekenergyMaxView',
	'customUI/monitor/widgets/singleNodeDetails/singleNodeHistoryChart/oneWeekHistoryMax/oneWeekloadMaxView',
	'customUI/monitor/widgets/singleNodeDetails/singleNodeHistoryChart/oneWeekHistoryMax/oneWeekmemoryMaxView',
	'customUI/monitor/widgets/singleNodeDetails/singleNodeHistoryChart/oneWeekHistoryMax/oneWeeknetworkMaxView',
	'customUI/monitor/widgets/singleNodeDetails/singleNodeHistoryChart/oneWeekHistoryMax/oneWeektemperatureMaxView',
	
	'text!./templates/allNodesTmpl.mustache',
	'i18n!./nls/allNodes'
	],function(Marionette,urlConstants, constants, eventBus,
		     oneWeekcpuView,oneWeekdiskView,oneWeekenergyView,oneWeekloadView,
		     oneWeekmemoryView,oneWeeknetworkView,oneWeektemperatureView,
		     oneWeekcpuMaxView,oneWeekdiskMaxView,oneWeekenergyMaxView,
		     oneWeekloadMaxView,oneWeekmemoryMaxView,oneWeeknetworkMaxView,oneWeektemperatureMaxView,
		     template, nls
		){
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
           
	            var cpu=new oneWeekcpuView({el:$('#oneHourHistory_cpu')});
	                cpu.render();
	            
	            var disk=new oneWeekdiskView({el:$('#oneHourHistory_disk')});
	                disk.render();
	                  
	            var energy=new oneWeekenergyView({el:$('#oneHourHistory_enery')});
	                energy.render();
	            
	            var load=new oneWeekloadView({el:$('#oneHourHistory_load')});
	                load.render();
	            
	            var memory=new oneWeekmemoryView({el:$('#oneHourHistory_memory')});
	                memory.render();
	                     
	            var network=new oneWeeknetworkView({el:$('#oneHourHistory_network')});
	                network.render();
	            
	            var temperature=new oneWeektemperatureView({el:$('#oneHourHistory_temperature')});
	                temperature.render();
	            
	            //默认选中cpu
	            $("#select_oneHourHistory_cpu").css("background-color","#f2f2f2");
	            
	            //点击新建具体load视图开始
	            $("#select_oneHourHistory_load").click(function(){
	            	eventBus.off(constants.refreshOneWeekCpuMax);
	            	//change background-color
	            	$("#select_oneHourHistory_load").css("background-color","#f2f2f2");
	            	$("#select_oneHourHistory_network").css("background-color","#ffffff");
	            	$("#select_oneHourHistory_cpu").css("background-color","#ffffff");
	            	$("#select_oneHourHistory_temprature").css("background-color","#ffffff");
	            	$("#select_oneHourHistory_memory").css("background-color","#ffffff");
	            	$("#select_oneHourHistory_enery").css("background-color","#ffffff");
	            	$("#select_oneHourHistory_disk").css("background-color","#ffffff");

	            	var loadMax=new oneWeekloadMaxView({el:$('#monitor_modal_down_right')});           
	                    loadMax.render();
                     
//                  
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
	            	 eventBus.off(constants.refreshOneWeekCpuMax);
	            	var networkMax=new oneWeeknetworkMaxView({el:$('#monitor_modal_down_right')});
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
	            	          eventBus.off(constants.refreshOneWeekCpuMax);
	            	var cpuMax=new oneWeekcpuMaxView({el:$('#monitor_modal_down_right')});
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
	            	      eventBus.off(constants.refreshOneWeekCpuMax);
	            	var temperatureMax=new oneWeektemperatureMaxView({el:$('#monitor_modal_down_right')});
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
	            	                  
                  eventBus.off(constants.refreshOneWeekCpuMax);
	            	var memoryMax=new oneWeekmemoryMaxView({el:$('#monitor_modal_down_right')});
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
	            	             
	                eventBus.off(constants.refreshOneWeekCpuMax);
	            	var energyMax=new oneWeekenergyMaxView({el:$('#monitor_modal_down_right')});
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
	            	                        
                 eventBus.off(constants.refreshOneWeekCpuMax);
	            	var diskMax=new oneWeekdiskMaxView({el:$('#monitor_modal_down_right')});
                        diskMax.render();

	            });
                //点击disk视图结束执行

           
           
          },
          

		

		
		});
	});