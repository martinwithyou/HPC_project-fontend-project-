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
    'elfinder',
    'elfinder_i18n',
    //'morris',
    'utils/utils',
    'utils/constants/constants',
    'utils/constants/urlConstants',
    'utils/eventBus',
    'text!./templates/jobChart.mustache',
    'i18n!./nls/jobChart',
    'morris'
  ],
  function(Marionette, elfinder, elfinder_i18n, utils, constants, urlConstants, eventBus, jobChart, nls) {
    'use strict';
    return Marionette.ItemView.extend({

    	template: jobChart,

    	templateHelpers: function () {
            return {
            	nls: nls
            };
        },

        self: this,

        chart: "",

        queue_selected: "all",
        time_period: "3600",
        status_selected: "uncompleted",

        setRefreshData: function (data, current) {
        	if (data.time_period !== this.time_period | data.queue_selected !== this.queue_selected | data.status_selected !== this.status_selected) {
        		return;
        	} else {
        		$(".job_chart").remove();
            	var newChartDiv = "<div class='job_chart'></div>";
            	$("#basic").append(newChartDiv);
            	var areaPara = {};
            	if (data.status_selected == 'completed') {
            		areaPara.ykeys = ['completed'];
            		areaPara.labels = [nls.finished];
            		areaPara.lineColors = ['#b4e89f'];
            	} else {
            		areaPara.ykeys = ['running', 'waiting'];
            		areaPara.labels = [nls.running, nls.waiting];
            		areaPara.lineColors = ['#69f0ae', '#00b0ff'];
            	}
            	areaPara.element = $(".job_chart");
            	var dataComputed = [];
    			$.each(data.jobChart, function (i, dt) {
    				dt.time = dt.time - dt.timezone;
    				dataComputed.push(dt);
				  	});
    			areaPara.data = dataComputed;
    			this.initJobChart(areaPara);
        	}
        },

        setChartDate: function (current) {
        	$(".job_chart").html("");
        	var data_url =  urlConstants.jobHistory + "?duration=" + this.time_period + "&num_of_points=7&q_name=" + this.queue_selected + "&status=" + this.status_selected;
        	var areaPara = {};
        	if (this.status_selected == 'completed') {
        		areaPara.ykeys = ['completed'];
        		areaPara.labels = [nls.finished];
        		areaPara.lineColors = ['#b4e89f'];
        	} else {
        		areaPara.ykeys = ['running', 'waiting'];
        		areaPara.labels = [nls.running, nls.waiting];
        		areaPara.lineColors = ['#69f0ae', '#00b0ff'];
        	}
        	areaPara.element = $(".job_chart");
        	$.ajax({
        		type: "GET",
        		url: data_url,
        		//url: "xx",
        		dataType: "json",
        		success: function (data, textStatus) {
        			var dataComputed = [];
        			$.each(data, function (i, dt) {
        				dt.time = dt.time - dt.timezone;
        				dataComputed.push(dt);
  				  	});
        			areaPara.data = dataComputed;
        			current.initJobChart(areaPara);
        		},
        		error: function (XMLHttpRequest, textStatus, errorThrown) {
        			$(".job_chart").html(nls.err_msg);
        		}
        	});
        },

        initJobChart: function (areaPara) {
	    	this.chart = Morris.Area({
	    		  element: areaPara.element,
	    		  data: areaPara.data,
	    		  xkey: 'time',
	    		  parseTime: false,
	    		  xLabelFormat: function (x) {
	    			  var timeString = new Date(x.label * 1000);
		        		var year = timeString.getUTCFullYear();
		        		var month = timeString.getUTCMonth() + 1;
		        		if (month < 10) {
		        			month = "0" + month;
		        		}
		        		var date1 = timeString.getUTCDate();
		        		if (date1 < 10) {
		        			date1 = "0" + date1;
		        		}
		        		var hour = timeString.getUTCHours();
		        		if (hour < 10) {
		        			hour = "0" + hour;
		        		}
		        		var minute = timeString.getUTCMinutes();
		        		if (minute < 10) {
		        			minute = "0" + minute;
		        		}
		        		var timeDisplay = hour + ":" + minute;
		        		var dateDisplay = year + "-" + month + "-" + date1;
		        		return dateDisplay + "\n\r" + timeDisplay;
	    		  },
	    		  ykeys: areaPara.ykeys,
	    		  labels: areaPara.labels,
	    		  behaveLikeLine: true,
	    		  xLabelAngle: 35,
	    		  lineColors: areaPara.lineColors,
	    		  resize: true
	    		});
        },

        refreshChart: function (current) {
        	//$(".job_chart").remove();
        	//var newChartDiv = "<div class='job_chart'></div>";
        	//$("#basic").append(newChartDiv);
        	//this.chart.raphael.clear();
        	//this.chart.raphael.remove();
        	current.setChartDate(current);
        },

        getQueue: function () {
        	$.ajax({
  			  type: "GET",
  			  url: urlConstants.jobHistoryQueues,
  			  dataType: "json",
  			  success: function (data, textStatus) {
  				  var queueList = [];
  				  $.each(data, function (i, dt) {
  					  queueList.push(dt.name);
  				  });
  				  $.each(queueList, function(i, queue) {
  					  $("#select_queue").append("<option value='" + queue + "'>" + queue + "</option>");
  				  });
  			  },
  			  error: function (XMLHttpRequest, textStatus, errorThrown) {

  			  }
  		  });
        },

        onRender: function () {
        	var current = this;
        	eventBus.on(constants.refreshAdmin, current.setRefreshData, current);

        	current.getQueue();

        	//current.initJobChart();
        	current.setChartDate(current);

        	$("#select_queue").change(function () {
        		current.queue_selected = $("#select_queue").val();
        		utils.changeQueue(current.queue_selected);
        		current.refreshChart(current);
        	});

        	$("#select_time").change(function () {
        		current.time_period = $("#select_time").val();
        		utils.changeTimePeriod(current.time_period);
        		current.refreshChart(current);
        	});

        	$("#select_status").change(function () {
        		current.status_selected = $("#select_status").val();
        		utils.changeStatus(current.status_selected);
        		current.refreshChart(current);
        		if (current.status_selected == "uncompleted") {
        			$("#job_chart_running_icon").css("display", "block");
        			$("#job_chart_waiting_icon").css("display", "block");
        			$("#job_chart_finish_icon").css("display", "none");
        		} else {
        			$("#job_chart_running_icon").css("display", "none");
        			$("#job_chart_waiting_icon").css("display", "none");
        			$("#job_chart_finish_icon").css("display", "block");
        		}
        	});

        }

    });
  });