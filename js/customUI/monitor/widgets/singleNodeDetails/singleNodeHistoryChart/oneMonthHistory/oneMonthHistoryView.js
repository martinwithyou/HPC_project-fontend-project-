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
	
	'customUI/monitor/widgets/singleNodeDetails/singleNodeHistoryChart/oneMonthHistory/widgets/oneMonthcpuView',
	'customUI/monitor/widgets/singleNodeDetails/singleNodeHistoryChart/oneMonthHistory/widgets/oneMonthdiskView',
	'customUI/monitor/widgets/singleNodeDetails/singleNodeHistoryChart/oneMonthHistory/widgets/oneMonthenergyView',
	'customUI/monitor/widgets/singleNodeDetails/singleNodeHistoryChart/oneMonthHistory/widgets/oneMonthloadView',
	'customUI/monitor/widgets/singleNodeDetails/singleNodeHistoryChart/oneMonthHistory/widgets/oneMonthmemoryView',
	'customUI/monitor/widgets/singleNodeDetails/singleNodeHistoryChart/oneMonthHistory/widgets/oneMonthnetworkView',
	'customUI/monitor/widgets/singleNodeDetails/singleNodeHistoryChart/oneMonthHistory/widgets/oneMonthtemperatureView',
	
	
	'customUI/monitor/widgets/singleNodeDetails/singleNodeHistoryChart/oneMonthHistoryMax/oneMonthcpuMaxView',
	'customUI/monitor/widgets/singleNodeDetails/singleNodeHistoryChart/oneMonthHistoryMax/oneMonthdiskMaxView',
	'customUI/monitor/widgets/singleNodeDetails/singleNodeHistoryChart/oneMonthHistoryMax/oneMonthenergyMaxView',
	'customUI/monitor/widgets/singleNodeDetails/singleNodeHistoryChart/oneMonthHistoryMax/oneMonthloadMaxView',
	'customUI/monitor/widgets/singleNodeDetails/singleNodeHistoryChart/oneMonthHistoryMax/oneMonthmemoryMaxView',
	'customUI/monitor/widgets/singleNodeDetails/singleNodeHistoryChart/oneMonthHistoryMax/oneMonthnetworkMaxView',
	'customUI/monitor/widgets/singleNodeDetails/singleNodeHistoryChart/oneMonthHistoryMax/oneMonthtemperatureMaxView',
	
	'text!./templates/allNodesTmpl.mustache',
	'i18n!./nls/allNodes'
	],function(Marionette,urlConstants, constants, eventBus,
		     oneMonthcpuView,oneMonthdiskView,oneMonthenergyView,oneMonthloadView,oneMonthmemoryView,oneMonthnetworkView,
		     oneMonthtemperatureView,
		     oneMonthcpuMaxView,oneMonthdiskMaxView,oneMonthenergyMaxView,oneMonthloadMaxView,oneMonthmemoryMaxView,
		     oneMonthnetworkMaxView,oneMonthtemperatureMaxView,
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
           
	            var cpu=new oneMonthcpuView({el:$('#oneHourHistory_cpu')});
	                cpu.render();
	            
	            var disk=new oneMonthdiskView({el:$('#oneHourHistory_disk')});
	                disk.render();
	                  
	            var energy=new oneMonthenergyView({el:$('#oneHourHistory_enery')});
	                energy.render();
	            
	            var load=new oneMonthloadView({el:$('#oneHourHistory_load')});
	                load.render();
	            
	            var memory=new oneMonthmemoryView({el:$('#oneHourHistory_memory')});
	                memory.render();
	                     
	            var network=new oneMonthnetworkView({el:$('#oneHourHistory_network')});
	                network.render();
	            
	            var temperature=new oneMonthtemperatureView({el:$('#oneHourHistory_temperature')});
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
            
                        eventBus.off(constants.refreshOneMonthCpuMax);
	            	var loadMax=new oneMonthloadMaxView({el:$('#monitor_modal_down_right')});           
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
	            	 eventBus.off(constants.refreshOneMonthCpuMax);
	            	var networkMax=new oneMonthnetworkMaxView({el:$('#monitor_modal_down_right')});
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
	            	      
	                eventBus.off(constants.refreshOneMonthCpuMax);
	            	var cpuMax=new oneMonthcpuMaxView({el:$('#monitor_modal_down_right')});
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
	            	    eventBus.off(constants.refreshOneMonthCpuMax);
	            	var temperatureMax=new oneMonthtemperatureMaxView({el:$('#monitor_modal_down_right')});
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
	            	eventBus.off(constants.refreshOneMonthCpuMax);
	            	var memoryMax=new oneMonthmemoryMaxView({el:$('#monitor_modal_down_right')});
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
	            	         
	                eventBus.off(constants.refreshOneMonthCpuMax);
	            	var energyMax=new oneMonthenergyMaxView({el:$('#monitor_modal_down_right')});
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
	            	                     
                        eventBus.off(constants.refreshOneMonthCpuMax);
	            	var diskMax=new oneMonthdiskMaxView({el:$('#monitor_modal_down_right')});
                        diskMax.render();
   
	            });
                //点击disk视图结束执行

         
          },
          

		

		
		});
	});