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
    'text!./templates/jobBarTmpl.mustache',
    'customUI/nodeList/nodeListView',
    'chartjs',
    'utils/constants/urlConstants',
    'utils/constants/constants',
    'utils/eventBus',
    'css!./styles/jobDoughnut',
    'i18n!./nls/jobBar'
  ],
  function(Marionette, jobBarTemplate, nodeListView, Chart, urlConstants, constants, eventBus, doughnutCss, nls) {
    'use strict';
    return Marionette.ItemView.extend({
      className: 'row dashboard-shadow',
      template: jobBarTemplate,
      templateHelpers: function () {
          return {
            nls: nls
          };
        },

      onShow: function () {
    	  var jobNodeListView = new nodeListView({el: $("#job_table")});
    	  jobNodeListView.render();
    	  var self = this;
    	  $.ajax({
    		  type : "GET",
    		  url : urlConstants.jobSummary,
    		  dataType : "json",
    		  success : function (data, textStatus) {
    			  self.renderJobPie(data, true);
    		  },
    		  error : function (jqXHR, textStatus, errorThrown) {
    			  console.log(textStatus + errorThrown)
    			  console.log(jqXHR);
    		  }
    	  });
    	  eventBus.on(constants.refreshUser, self.renderJobPie);
      },

      renderJobPie: function(renderData, isAnimation) {
          var data = renderData;
          if (renderData.jobSummary) {
            data = renderData.jobSummary;
          }
          var jobData = [
                         {
                        	 value: data.suspending_num,
                        	 color: "#69F6CA",
                        	 highlight: "#b2fae4",
                        	 label: nls.suspending
                         },
                         {
                        	 value: data.holding_num,
                        	 color: "#E1F5FE",
                        	 highlight: "#ebf8fe",
                        	 label: nls.holding
                         },
                         {
                        	 value: data.waiting_num,
                        	 color: "#B3E5FC",
                        	 highlight: "#ceeefd",
                        	 label: nls.waiting
                         },
                         {
                        	 value: data.queueing_num,
                        	 color: "#4FC3F7",
                        	 highlight: "#80d4f9",
                        	 label: nls.queueing
                         },
                         {
                        	 value: data.running_num,
                        	 color:"#69F0AE",
                        	 highlight: "#86f3be",
                        	 label: nls.running
                         }
                         ];

//		  var cloneData = jQuery.extend(true, {}, jobData);
//		  if ( Number(cloneData[0].value) == 0 && Number(cloneData[1].value) == 0){
//				cloneData[0].value = 1; //For nice looking, in order not to have an empty area.
//		  }

		  var theCanvas = document.getElementById("job-area");
		  theCanvas.chart && theCanvas.chart.destroy();
          var job_ctx = theCanvas.getContext("2d");
          job_ctx.clearRect(0,0,theCanvas.width,theCanvas.height);
          theCanvas.chart = new Chart(job_ctx).Doughnut(jobData,{
        	  responsive: false,
        	  animateScale : false,
        	  percentageInnerCutout : 65,
        	  animation: isAnimation,
        	  animationSteps: 60,        	  
        	  onAnimationComplete: function() {
        		  var canvasWidthvar = $('#job-area').width();
        		  var canvasHeight = $('#job-area').height();
        		  //this constant base on canvasHeight / 2.8em
        		  //var constant = 114;
        		  var constant = 4.3;
        		  var fontsize = (canvasHeight/constant).toFixed(0);
        		  job_ctx.font=fontsize +"px Microsoft YaHei";
        		  job_ctx.fillStyle="#333333"
        			  job_ctx.textBaseline="middle";
        		  job_ctx.textAlign="start";
        		  var total = 0;
        		  $.each(jobData,function() {
        			  total += parseInt(this.value,10);
        		  });
        		  //var tpercentage = ((clusterCPUData[0].value/total)*100).toFixed(2)+"%";
        		  var textWidth = job_ctx.measureText(total).width;
        		  var txtPosx = Math.round((canvasWidthvar - textWidth)/2);
        		  job_ctx.fillText(total, txtPosx, canvasHeight/2);

        		  fontsize = (fontsize/3.5).toFixed(0);
        		  job_ctx.font=fontsize +"px Microsoft YaHei";
        		  var textWidth2 = job_ctx.measureText(nls.unfinished).width;
        		  var txtPosx2 = Math.round((canvasWidthvar - textWidth2)/2);
        		  job_ctx.textBaseline="alphabetic";
        		  job_ctx.fillText(nls.unfinished, txtPosx2, (canvasHeight-80)/2);
        	  }
          });
          $('.job-footer').empty();
          $('.job-footer').append(drawFooter(jobData));
      }
    });
  });