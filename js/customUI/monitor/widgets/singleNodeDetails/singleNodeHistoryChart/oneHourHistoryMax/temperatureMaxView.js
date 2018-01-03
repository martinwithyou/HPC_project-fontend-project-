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
	'echartjs',
	'utils/constants/urlConstants',
	'utils/constants/constants',
	'utils/eventBus',
	'customUI/monitor/widgets/listView/weight/creatEmptyChart/creatEmptyChartView',
	'i18n!./nls/allNodes'
	],function(Marionette,echarts,urlConstants, constants, eventBus, creatEmptyChartView, nls){
		return Marionette.ItemView.extend({
			template:" ",
			templateHelpers:function(){
				return {
					nls:nls
				};
			},

			onDestroy: function(){

		    $("body").css("background-color", "#F6F6F4");
		    
			},

            onRender:function(){
            	
//创建一个传入参数,创建历史趋势图的函数开始*****************************************************************************
 function createChart(timeObj,valueObj,startTime){
 	
    var xValue=timeObj;
    
    var yValue=valueObj;  
 
// 基于准备好的dom，初始化echarts实例
var myChart = echarts.init(document.getElementById('history-tab-panel_down'));
// 指定图表的配置项和数据
    
option = {

    tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c}'
    },
    legend: {
        left: 'left',
        data: ['']
    },
    tooltip: {    
		trigger: 'axis'
	},
    xAxis: {
        type: 'category',
        name: '',
        boundaryGap: false,
        splitLine: {show: false},
        data: xValue 
    },
    grid: {
    	top:'4%',
        left: '5%',
        right: '5%',
        bottom: '2%',
        containLabel: true
    },
    yAxis: {
        type: 'value',
        name: ''
    },
    series: [
        {
            name: nls.temperature,
            type: 'line',
            data: yValue,
            itemStyle:{
                  normal:{color:'#89B6DE'}
              }
        }
       
    ]
};   

var lastIndex_1=startTime.length-1;
var refreshTime=startTime[lastIndex_1];
	function refreshChart(){
  
             $.ajax({
				type:"get",
				url:urlConstants.oneHour_temperature+"/"+Number($("#body").attr("data-node_id"))+"/tendency/hour/temperature/"+"?starttime="+refreshTime,
				//url:currentUrl,
				success:function(res){
					
					
					var data=res;
					
					var value=data.history;
					if(value.length==0){
						
						value=[{"time":0,"value":"0"}];
						
				   }else{ 
				   	
				   	var lastIndex=value.length-1;
					
					var lastValue=value[lastIndex].value;
					    
					    refreshTime=value[lastIndex].time;
					for(x in value){
					 	
					 	var timeThis=value[x].time;
				    	var timeThis=new Date(timeThis*1000);
				    	
    	                var qtime_hour = timeThis.getHours()+":";
  		                var qtime_minute = timeThis.getMinutes()+":";
  		                var qtime_seconds=timeThis.getSeconds()+"";
  		       
  		                var qtime_year = timeThis.getFullYear()+"-";
  		                var qtime_month = timeThis.getMonth()+1+"-";
  		                var qtime_day = timeThis.getDate();
  		                
				    	var valueThis=value[x].value;
				    	
				    	xValue.push(qtime_hour+qtime_minute+qtime_seconds+"\n"+qtime_year+qtime_month+qtime_day);
				    	xValue.shift();
				    	
				    	
				    	
				    	yValue.push(valueThis);
				    	yValue.shift();
				    	
					 	
					 }
					
				   }

					

                   
				  },
				  error:function(){
					  console.log("error");
				  }
			
			  });   

  myChart.setOption({
  	   xAxis: {
        type: 'category',
        name: '',
        splitLine: {show: false},
        data: xValue 
       },
      series: [
        {
            name: nls.temperature,
            type: 'line',
            data: yValue,
            itemStyle:{
                  normal:{color:'#89B6DE'}
              }
        }
     ]
  });
}
//eventBus.off(constants.refreshCpuMax);
eventBus.on(constants.refreshCpuMax,refreshChart); 

// 使用刚指定的配置项和数据显示图表。
myChart.setOption(option);

    }
 
 
 //创建一个传入参数,创建历史趋势图的函数结束*****************************************************************************
function judgeWhichOne(timeObj,valueObj,startTime,flag){
 	
 	if(flag==true){
 		
 		eventBus.off(constants.refreshCpuMaxOneMoreTime);
 		
 		createChart(timeObj,valueObj,startTime);
 		
 	}else{
 		
 		eventBus.off(constants.refreshCpuMaxOneMoreTime);
 		eventBus.on(constants.refreshCpuMaxOneMoreTime,firstTimeGetDataSuccessfully); 
 	}
 	
 	
 	
 } 	   
 
 function firstTimeGetDataSuccessfully(){
	
	        //新建x轴的坐标的数组
			var timeObj=new Array();
			
			//新建y轴的坐标的数组		
			var valueObj=new Array();
			
			var startTime=new Array();
			//获取过去一小时数据开始	
			
			var firstResoult= new Array();
			
            $.ajax({
				type:"get",
				url:urlConstants.oneHour_temperature+"/"+Number($("#body").attr("data-node_id"))+"/tendency/hour/temperature/",
				async: false,
				success:function(res){
					
					firstResoult=res.history;
					    
					var data= res.history;
					
					
					if(firstResoult.length>0){
						
				    	flag=true;
				    	
                      for(x in data){
				    	
				    	startTime.push(data[x].time);
				    	
				    	var timeThis=data[x].time;
				    	var timeThis=new Date(timeThis*1000);
				    	
    	                var qtime_hour = timeThis.getHours()+":";
  		                var qtime_minute = timeThis.getMinutes()+":";
  		                var qtime_seconds=timeThis.getSeconds()+"";
  		                
  		                var qtime_year = timeThis.getFullYear()+"-";
  		                var qtime_month = timeThis.getMonth()+1+"-";
  		                var qtime_day = timeThis.getDate();
  		                
  		                
				    	var valueThis=data[x].value;
				    	
				    	timeObj.push(qtime_hour+qtime_minute+qtime_seconds+"\n"+qtime_year+qtime_month+qtime_day);
				    	
				    	valueObj.push(valueThis);
				    	
				    }
				        
				       var lastIndex=valueObj.length-1;
				
			           var lastValue=valueObj[lastIndex];
			    
                       judgeWhichOne(timeObj,valueObj,startTime,flag);
				 
				    
					}else{
				       
				       flag=false;
				       
                       judgeWhichOne(timeObj,valueObj,startTime,flag);
                       
                    
				    }
				    

		       },
		       error:function(){
					console.log("error");
				}
	        });
          //获取过去一小时数据结束     
            
}
	      
          
//创建一个传入参数,创建历史趋势图的函数结束*****************************************************************************
		
        var creatEmptyChart=new creatEmptyChartView({el:$('#history-tab-panel_down')});
                        
        creatEmptyChart.render();
		
		
		var flag=true;
			
        firstTimeGetDataSuccessfully();	    

		
            }
	


		

		
		});
	});