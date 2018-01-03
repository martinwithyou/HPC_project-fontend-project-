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
        'chartStackedBar',
        'text!./templates/jobNodeBarTmpl.mustache',
        'utils/constants/urlConstants',
        //'customUI/templateSelect/templateSelectView',
        'utils/eventBus',
        'utils/constants/constants',
        'customUI/admin/dashboard/jobChart/jobChart',
        'i18n!./nls/jobNodeBar',
        'css!./css/jobNodeBar'
        ],
        function(Marionette, ChartStackedBar, jobNodeBarTemplate, urlConstants,
        		eventBus, constants, jobChart, nls, jobNodeBarCss) {
	'use strict';
	return Marionette.ItemView.extend({
		className: 'row admin-jobNodeBar',

		templateHelpers: function () {
			return {
				nls: nls
			};
		},

		template: jobNodeBarTemplate,

		onShow: function () {
			var self = this;
			var jobChartView = new jobChart({el: $("#job_chart_admin")});
			jobChartView.render();

			$('#job_submit_start').click(function(){
				
				App.router.navigate('#templateSelect', {trigger: true});
			});
             
			var self = this;
			$.ajax({
				type : "GET",
				url : urlConstants.nodesOverview,
				dataType : "json",
				success : function (data, textStatus) {
					self.renderNodeChart(data, true);
				},
				error : function (jqXHR, textStatus, errorThrown) {
					console.log(textStatus + errorThrown)
					console.log(jqXHR);
				}
			});
			eventBus.on(constants.refreshAdmin, self.renderNodeChart);			
		},
		
		renderNodeChart: function(renderData, isAnimation) {
	          var data = renderData;
	          if (renderData.nodesOverview) {
	            data = renderData.nodesOverview;
	          }
	          
	          //merge CPU node and GPU node
	          
	          var gpuIndex = 4;
	          var cpuIndex = 2;
	          for (var i = 0; i < data.types.length; i++){
	        	  if (data.types[i] == "gpu") {
	        		  gpuIndex = i;
	        	  } else if (data.types[i] == "compute"){
	        		  cpuIndex = i;
	        	  }
	          }
	          
        	  data.datasets.off[cpuIndex] = data.datasets.off[cpuIndex] + data.datasets.off[gpuIndex];
        	  data.datasets.busy[cpuIndex] = data.datasets.busy[cpuIndex] + data.datasets.busy[gpuIndex];
        	  data.datasets.occupied[cpuIndex] = data.datasets.occupied[cpuIndex] + data.datasets.occupied[gpuIndex];
        	  data.datasets.idle[cpuIndex] = data.datasets.idle[cpuIndex] + data.datasets.idle[gpuIndex];

	          var barChartData = {
	        		  labels : [nls.head, nls.login, nls.compute, nls.io],
	        		  datasets : [
	        		              {
	        		            	  fillColor : "rgba(222, 222, 222, 1)",
	        		            	  strokeColor : "rgba(222, 222, 222,0.8)",
	        		            	  highlightFill: "rgba(222, 222, 222,0.75)",
	        		            	  highlightStroke: "rgba(222, 222, 222, 0.5)",
	        		            	  data : data.datasets.off
	        		              },
	        		              {
	        		            	  fillColor : "rgba(255, 204, 0, 1)",
	        		            	  strokeColor : "rgba(255, 204, 0,0.8)",
	        		            	  highlightFill : "rgba(255, 204, 0,0.75)",
	        		            	  highlightStroke : "rgba(255, 204, 0, 0.5)",
	        		            	  data : data.datasets.busy
	        		              },
	        		              {
	        		            	  fillColor : "rgba(253, 241, 0, 1)",
	        		            	  strokeColor : "rgba(253, 241, 0,0.8)",
	        		            	  highlightFill : "rgba(253, 241, 0,0.75)",
	        		            	  highlightStroke : "rgba(253, 241, 0 , 0.5)",
	        		            	  data : data.datasets.occupied
	        		              },
	        		              {
	        		            	  fillColor : "rgba(143, 233, 165, 1)",
	        		            	  strokeColor : "rgba(143, 233, 165, 0.8)",
	        		            	  highlightFill : "rgba(143, 233, 165, 0.75)",
	        		            	  highlightStroke : "rgba(143, 233, 165 ,0.5)",
	        		            	  data : data.datasets.idle
	        		              }
	        		              ]
	          };	          
	          
	          var ctx = document.getElementById("nodesOverview").getContext("2d");
	          window.myBar = new Chart(ctx).StackedBar(barChartData, {
	        	  animation: isAnimation,
	        	  responsive : true,
	        	  scaleShowGridLines : false,
	        	  scaleShowVerticalLines: false,
	        	  barValueSpacing : 35
	          });	          
	          
	          
		}

	});
});