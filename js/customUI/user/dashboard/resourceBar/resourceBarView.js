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
        'Router',
        'RegionManager',
        'resourceDoughnutWidget',
        'resourceBarWidget',
        'text!./templates/resourceBarTmpl.mustache',
        'customUI/user/dashboard/job/jobView',
        //'customUI/templateSelect/templateSelectView',
        'utils/constants/urlConstants',
        'utils/eventBus',
        'utils/constants/constants',
        'i18n!./nls/resourceBar',
        'css!./styles/sliding',
        'css!./styles/resourceDoughnut',
        'css!./styles/submitJob'
        ],
        function(Marionette,Router, RegionManager,resourceDoughnutWidget, resourceBarWidget, resourceBarTemplate, jobView,urlConstants, 
        		eventBus, constants, nls, slidingCss, doughnutCss, submitJobCss) {
	'use strict';
	return Marionette.ItemView.extend({
		className: 'row dashboard-shadow',

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
				url : urlConstants.queues,
				dataType : "json",
				success : function (data, textStatus) {
					self.renderQueues(data);
				},
				error : function (jqXHR, textStatus, errorThrown) {
					console.log(textStatus + errorThrown)
					console.log(jqXHR);
				}
			});

			$.ajax({
				type : "GET",
				url : urlConstants.clusterOverview,
				dataType : "json",
				success : function (data, textStatus) {
					self.renderResources(data, true);
				},
				error : function (jqXHR, textStatus, errorThrown) {
					console.log(textStatus + errorThrown)
					console.log(jqXHR);
				}
			});

			eventBus.on(constants.refreshUser, self.renderQueues);
			eventBus.on(constants.refreshUser, self.renderResources);

			$('.sliding-window-prev').hide();
			$('.sliding-window-next').hide();

			$('.sliding-window-next').click(function(event) {
				event.preventDefault();
				$('.sliding-window-container').animate({scrollLeft:'+=90'}, 'slow');
				$('.sliding-window-container').promise().done(function(){
					var containerPosition = $('.sliding-window-container').position();
					var windowPosition = $('.sliding-window').position();
					var containerWidth = $('.sliding-window-container').width();
					var windowWidth = $('.sliding-window').width();
					if (containerPosition.left > windowPosition.left) {
						$('.sliding-window-prev').fadeIn('normal');
					}
					if ((containerPosition.left + containerWidth ) ==
						(windowPosition.left + windowWidth)){
						$('.sliding-window-next').fadeOut('normal');
					}
				})
			});
			$('.sliding-window-prev').click(function(event) {
				event.preventDefault();
				$('.sliding-window-container').animate({scrollLeft:'-=90'}, 'slow');
				$('.sliding-window-container').promise().done(function(){
					var containerPosition = $('.sliding-window-container').position();
					var windowPosition = $('.sliding-window').position();
					var containerWidth = $('.sliding-window-container').width();
					var windowWidth = $('.sliding-window').width();
					if (containerPosition.left == windowPosition.left) {
						// $('.sliding-window-prev').css("display", "none" );
						$('.sliding-window-prev').fadeOut('normal');
					}
					if ((containerPosition.left + containerWidth ) <
							(windowPosition.left + windowWidth)){
						// $('.sliding-window-next').css("display", "inline-block" );
						$('.sliding-window-next').fadeIn('normal');
					}
				})

			});

			$('#job_submit_start').click(function(){
				
				App.router.navigate('#templateSelect', {trigger: true});
				
			});
			
		},
		
		renderQueues: function(renderData) {
			var data = renderData;
			if (renderData.queue) {
				data = renderData.queue;
			}
			var queueData = {
					datasets: []
			};
			queueData.datasets = data;
			$('.sliding-window-container').slidingWindow(queueData,
					{runningLabel:nls.running, queueingLabel: nls.waiting});
			if($('.sliding-window-container').width() < $('.sliding-window').width()){
				$('.sliding-window-next').fadeIn('normal');
			}
		},
		
		renderResources: function(renderData, isAnimation) {
			var data = renderData;
			if (renderData.clusterOverview) {
				data = renderData.clusterOverview;
			}
			var clusterData = data;
			var ioData = {
					datasets: [{
						"name" : nls.networkIO,
						//"in" : (clusterData.throughput.in).toExponential(1), // MB/s
						//"out" : (clusterData.throughput.out).toExponential(1) // MB/s
						"in" : parseFloat(clusterData.throughput.in), // MB/s
						"out" : parseFloat(clusterData.throughput.out) // MB/s
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
			$('#io-window-container1').ioWindow(ioData, {readLabel:nls.read, writeLabel: nls.write});
			$('#clusterCPU-holder').doughnut(clusterCPUData, "clusterCPU-area", {
				// These are the defaults.
				nls: nls,
				header: nls.clusterCPU,
				amount: nls.core,
				animation: isAnimation
			});
			$('#clusterMemory-holder').doughnut(clusterMemoryData, "clusterMemory-area", {
				// These are the defaults.
				nls: nls,
				header: nls.clusterMemory,
				amount: nls.G,
				animation: isAnimation
			});
			$('#storage-holder').doughnut(clusterDiskData, "storage-area", {
				// These are the defaults.
				nls: nls,
				header: nls.clusterStorage,
				amount: nls.G,
				animation: isAnimation
			});
			
		}
		
	});
});