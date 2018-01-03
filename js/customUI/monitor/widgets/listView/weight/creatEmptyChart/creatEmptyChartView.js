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
    'echartjs'
	],function(Marionette, echartjs){
		return Marionette.ItemView.extend({
			template:" ",
			templateHelpers:" ",
			onDestroy: function(){
		    // custom cleanup or destroying code, here
		       $("body").css("background-color", "#ffffff");
		    },

			onRender:function(){
				
				
var myChart = echartjs.init(document.getElementById('history-tab-panel_down'));
// 指定图表的配置项和数据
    
option = {
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
        splitLine: {show: false},
        data: [] 
    },
    grid: {
    	top:'4%',
        left: '2%',
        right: '2%',
        bottom: '2%',
        containLabel: true
    },
    yAxis: {
        type: 'value',
        name: ''
    },
    series: [
        {
            name:"",
            type: 'line',
            data: [],
            itemStyle:{
                  normal:{color:'#89B6DE'}
              }
  
        }
       
    ]
};   


myChart.setOption(option);


			}

			
		});
	});