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
	'jquery',
	'echartjs',
	'utils/constants/urlConstants',
	'utils/constants/constants',
	'utils/eventBus',
	'text!./templates/tendencyTmpl.mustache',
	'i18n!./nls/tendency',
	'css!./style/tendency.css'
	],function(Marionette ,bootstrap,$, echartjs,  urlConstants, constants,
		        eventBus, template, nls){

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
        		var id=this.options.id,
        			state=true,
	        		text=nls.text,
	        		type=nls.type,
	        		name=nls.name,
	        		element=nls.element,
	        		_height=$(window).height();
  				$(".group_tendency_canvas").css({"height":parseInt(_height)*0.32+"px"})     
		        this.init(text,type,name,element,id,state);		        
        	},
        	init:function(text,type,name,element,id,state){
        		var _this=this,
        			category=$("#tendency_select_time").val();
        		for(var i=0;i<8;i++){
        			var url=urlConstants.nodegroups+id+'/tendency/'+category+"/"+type[i]+"/";
	        		// var url="static/js/customUI/monitor/widgets/groups/groupView/widgets/tendencyView/data/"+id+"/"+category+"/"+type[i]+".json";
					_this.ajax(url,type[i],element[i],name[i],text[i],category,id,state);
        		};
        		$("#tendency_select_time").off();
				$("#tendency_select_time").on("change",function () {
					var category=$("#tendency_select_time").val();
	        		for(var i=0;i<8;i++){
	        			var url=urlConstants.nodegroups+id+'/tendency/'+category+"/"+type[i]+"/";
		        		// var url="static/js/customUI/monitor/widgets/groups/groupView/widgets/tendencyView/data/"+id+"/"+category+"/"+type[i]+".json";
						_this.ajax(url,type[i],element[i],name[i],text[i],category,id,state);
	        		};
				});	
        	},
        	timeTool:function(time){
				var year=time.getFullYear();
				var month=time.getMonth()+1;
	    		if (month < 10) {
	    			month = "0" + month;
	    		};
	    		var day=time.getDate()
	    		if (day < 10) {
	    			day = "0" + day;
	    		};
	    		var hour=time.getHours();
	    		if (hour < 10) {
	    			hour = "0" + hour;
	    		};
	    		var minutes=time.getMinutes();
	    		if (minutes < 10) {
	    			minutes = "0" + minutes;
	    		};
	    		var seconds=time.getSeconds();
	    		if (seconds < 10) {
	    			seconds = "0" + seconds;
	    		};
	    		var timeDisplay = hour + ":" + minutes + ":" + seconds;
	    		var dateDisplay = year +"-"+  month +"-"+ day;
	    		var realtime=timeDisplay + "\n" + dateDisplay;
	    		return realtime
        	},
        	createcharts:function(element,data,name,text,type,category,id,state){
		      	function createOption(text,xdata,series){
					var option = {
					        title: {      
					            text: text,
						        x:'center',
						        y:'top',
						        textStyle:{
						        	fontWeight:400,
						        	fontSize:16,
						        	fontFamily:"微软雅黑",
						        	color:"rgb(51, 51, 51)"
						        }
					        },
			                grid: {
			                    x: 50,
			                    y:30,
			                    x2:40,
			                    y2:40,
			                },
					        tooltip: {  
						        trigger: 'axis'
					        },
					        xAxis: {       
					            type: 'category',
					            boundaryGap: false,
					            data: xdata,
		                        splitLine:{  
		                            show:false  
		                        }
					        },
					        yAxis: {       
					            type: 'value',
		                        splitLine:{  
		                            show:false  
		                        }
					        },
					        series:series
				    };
				    return option
		      	};
        		function pushTitle(data_odd){
			      	var current=data_odd.current,
			      		total=data_odd.total;
			      	if(type == "network"){
			      		$("#network_current_in").text(current.split(",")[0]);
			      		$("#network_current_out").text(current.split(",")[1]);
			      	}else if(type == "memory"){
				      	$("#"+type+"_current").text(current);
				      	$("#"+type+"_total").text(parseInt(total/1024));
			      	}else {
				      	$("#"+type+"_current").text(current);
				      	$("#"+type+"_total").text(total);
			      	}
        		};
        		function refreshChartsFun(){
					// 判断 如果第一次没有拿到全量数据，再执行一遍ajax
					if(data.history==""||data.history==null||data==null) {
						var state=false;
        				var url=urlConstants.nodegroups+id+'/tendency/'+category+"/"+type+"/";
        				// var url="static/js/customUI/monitor/widgets/groups/groupView/widgets/tendencyView/data/"+id+"/"+category+"/"+type+".json";
						_this.ajax(url,type,element,name,text,category,id,state);
					} else {
	    				var startTime=data_odd_his[data_odd_length-1].time;
						$.ajax({
							type:"get",
							url:urlConstants.nodegroups+id+'/tendency/'+category+"/"+type+"/?starttime="+startTime,
							// url:"static/js/customUI/monitor/widgets/groups/groupView/widgets/tendencyView/data/"+id+"/"+category+"/"+type+"_current.json",
							dataType : "json",
							success:function(res){
								if(res.ret == "success"){
								var data_single=data_odd_his,
									data_new_his=res.history,
									data_new_len=data_new_his.length,
						      	    current_new=res.current,
						      		total_new=res.total;
						      	if(type == "memory"){
						      		if(current_new != "" && typeof current_new != "undefined"){
							      		$("#"+type+"_current").text(current_new);
						      		}
						      		if(total_new != "" && typeof total_new != "undefined"){
							      		$("#"+type+"_total").text(parseInt(total_new/1024));
						      		}
						      	} else {
						      		if(current_new != "" && typeof current_new != "undefined"){
							      		$("#"+type+"_current").text(current_new);
						      		}
						      		if(total_new != "" && typeof total_new != "undefined"){
							      		$("#"+type+"_total").text(total_new);
						      		}
						      	}
								data_new_his.sort(_this.compare("time"));
								data_single.splice(0,data_new_len);
								$.each(data_new_his,function(key,value){	
									data_single.push(value);
								});
								var data_single_len=data_single.length,
						      		xdata=[],
						      		ydata=[];
						      	for(var i=0;i < data_single_len;i++){
									var time=new Date(parseInt(data_single[i].time*1000));
						      		xdata.push(_this.timeTool(time));
						      		ydata.push(data_single[i].value);
						      	};
						      	var series= [      
							            {
							                name: name,
							                type: 'line',
						                    itemStyle : {  
						                        normal : {  
						                            color:'#89B6DE' , 
						                            lineStyle:{  
						                                color:'#89B6DE'  
						                            }  
						                        }  
						                    },
							                data:ydata
							            }
						        	],
						      		option=createOption(text,xdata,series);
						      		switch(type) {
						      			case "load":
						      				myChart1.setOption(option);
								    		break;
										case "cpu":
											myChart2.setOption(option);
								    		break;
										case "memory":
											myChart3.setOption(option);
								    		break;
										case "disk":
											myChart4.setOption(option);
								    		break;
										case "energy":
											myChart6.setOption(option);
								    		break;
										case "temperature":
											myChart7.setOption(option);
								    		break;
										case "job":
											myChart8.setOption(option);
								    		break;
						      		}
									
								} else {
							    	console.log("ret:"+data.ret+"\n"+"msg:"+data.msg)
								}
							},
							error : function (jqXHR, textStatus, errorThrown) {
								console.log(textStatus + errorThrown)
								console.log(jqXHR);
							}
						});   
					} 
        		};
        		pushTitle(data);
        		var _this=this,
		      		data_odd_his=data.history,
		      		data_odd_length=data_odd_his.length;
		      	data_odd_his.sort(_this.compare("time"));
        		if(type != "network"){
			      	var xdata=[],
			      		ydata=[];
			      	for(var i=0;i < data_odd_length;i++){
						var time=new Date(Number(data_odd_his[i].time*1000));
			      		xdata.push(_this.timeTool(time));
			      		ydata.push(data_odd_his[i].value);
			      	};
			      	var series= [      
					            {
					                name: name,
					                type: 'line',
					                stack: '总量',
		                            itemStyle : {  
		                                normal : {  
                            				color:'#89B6DE'  ,
		                                    lineStyle:{  
		                                        color:'#89B6DE'  
		                                    }  
		                                }  
		                            }, 
					                data:ydata
					            }
					        ];
			      	var option=createOption(text,xdata,series);
					switch(type) {
						case "load":
							if(state){
					        	myChart1 = echartjs.init(document.getElementById("group_tendency_load"));
					    		myChart1.setOption(option);
								window.addEventListener("resize", function () {
								    myChart1.resize(); 
								 }); 
					    		eventBus.off(constants.refreshTendencyLoad);
					    		eventBus.on(constants.refreshTendencyLoad,refreshTendencyLoad);
							} else {
								myChart1.setOption(option);
					    		eventBus.off(constants.refreshTendencyLoad);
					    		eventBus.on(constants.refreshTendencyLoad,refreshTendencyLoad);
							}
				    		break;
						case "cpu":
							if(state){
					        	myChart2 = echartjs.init(document.getElementById("group_tendency_cpu"));
					    		myChart2.setOption(option);
								window.addEventListener("resize", function () {
								    myChart2.resize(); 
								}); 
					    		eventBus.off(constants.refreshTendencyCpu);
					    		eventBus.on(constants.refreshTendencyCpu,refreshTendencyCpu);
							} else {
								myChart2.setOption(option);
					    		eventBus.off(constants.refreshTendencyCpu);
					    		eventBus.on(constants.refreshTendencyCpu,refreshTendencyCpu);
							}
				    		break;
						case "memory":
							if(state){
					        	myChart3 = echartjs.init(document.getElementById("group_tendency_memory"));
					    		myChart3.setOption(option);
								window.addEventListener("resize", function () {
								    myChart3.resize(); 
								}); 
					    		eventBus.off(constants.refreshTendencyMemory);
					    		eventBus.on(constants.refreshTendencyMemory, refreshTendencyMemory);
							} else {
								myChart3.setOption(option);
					    		eventBus.off(constants.refreshTendencyMemory);
					    		eventBus.on(constants.refreshTendencyMemory, refreshTendencyMemory);
							}
				    		break;
						case "disk":
							if(state){
					        	myChart4 = echartjs.init(document.getElementById("group_tendency_disk"));
					    		myChart4.setOption(option);
								window.addEventListener("resize", function () {
								    myChart4.resize(); 
								}); 
					    		eventBus.off(constants.refreshTendencyDisk);
					    		eventBus.on(constants.refreshTendencyDisk, refreshTendencyDisk);
							} else {
								myChart4.setOption(option);
					    		eventBus.off(constants.refreshTendencyDisk);
					    		eventBus.on(constants.refreshTendencyDisk, refreshTendencyDisk);
							}
				    		break;
						case "energy":
							if(state){
					        	myChart6 = echartjs.init(document.getElementById("group_tendency_energy"));
					    		myChart6.setOption(option);
								window.addEventListener("resize", function () {
								    myChart6.resize(); 
								}); 
					    		eventBus.off(constants.refreshTendencyEnergy);
					    		eventBus.on(constants.refreshTendencyEnergy, refreshTendencyEnergy);
							} else {
								myChart6.setOption(option);
					    		eventBus.off(constants.refreshTendencyEnergy);
					    		eventBus.on(constants.refreshTendencyEnergy, refreshTendencyEnergy);
							}
				    		break;
						case "temperature":
							if(state){
					        	myChart7 = echartjs.init(document.getElementById("group_tendency_temperature"));
					    		myChart7.setOption(option);
								window.addEventListener("resize", function () {
								    myChart7.resize(); 
								}); 
					    		eventBus.off(constants.refreshTendencyTemperature);
					    		eventBus.on(constants.refreshTendencyTemperature, refreshTendencyTemperature);
							} else {
								myChart7.setOption(option);
					    		eventBus.off(constants.refreshTendencyTemperature);
					    		eventBus.on(constants.refreshTendencyTemperature, refreshTendencyTemperature);
							}
				    		break;
						case "job":
							if(state){
					        	myChart8 = echartjs.init(document.getElementById("group_tendency_job"));
					    		myChart8.setOption(option);
								window.addEventListener("resize", function () {
								    myChart8.resize(); 
								}); 
					    		eventBus.off(constants.refreshTendencyJob);
					    		eventBus.on(constants.refreshTendencyJob,refreshTendencyJob);
							} else {
								myChart8.setOption(option);
					    		eventBus.off(constants.refreshTendencyJob);
					    		eventBus.on(constants.refreshTendencyJob,refreshTendencyJob);
							}
				    		break;
					}; 
		    		function refreshTendencyLoad(){
 						refreshChartsFun()
		    		};
		    		function refreshTendencyCpu(){
						refreshChartsFun();
		    		};
		    		function refreshTendencyMemory(){
						refreshChartsFun()
		    		};
		    		function refreshTendencyDisk(){
						refreshChartsFun()
		    		};
		    		function refreshTendencyEnergy(){
						refreshChartsFun() 
		    		};
		    		function refreshTendencyTemperature(){
						refreshChartsFun() 
		    		};
		    		function refreshTendencyJob(){
						refreshChartsFun()  
		    		};
    		    } else {
			      	var xdata=[],
			      		ydata_in=[],
			      		ydata_out=[];
			      	for(var i=0;i <data_odd_length;i++){
						var time=new Date(parseInt(data_odd_his[i].time*1000));
			      		xdata.push(_this.timeTool(time));
			      		ydata_in.push(data_odd_his[i].value.split(",")[0]);
			      		ydata_out.push(data_odd_his[i].value.split(",")[1]);
			      	};
			      	var series= [      
				            {
				                name: "进",
				                type: 'line',
	                            itemStyle : {  
	                                normal : {  
				                                        color:'#89B6DE' ,
	                                    lineStyle:{  
	                                        color:'#89B6DE'  
	                                    }  
	                                }  
	                            }, 
				                data:ydata_in
				            },    
				            {
				                name: "出",
				                type: 'line',
	                            itemStyle : {  
	                                normal : {  
	                                        color:'#000099'  ,
	                                    lineStyle:{  
	                                        color:'#000099'  
	                                    }  
	                                }  
	                            }, 
				                data:ydata_out
				            }
				        ],
			      		option=createOption(text,xdata,series);
			      	if(state){
			        	myChart = echartjs.init(document.getElementById("group_tendency_network"));
						window.addEventListener("resize", function () {
						    myChart.resize(); 
						}); 
			    		myChart.setOption(option);
			    		eventBus.off(constants.refreshTendencyNetwork);
			    		eventBus.on(constants.refreshTendencyNetwork, refreshNetwork);
			      	}else{
			    		myChart.setOption(option);
			    		eventBus.off(constants.refreshTendencyNetwork);
			    		eventBus.on(constants.refreshTendencyNetwork, refreshNetwork);
			      	}
					function refreshNetwork(){	
						// 判断 如果第一次没有拿到全量数据，再执行一遍ajax
						if(data.history.length==0||data.history==null||data=="undefined"||data.history=="undefined") {
							var url=urlConstants.nodegroups+id+'/tendency/'+category+"/"+type+"/";
	        				// var url="static/js/customUI/monitor/widgets/groups/groupView/widgets/tendencyView/data/"+id+"/"+category+"/"+type+".json";
							_this.ajax(url,type,element,name,text,category,id);
						} else {
							var startTime=data_odd_his[data_odd_length-1].time;
							$.ajax({
								type:"get",
								url:urlConstants.nodegroups+id+'/tendency/'+category+"/network/?starttime="+startTime,
								// url:"static/js/customUI/monitor/widgets/groups/groupView/widgets/tendencyView/data/"+id+"/"+category+"/network_current.json",
								dataType : "json",
								success:function(res){
									if(res.ret == "success"){
										var data_single=data_odd_his,
											data_new_his=res.history,
											data_new_len=data_new_his.length,
								      	    current_new=res.current;
							      		if(current_new != "" && typeof current_new != "undefined"){
							      			$("#network_current_in").text(current_new.split(",")[0]);
							      			$("#network_current_out").text(current_new.split(",")[1]);
							      		}
										data_new_his.sort(_this.compare("time"));
										data_single.splice(0,data_new_len);
										$.each(data_new_his,function(key,value){	
											data_single.push(value);
										});
										var data_single_len=data_single.length,
								      		xdata=[],
								      		ydata_in=[],
								      		ydata_out=[];
								      	for(var i=0;i <data_single.length;i++){
											var time=new Date(parseInt(data_single[i].time*1000));
								      		xdata.push(_this.timeTool(time));
								      		ydata_in.push(data_single[i].value.split(",")[0]);
								      		ydata_out.push(data_single[i].value.split(",")[1]);
								      	};
								      	var series= [      
									            {
									                name: "进",
									                type: 'line',
							                        itemStyle : {  
							                            normal : {  
							                                    color:'#89B6DE'  ,
							                                lineStyle:{  
							                                    color:'#89B6DE'  
							                                }  
							                            }  
							                        }, 
									                data:ydata_in
									            },    
									            {
									                name: "出",
									                type: 'line',
							                        itemStyle : {  
							                            normal : {  
							                                    color:'#000099'  ,
							                                lineStyle:{  
							                                    color:'#000099'  
							                                }  
							                            }  
							                        }, 
									                data:ydata_out
									            }
									        ],
							      			option=createOption(text,xdata,series);
								    	myChart.setOption(option);
										window.addEventListener("resize", function () {
										    myChart.resize(); 
										}); 
								    } else {
								    	console.log("ret:"+data.ret+"\n"+"msg:"+data.msg)
									}
								},
								error : function (jqXHR, textStatus, errorThrown) {
									console.log(textStatus + errorThrown)
									console.log(jqXHR);
								}
							}); 
						}
					}
		    	};
        	},
        	compare:function(propertyName) {
			    return function(object1, object2) {
			        var value1 = object1[propertyName];
			        var value2 = object2[propertyName];
			        if (parseInt(value2) < parseInt(value1)) {
			            return 1;
			        } else if (parseInt(value2) > parseInt(value1)) {
			            return - 1;
			        } else {
			            return 0;
			        }
			    }
			},
        	ajax:function(url,type,element,name,text,category,id,state){
        		var _this=this;
			    $.ajax({
			      type : "GET",
			      url : url,
			      dataType : "json",
			      success : function (data) {
			      	if(data.ret == "success"){
		      			_this.createcharts(element,data,name,text,type,category,id,state);
			      	} else {
				    	console.log("ret:"+data.ret+"\n"+"msg:"+data.msg)
					}
				  },
			      error : function (jqXHR, textStatus, errorThrown) {
			        console.log(textStatus + errorThrown)
			        console.log(jqXHR);
			      }
		        });
        	}
		});
	});