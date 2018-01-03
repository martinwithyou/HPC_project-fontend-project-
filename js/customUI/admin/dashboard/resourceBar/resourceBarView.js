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
        'resourceDoughnutWidget',
        'resourceBarWidget',
        'text!./templates/resourceBarTmpl.mustache',
        'utils/constants/urlConstants',
        'utils/eventBus',
        'utils/constants/constants',
        'i18n!./nls/resourceBar',
        'css!./css/resourceBar'
        ],
        function(Marionette, resourceDoughnutWidget, resourceBarWidget, resourceBarTemplate, urlConstants,
        		eventBus, constants, nls, resourceBarCss) {
	'use strict';
	return Marionette.ItemView.extend({
		className: 'row admin-resourcebar dashboard-shadow',

		templateHelpers: function () {
			return {
				nls: nls
			};
		},

		template: resourceBarTemplate,

		onShow: function () {
			var self = this;
			$.ajax({
				type : "GET",
				url : urlConstants.clusterOverview,
				dataType : "json",
				success : function (data, textStatus) {
					self.renderResources(data, true);
					//打桩开始
					//alert(textStatus);
                    //alert(JSON.stringify(data));
                    //打桩结束
				},
				error : function (jqXHR, textStatus, errorThrown) {
					console.log(textStatus + errorThrown)
					console.log(jqXHR);
				}
			});
             //调用eventBus,启动自动刷新
			eventBus.on(constants.refreshAdmin, self.renderResources);
		},
		
		renderResources: function(renderData, isAnimation) {
			var data = renderData;
			    //alert(JSON.stringify(data));
			if (renderData.clusterOverview) {
				data = renderData.clusterOverview;
			}
			var clusterData = data;
			var ioData = {
					datasets: [{
						"name" : nls.networkIO,
						//"in" : (clusterData.throughput.in).toExponential(1), // B/s
						//"out" : (clusterData.throughput.out).toExponential(1) // B/s
						"in" : parseFloat(clusterData.throughput.in), // B/s
						"out" : parseFloat(clusterData.throughput.out) // B/s
					}
					]
			};
			
			var jobData = {
					datasets: [{
						"name" : nls.job,
						"in" : Number(clusterData.jobs.waiting), 
						"out" : Number(clusterData.jobs.running) 
					}
					]
			};

			var nodeData = {
					datasets: [{
						"name" : nls.node,
						"in" : Number(clusterData.nodes.on), 
						"out" : Number(clusterData.nodes.off)
					}
					]
			};

			
			var clusterCPUData = [
			                      {
			                    	  value: clusterData.processors.used,
			                    	  color:"#A3A3CA",
			                    	  highlight: "#CC99FF",
			                    	  label: nls.used
			                      },
			                      {
			                    	  value: clusterData.processors.total - clusterData.processors.used,
			                    	  color: "#EDEDED",
			                    	  highlight: "#5AD3D1",
			                    	  label: nls.remaining
			                      }
			                      ];
			var clusterMemoryData = [
			                         {
			                        	 value: (clusterData.memory.used / 1048576).toFixed(0),
			                        	 color: "#8FE9A5",
			                        	 highlight: "#00FF00",
			                        	 label: nls.used
			                         },
			                         {
			                        	 value: ((clusterData.memory.total - clusterData.memory.used) / 1048576).toFixed(0),
			                        	 color: "#EDEDED",
			                        	 highlight: "#5AD3D1",
			                        	 label: nls.remaining
			                         }
			                         ];
			var diskUsedColor = "#89B6DE";
			var diskUsedValue = (clusterData.diskspace.used).toFixed(1);
			var diskAvailableColor = "#EDEDED";
			var diskAvailableValue = (clusterData.diskspace.total - clusterData.diskspace.used).toFixed(1);
			if (clusterData.diskspace.used == 0) {
				diskUsedColor = "#EDEDED";
				diskUsedValue = 0;
				diskAvailableColor = "#EDEDED";
			}
			var clusterDiskData = [
			                       {
			                    	   value: diskUsedValue,
			                    	   color: diskUsedColor,
			                    	   highlight: "#00FFFF",
			                    	   label: nls.used
			                       },
			                       {
			                    	   value: diskAvailableValue,
			                    	   color: diskAvailableColor,
			                    	   highlight: "#5AD3D1",
			                    	   label: nls.remaining
			                       }
			                       ];
			$('#io-window-container1').plainBarWindow(jobData, {readLabel:nls.waiting, writeLabel: nls.running});
			$('#io-window-container2').plainBarWindow(nodeData, {readLabel:nls.on, writeLabel: nls.off});
			$('#io-window-container3').ioWindow(ioData, {readLabel:nls.read, writeLabel: nls.write});
			$('#admin-clusterCPU-holder').doughnut(clusterCPUData, "clusterCPU-area", {
				// These are the defaults.
				nls: nls,
				header: nls.clusterCPU,
				amount: nls.core,
				animation: isAnimation
			});
			$('#admin-clusterMemory-holder').doughnut(clusterMemoryData, "clusterMemory-area", {
				// These are the defaults.
				nls: nls,
				header: nls.clusterMemory,
				amount: nls.G,
				animation: isAnimation
			});
			$('#admin-storage-holder').doughnut(clusterDiskData, "storage-area", {
				// These are the defaults.
				nls: nls,
				header: nls.clusterStorage,
				amount: nls.G,
				animation: isAnimation
			});
			
		}		

	});
});