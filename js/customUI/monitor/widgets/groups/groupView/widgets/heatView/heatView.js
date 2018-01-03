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
	'echartjs',
	'customUI/monitor/widgets/listView/weight/modal/modalView',
	'utils/constants/urlConstants',
	'utils/constants/constants',
	'utils/eventBus',
	'customUI/monitor/widgets/singleNodeDetails/nodeInfoModle/nodeInfoModleView',
	'text!./templates/heatTmpl.mustache',
	'i18n!./nls/heat',
	'css!./style/heat.css'
	],function(Marionette ,bootstrap,echartjs,modalView,  urlConstants, constants,
		        eventBus,nodeInfoModleView, template, nls){
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
            	var _this=this,
	        		id=this.options.id,
	        		state=true,
	        		x_max=25,
	        		e_max=200,
	        		_height=$(window).height();
  				$("#heat_content").css({"height":parseInt(_height)*0.6+"px"})
        		this.init(x_max,e_max,state,id);

	        	eventBus.off(constants.refreshHeat);
				eventBus.on(constants.refreshHeat, refresh);
		        function refresh(){
					if ($(".modal.in").length > 0 ) {
						return;
					}
		        	var state=false;
		        	if($(".group-pagination-a").length > 0) {
		        		var re_index=$(".group-pagination-a.active").attr("data-index");
		        	}
	        		var type=$(".heat_btn_item.active").attr("data-type");
	        		var url=urlConstants.nodegroups+id+'/heat/latest/'+type+"/";
	        		// var url="static/js/customUI/monitor/widgets/groups/groupView/widgets/heatView/data/"+id+"/"+type+".json";
	                $.ajax({
	                  type : "GET",
	                  url : url,
	                  dataType : "json",
	                  success : function (data) {
		      			if(data.ret == "success"){
		                    var data=data.heat;
		                    if(data.heat==""||data.heat==null){
		                    	state=true;
		                    	_this.pagination(data,type,x_max,e_max,state,re_index);
		                    } else {
		                    	_this.pagination(data,type,x_max,e_max,state,re_index);
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
	        	};
        	},
        	compare:function compare(propertyName) {
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
			init:function(x_max,e_max,state,id){
				var _this=this,
	        		type=$(".heat_btn_item.active").attr("data-type"),
	        		url=urlConstants.nodegroups+id+'/heat/latest/'+type+"/";
	        		// url="static/js/customUI/monitor/widgets/groups/groupView/widgets/heatView/data/"+id+"/"+type+".json";
                _this.ajax(url,x_max,type,e_max,state);
                $(".heat_btn_item").off();
            	$(".heat_btn_item").on("click",function(){
            		$(".heat_btn_item").removeClass('active');
            		$(this).addClass('active');
            		var type=$(this).attr("data-type"),
	        		url=urlConstants.nodegroups+id+'/heat/latest/'+type+"/";
            		// url="static/js/customUI/monitor/widgets/groups/groupView/widgets/heatView/data/"+id+"/"+type+".json";
	                _this.ajax(url,x_max,type,e_max,state);
            	});
			},
        	ajax:function(url,x_max,type,e_max,state){
        		var _this=this;
                $.ajax({
                  type : "GET",
                  url : url,
                  dataType : "json",
                  success : function (data) {
	      			if(data.ret == "success"){
	                    // 分页
	                    var data=data.heat;
	                    if(data.length==0){
	                    	state=true;
	                    	_this.pagination(data,type,x_max,e_max,state);
	                    } else {
	                    	_this.pagination(data,type,x_max,e_max,state);
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
        	},
        	createCharts:function(datax,datay,eData,type,min,max,state){
	            var option = {
	                tooltip: {
	                    position: 'top',
	                    formatter: function (params) {
	                        return nls.valueIs+params.data.value[2]+"<br />"+nls.nodeIs+params.data.name
	                    }
	                },
	                animation: false,
	                grid: {
	                    x: 40,
	                    y:0,
	                    x2:0,
	                    y2:80
	                },
	                xAxis: {
	                    type: 'category',
	                    data: datax,
	                    splitLine: {show: true},
	                    axisLabel:{
	                        interval:0
	                    }
	                },
	                yAxis: {
	                    type: 'category',
	                    data: datay,
	                    splitLine: {show: true},
	                    inverse:true,
	                    axisLabel:{
	                        interval:0
	                    }
	                },
	                visualMap: {
	                    min: min,
	                    max: max,
	                    calculable: true,
	                    inverse:true,
	                    itemHeight:200,
	                    orient: 'horizontal',
	                    left: 'center',
	                    bottom: 0,
				        outOfRange: {
				            color: ['#cccccc'],
				            symbolSize: [min, max]
				        },
				        controller: {
				            outOfRange: {
				                symbolSize: [min, max]
				            }
				        }
	                },
	                series: [{
	                        name: 'Punch Card',
	                        type: 'heatmap',
	                        data: eData,
	                        label: {
	                            normal: {
	                                show: true
	                            }
	                        },
	                        itemStyle: {
	                        emphasis: {
	                            position: ['50%', '50%'],
	                            shadowBlur: 10,
	                            shadowColor: 'rgba(0, 0, 0, 0.5)'
	                        }
	                    }
	                }]
	            };
	            if(state){
		            heatChart = echartjs.init(document.getElementById('heat_content'));
		            heatChart.setOption(option);
					// window.addEventListener("resize", function () {
					//     heatChart.resize(); 
					//  }); 
	            	heatChart.title = type;
	            } else {
	            	heatChart.setOption(option);
	            };
	            heatChart.off();
		        heatChart.on('click', function (params) {
		            var node_id=params.data.id;
		            $("#body").attr("data-node_id",node_id);
					var g_modal_view=new nodeInfoModleView({el:$("#g_mymodal")});
					g_modal_view.render();
		            $("#fourth_mymodal").modal("toggle");
		        });

		        // 开关机摸态框
		        var g_modalView=new modalView({el:$('#g_shut_modal')});
		        g_modalView.render();
        	},
        	pagination:function(data,type,x_max,e_max,state,re_index){
        		var _this=this,
	        		dataLength=data.length,
	        		pageCount=dataLength%e_max==0?parseInt(dataLength/e_max):parseInt(dataLength/e_max)+1,
	        		pageNow;
        		if(!!re_index){
        			// 刷新前记录在哪页的页码
					pageNow=parseInt(re_index);
	        		if(dataLength<=e_max){
	    				$(".group-pagination-item").empty();
	    				$(".previous a,.next a").addClass('disabled');
	        		} else {
	    				$(".group-pagination-item").empty();
	        			for(var j=1;j<=pageCount;j++){
	        				$(".group-pagination-item").append("<a class='group-pagination-a' href='javascript:;' data-index="+j+">"+j+"</a>");
	        			};
	    				$(".group-pagination-a").eq(pageNow-1).addClass('active');
						ShowTags();
	        		};
					_this.paginationChart(pageNow,data,type,x_max,state,e_max);

        		} else {
					pageNow=1;
	        		if(dataLength<=e_max){
	    				$(".group-pagination-item").empty();
	    				$(".previous a,.next a").addClass('disabled');
	        		} else {
	    				$(".group-pagination-item").empty();
	        			for(var j=1;j<=pageCount;j++){
	        				$(".group-pagination-item").append("<a class='group-pagination-a' href='javascript:;' data-index="+j+">"+j+"</a>");
	        			};
	    				$(".group-pagination-a").eq(pageNow-1).addClass('active');
						ShowTags();
	        		};
					_this.paginationChart(pageNow,data,type,x_max,state,e_max);
        		}
        		

        		function ShowTags(){
        			$(".group-pagination-a").eq(0).css({"display":"block"});
        			$(".group-pagination-a").eq(pageCount-1).css({"display":"block"});
    				if(pageNow == 1){
    					$(".previous a").addClass('disabled');
    					$(".next a").removeClass('disabled');
    				} else if(pageNow == pageCount){
    					$(".previous a").removeClass('disabled');
    					$(".next a").addClass('disabled');
    				} else {
    					$(".previous a,.next a").removeClass('disabled');
    				};
    				if(pageCount<=7){
    					for(var k=1;k<pageCount;k++){
        					$(".group-pagination-a").eq(pageCount-1).css({"display":"block"});
    					}
						$(".point").remove();
    				} else {
    					if(pageNow-2 > 1 && pageNow+2 < pageCount){
    						for(var i=2;i<pageNow-2;i++){
        						$(".group-pagination-a").eq(i-1).css({"display":"none"});
    						}
    						for(var i=pageNow+2;i<pageCount;i++){
        						$(".group-pagination-a").eq(i-1).css({"display":"none"});
    						}
    						for(var i=pageNow-2;i<=pageNow+2;i++){
        						$(".group-pagination-a").eq(i-1).css({"display":"block"});
    						}
    						if(pageNow==4){
								$(".point").remove();
								$(".group-pagination-a").eq(pageNow+2).after("<span class='point'>...</span>");
    						} else if(pageNow==pageCount-3){
								$(".point").remove();
								$(".group-pagination-a").eq(pageNow-4).after("<span class='point'>...</span>");
    						} else {
								$(".point").remove();
								$(".group-pagination-a").eq(pageNow-4).after("<span class='point'>...</span>");
								$(".group-pagination-a").eq(pageNow+2).after("<span class='point'>...</span>");
    						}
    					} 
    					else if(pageNow == 1||pageNow == 2||pageNow == 3){
	    					for(var i=7;i<=pageCount-1;i++){
	        					$(".group-pagination-a").eq(i-1).css({"display":"none"});
	    					}
	    					for(var i=1;i<=6;i++){
	        					$(".group-pagination-a").eq(i-1).css({"display":"block"});
	    					}
							$(".point").remove();
							$(".group-pagination-a").eq(6).after("<span class='point'>...</span>");
    					} 
    					else if(pageNow >= pageCount-2) {
	    					for(var i=2;i<=pageCount-6;i++){
	        					$(".group-pagination-a").eq(i-1).css({"display":"none"});
	    					}	
	    					for(var i=pageCount;i>pageCount-6;i--){
	        					$(".group-pagination-a").eq(i-1).css({"display":"block"});
	    					}
							$(".point").remove();
							$(".group-pagination-a").eq(1).after("<span class='point'>...</span>");	
    					}
    					else {
    						console.log("other"+"pageNow"+pageNow+"pageCount"+pageCount);
    					}
    				}
				}
				// 点击页码
    			$(".group-pagination-a").off();
    			$(".group-pagination-a").on("click",function(){
    				state=false;
    				$(".group-pagination-a").removeClass('active');
    				$(this).addClass('active');
					pageNow=Number($(this).attr("data-index"));
					ShowTags();
        			_this.paginationChart(pageNow,data,type,x_max,state,e_max);
    			});
				// 点击上一页
				$(".previous a").off();
    			$(".previous a").on("click",function(){
    				state=false;
    				pageNow--;
					$(".group-pagination-a").removeClass('active');
    				$(".group-pagination-a").eq(pageNow-1).addClass('active');
        			ShowTags();
    				_this.paginationChart(pageNow,data,type,x_max,state,e_max);
    			});
				// 点击下一页
				$(".next a").off();
    			$(".next a").on("click",function(){
    				state=false;
    				pageNow++;
					$(".group-pagination-a").removeClass('active');
    				$(".group-pagination-a").eq(pageNow-1).addClass('active');
        			ShowTags();
    				_this.paginationChart(pageNow,data,type,x_max,state,e_max);
    			});
        	},
        	paginationChart:function(index,data,type,x_max,state,e_max){
        		var _this=this,
	        		dataLength=data.length,
					datay=[],
					datax=[],
	                eData=[],
	                vArray=[],		
					start=Number((index-1)*e_max),
					end=Number(index*e_max),
	                dataNew=data.slice(start,end),
	                dataNewLen=dataNew.length;
                for(var i=(index-1)*Number(e_max/x_max)+1;i<=index*Number(e_max/x_max);i++){
                    datay.push(i);
                };
                for(var i=1;i<=parseInt(x_max);i++){
                    datax.push(i);
                };
                $.each(dataNew, function(index, value){
                	if(type=="network"){
                		value.value=Number(value.value.split(",")[0])+Number(value.value.split(",")[1]);
                		value.value=parseInt(value.value);
                	} 
                	vArray.push((value.value));
                    var x=index%x_max,
	                    y=parseInt(index/x_max),
	                    v=[x,y,value.value],
	                    hostname=value.hostname,
	                    id=value.id,
	                    dataObjValue={value:v,name:hostname,id:id};
                    eData.push(dataObjValue);
                });
                if(dataNewLen/x_max < Number(e_max/x_max)){
                	var y=parseInt(dataNewLen/x_max);
                	for(var j=y;j<Number(e_max/x_max);j++){
	                	for(var i=0;i<x_max;i++){
	                		eData.push([i,j,"-"])
	                	}
                	}
                }
                var max =Math.max.apply(null,vArray),
                	min =Math.min.apply(null,vArray);
           	    _this.createCharts(datax,datay,eData,type,min,max,state);
        	}
		});
	});