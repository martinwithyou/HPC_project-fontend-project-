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
	
	'customUI/monitor/widgets/singleNodeDetails/singleNodeHistoryChart/oneHourHistory/widgets/cpuView',
	'customUI/monitor/widgets/singleNodeDetails/singleNodeHistoryChart/oneHourHistory/widgets/diskView',
	'customUI/monitor/widgets/singleNodeDetails/singleNodeHistoryChart/oneHourHistory/widgets/energyView',
	'customUI/monitor/widgets/singleNodeDetails/singleNodeHistoryChart/oneHourHistory/widgets/loadView',
	'customUI/monitor/widgets/singleNodeDetails/singleNodeHistoryChart/oneHourHistory/widgets/memoryView',
	'customUI/monitor/widgets/singleNodeDetails/singleNodeHistoryChart/oneHourHistory/widgets/networkView',
	'customUI/monitor/widgets/singleNodeDetails/singleNodeHistoryChart/oneHourHistory/widgets/temperatureView',
	
	'customUI/monitor/widgets/singleNodeDetails/singleNodeHistoryChart/oneHourHistoryMax/cpuMaxView',
	'customUI/monitor/widgets/singleNodeDetails/singleNodeHistoryChart/oneHourHistoryMax/diskMaxView',
	'customUI/monitor/widgets/singleNodeDetails/singleNodeHistoryChart/oneHourHistoryMax/energyMaxView',
	'customUI/monitor/widgets/singleNodeDetails/singleNodeHistoryChart/oneHourHistoryMax/loadMaxView',
	'customUI/monitor/widgets/singleNodeDetails/singleNodeHistoryChart/oneHourHistoryMax/memoryMaxView',
	'customUI/monitor/widgets/singleNodeDetails/singleNodeHistoryChart/oneHourHistoryMax/networkMaxView',
	'customUI/monitor/widgets/singleNodeDetails/singleNodeHistoryChart/oneHourHistoryMax/temperatureMaxView',
	
	
	'text!./templates/allNodesTmpl.mustache',
	'i18n!./nls/allNodes',
	'css!./style/allNodes.css'
	],function(Marionette,urlConstants, constants, eventBus,
		     cpuView,diskView,energyView,loadView,memoryView,networkView,temperatureView,
		     cpuMaxView,diskMaxView,energyMaxView,loadMaxView,memoryMaxView,networkMaxView,
		     temperatureMaxView, template, nls
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
           
	            var cpu=new cpuView({el:$('#oneHourHistory_cpu')});
	                cpu.render();
	            
	            var disk=new diskView({el:$('#oneHourHistory_disk')});
	                disk.render();
	                  
	            var energy=new energyView({el:$('#oneHourHistory_enery')});
	                energy.render();
	            
	            var load=new loadView({el:$('#oneHourHistory_load')});
	                load.render();
	            
	            var memory=new memoryView({el:$('#oneHourHistory_memory')});
	                memory.render();
	                     
	            var network=new networkView({el:$('#oneHourHistory_network')});
	                network.render();
	            
	            var temperature=new temperatureView({el:$('#oneHourHistory_temperature')});
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
                     eventBus.off(constants.refreshCpuMax);
	            	var loadMax=new loadMaxView({el:$('#monitor_modal_down_right')});           
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
	            	 eventBus.off(constants.refreshCpuMax);
	            	var networkMax=new networkMaxView({el:$('#monitor_modal_down_right')});
	                    networkMax.render();
	                
//	                 
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
	            	eventBus.off(constants.refreshCpuMax);
	            	var cpuMax=new cpuMaxView({el:$('#monitor_modal_down_right')});
	                    cpuMax.render();
	                
//	                
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
	            	eventBus.off(constants.refreshCpuMax);
	            	var temperatureMax=new temperatureMaxView({el:$('#monitor_modal_down_right')});
	                    temperatureMax.render();
	                
//	                
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
	            	 eventBus.off(constants.refreshCpuMax);
	            	var memoryMax=new memoryMaxView({el:$('#monitor_modal_down_right')});
                        memoryMax.render();

//               
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
	            	eventBus.off(constants.refreshCpuMax);
	            	var energyMax=new energyMaxView({el:$('#monitor_modal_down_right')});
                        energyMax.render();
	                
//	                
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
	            	 eventBus.off(constants.refreshCpuMax);
	            	var diskMax=new diskMaxView({el:$('#monitor_modal_down_right')});
                        diskMax.render();
                        
//                   
	            });
                //点击disk视图结束执行

                
       
           
          }
          

		

		
		});
	});