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
    "bootstrap",
    "utils/constants/constants",
    "utils/constants/urlConstants",
    "utils/eventBus"
  ],
  function (bootstrap, constants, urlConstants, eventBus) {
    'use strict';

    var utils = {};

    utils.encodeHTML = function() {

    };

    utils.showMessageOnSpot = function(tgt, msg, pos) {
        if (!pos) {
            pos = "top"
        }
        $(tgt).tooltip({
            title: msg,
            trigger: "manual",
            placement: pos,
            selector: tgt,
            delay: { show: 100, hide: 2000 }
        }).tooltip("show");

    };

    utils.hideMessageOnSpot = function (tgt) {
    	$(tgt).tooltip("destroy");
    };

    utils.startRefreshing = function () {
        utils.refreshFunc = setInterval(function(){
            utils.forceRefresh();
        }, 30000);
    };

    utils.removeRefreshing = function () {
        if (utils.refreshFunc) {
            clearInterval(utils.refreshFunc);
        }
    };

    utils.changeTimePeriod = function (newTimePeriod) {
    	this.areaChartParameters.time_period = newTimePeriod;
    },

    utils.changeQueue = function (newQueue) {
    	this.areaChartParameters.queue_selected = newQueue;
    },

    utils.changeStatus = function (newStatus) {
    	this.areaChartParameters.status_selected = newStatus;
    },

    utils.forceRefresh = function () {
        if ($('#header-wrapper').length === 0 &&
            $('#admin-cluster-wrapper').length === 0 &&
            $('.userViewArea').length === 0 &&
            $('.nodesViewArea').length === 0 &&
            $('.sessionInfoViewArea').length === 0 &&
        	$('.sessionsViewArea').length === 0&&
            $("#group_tendency_load").length === 0 &&
            $("#group_tendency_cpu").length === 0 &&
            $("#group_tendency_memory").length === 0 &&
            $("#group_tendency_disk").length === 0 &&
            $("#group_tendency_energy").length === 0 &&
            $("#group_tendency_temperature").length === 0 &&
            $("#group_tendency_job").length === 0 &&
            $("#group_tendency_network").length === 0 &&
            $("#heat_content").length === 0 &&
            $("#gListTable").length === 0 &&
            $("#plotly_Modal").css("display") == "none" &&
            $("#monitor_rack_all").length === 0  &&
            $("#physicals_body").length === 0 &&

            $("#listNodesTable_wrapper_only").length === 0 &&
            $("#fourth_mymodal").css("display")=="none"&&
            $("#fourth_mymodal").length == 0
        ){
            return;
        }
        if ($("#userBalance").length > 0) {
        	utils.refreshUserDashboard();
        }
        if ($('#admin-cluster-wrapper').length > 0) {
        	utils.refreshAdminDashboard();
        }
        if ($("#userGrid_wrapper").length > 0) {
        	utils.refreshUserProfile();
        }
        if ($("#allNodesTable_wrapper").length > 0) {
        	utils.refreshResourceView();
        }
        //新增加30s轮循向服务器请求数据开始**************************************************
        if($("#listNodesTable_wrapper_only").length > 0){
        	
        	utils.refreshNewResourceView();
        	
        	console.log("utils.refreshNewResourceView();");
        }
        if($("#monitor_body_up_flag").length>0){
        	
        	utils.refreshNodeData();
        	
        	console.log("utils.refreshNodeData();");
        }
        if($("#history-tab-panel_running_jobs_flag").length>0){
        	
        	utils.refreshNodeJobsData();
        	
        	console.log("util.refreshNodeJobsData();");
        }
 //*****************************************************************************
 //*****************************************************************************
        if($("#history_past_one_hour").length>0){
        	
        	utils.refreshCpuMax();
        
           console.log("utils.refreshCpuMax();");
        }
        if($("#history_past_one_hour").length>0){
        	
        	utils.refreshCpuMin();
        	
        	console.log("utils.refreshCpuMin();");
        	
        }
  //*****************************************************************************
 //*****************************************************************************
 
  //*****************************************************************************
 //*****************************************************************************
       if($("#history_past_one_day").length>0){
        	
        	utils.refreshOneDayCpuMax();
        	
        	console.log("utils.refreshOneDayCpuMax();");
        }
       
       if($("#history_past_one_day").length>0){
        	
        	utils.refreshOneDayCpuMin();
        	
        	console.log("utils.refreshOneDayCpuMin();");
        }
        
 //*****************************************************************************
 //*****************************************************************************
 
  //*****************************************************************************
 //*****************************************************************************
        if($("#history_past_one_week").length>0){
        	
        	utils.refreshOneWeekCpuMax();
        	
        	console.log("utils.refreshOneWeekCpuMax();");
        	
        }
        
        if($("#history_past_one_week").length>0){
        	
        	utils.refreshOneWeekCpuMin();
        	
        	console.log("utils.refreshOneWeekCpuMin();");
        }
 
//*****************************************************************************
//*****************************************************************************
 
 //*****************************************************************************
 //*****************************************************************************
        if($("#history_past_one_month").length>0){
        	
        	utils.refreshOneMonthCpuMax();
        	
        	console.log("utils.refreshOneMonthCpuMax();");
        }
        
        if($("#history_past_one_month").length>0){
        	
        	utils.refreshOneMonthCpuMin();
        	
            console.log("utils.refreshOneMonthCpuMin();");
        	
        }
 //*****************************************************************************
 //*****************************************************************************      
        if($("#history-tab-panel_down_flag").length>0){
        	
        	utils.refreshCpuMaxOneMoreTime();
        	
        	 console.log("utils.refreshCpuMaxOneMoreTime();");
        }
        
        if($("#group_tendency_network").length > 0){
            utils.refreshTendencyNetwork();
        }
        if($("#group_tendency_load").length > 0){
            utils.refreshTendencyLoad();
        }
        if($("#group_tendency_cpu").length > 0){
            utils.refreshTendencyCpu();
        }
        if($("#group_tendency_memory").length > 0){
            utils.refreshTendencyMemory();
        }
        if($("#group_tendency_disk").length > 0){
            utils.refreshTendencyDisk();
        }
        if($("#group_tendency_energy").length > 0){
            utils.refreshTendencyEnergy();
        }
        if($("#group_tendency_temperature").length > 0){
            utils.refreshTendencyTemperature();
        }
        if($("#group_tendency_job").length > 0){
            utils.refreshTendencyJob();
        }
        if($("#heat_content").length > 0){
            utils.refreshHeat();
        }
        if($("#gListTable").length > 0){
            utils.refreshGListTable();
        }
        if($("#plotly_Modal").css("display") == "block"){
            utils.refreshRackPlotly();
        }
        //新增加30s轮循向服务器请求数据结束**************************************************
        if ($("#groupTable_wrapper").length > 0) {
        	utils.refreshUserGroup();
        }
        if ($("#accountingGrid_wrapper").length > 0) {
        	utils.refreshAccountGroup();
        }
        if ($("#allSessionInfoTable_wrapper").length > 0) {
        	if ($("#sessionInfo_deleteFinishConfirm").is(":visible") == false)
        	{
        		utils.refreshsessionInfo();
        	}
        }
        if ($("#allSessionsTable_wrapper").length > 0) {
        	if ($("#session_deleteFinishConfirm").is(":visible") == false)
        	{
        		utils.refreshsession();
        	}
        }

        if($("#monitor_rack_all").length > 0){
            utils.refreshRackAll();
        }
        if($("#physicals_body").length > 0){
            utils.refreshRack();
        }
        //var jobSummaryPromise = $.get(urlConstants.jobSummary);
        
        
        /*$.when(jobSummaryPromise,
            queuePromise,
            clusterOverviewPromise,
            userPromise,
            runningJobsPromise,
            waitingJobsPromise,
            finishedJobsPromise,
            jobChartPromise,
            nodesOverviewPromise).done(
            function(jobSummary, queue, clusterOverview, user, runningJobs, waitingJobs, finishedJobs, jobChart, nodesOverview){
                var data = {"jobSummary": jobSummary[0],
                            "queue": queue[0],
                            "clusterOverview": clusterOverview[0],
                            "user": user[0],
                            "runningJobs": runningJobs[0],
                            "waitingJobs": waitingJobs[0],
                            "finishedJobs": finishedJobs[0],
                            "jobChart": jobChart[0],
                            "time_period": dataObj.time_period,
                            "queue_selected": dataObj.queue_selected,
                            "status_selected": dataObj.status_selected,
                            "nodesOverview": nodesOverview[0]};
                eventBus.trigger(constants.refresh, data);
        });*/
    };
    
    utils.refreshAdminDashboard = function () {
    	var clusterOverviewPromise = $.get(urlConstants.clusterOverview);
    	var dataObj = $.extend({}, this.areaChartParameters);
        var jobChartPromise = $.get(urlConstants.jobHistory + "?duration=" + dataObj.time_period + "&num_of_points=7&q_name=" + dataObj.queue_selected + "&status=" + dataObj.status_selected);
        var nodesOverviewPromise = $.get(urlConstants.nodesOverview);
        $.when(clusterOverviewPromise,
    		jobChartPromise,
    		nodesOverviewPromise).done(
            function(clusterOverview, jobChart, nodesOverview){
                var data = {"clusterOverview": clusterOverview[0],
                			"jobChart": jobChart[0],
                			"time_period": dataObj.time_period,
                            "queue_selected": dataObj.queue_selected,
                            "status_selected": dataObj.status_selected,
                            "nodesOverview": nodesOverview[0]};
                eventBus.trigger(constants.refreshAdmin, data);
        });
    };
    
    utils.refreshUserDashboard = function () {
    	var jobSummaryPromise = $.get(urlConstants.jobSummary);
    	var queuePromise = $.get(urlConstants.queues);
        var clusterOverviewPromise = $.get(urlConstants.clusterOverview);
        var userPromise = $.get(urlConstants.users + $.cookie("userid"));
        var runningJobsPromise = $.get(urlConstants.jobsRun);
        var waitingJobsPromise = $.get(urlConstants.jobsWait);
        var finishedJobsPromise = $.get(urlConstants.jobsFinish);
        $.when(jobSummaryPromise, queuePromise,
            clusterOverviewPromise,
            userPromise,
            runningJobsPromise,
            waitingJobsPromise,
            finishedJobsPromise).done(
            function(jobSummary, queue, clusterOverview, user, runningJobs, waitingJobs, finishedJobs){
                var data = {"jobSummary": jobSummary[0],
                			"queue": queue[0],
                            "clusterOverview": clusterOverview[0],
                            "user": user[0],
                            "runningJobs": runningJobs[0],
                            "waitingJobs": waitingJobs[0],
                            "finishedJobs": finishedJobs[0]};
                eventBus.trigger(constants.refreshUser, data);
        });
    };
    
    utils.refreshUserProfile = function () {
    	var data = {};
    	eventBus.trigger(constants.refreshUserProfile, data);
    };
    
    utils.refreshResourceView = function () {
    	var data = {};
    	eventBus.trigger(constants.refreshResource, data);
    	
    };
    utils.refreshTendencyLoad = function () {
        var data=eventBus.context;
        eventBus.trigger(constants.refreshTendencyLoad, data)
    };
    utils.refreshTendencyCpu = function () {
        var data=eventBus.context;
        eventBus.trigger(constants.refreshTendencyCpu, data)
    };
    utils.refreshTendencyMemory = function () {
        var data=eventBus.context;
        eventBus.trigger(constants.refreshTendencyMemory, data)
    };
    utils.refreshTendencyDisk = function () {
        var data=eventBus.context;
        eventBus.trigger(constants.refreshTendencyDisk, data)
    };
    utils.refreshTendencyEnergy = function () {
        var data=eventBus.context;
        eventBus.trigger(constants.refreshTendencyEnergy, data)
    };
    utils.refreshTendencyTemperature = function () {
        var data=eventBus.context;
        eventBus.trigger(constants.refreshTendencyTemperature, data)
    };
    utils.refreshTendencyJob = function () {
        var data=eventBus.context;
        eventBus.trigger(constants.refreshTendencyJob, data)
    };
    utils.refreshTendencyNetwork = function () {
        var data={};
        eventBus.trigger(constants.refreshTendencyNetwork, data)
    };
    utils.refreshHeat = function () {
        var data={};
        eventBus.trigger(constants.refreshHeat, data)
    };
    utils.refreshGListTable = function () {
        var data={};
        eventBus.trigger(constants.refreshGListTable, data)
    };
    utils.refreshRackPlotly = function () {
        var data={};
        eventBus.trigger(constants.refreshRackPlotly, data)
    };
    //连接开始***********************************************************************
    utils.refreshNewResourceView = function () {
    	var data = {};
    	eventBus.trigger(constants.refreshNewResource, data);
    	// console.log("连接器开始");
    };
    utils.refreshNodeData = function () {
    	var data = {};
    	eventBus.trigger(constants.refreshNodeData, data);
    	// console.log("NodeData连接器开始");
    };
    utils.refreshNodeJobsData = function () {
    	var data = {};
    	eventBus.trigger(constants.refreshNodeJobsData, data);
    	// console.log("NodeJobsData连接器开始");
    };
    
 //**********************************************************   
 //**********************************************************      
 //**********************************************************
    utils.refreshCpuMax = function () {
    	var data = {};
    	eventBus.trigger(constants.refreshCpuMax, data);
    };
    utils.refreshCpuMin = function () {
    	var data = {};
    	eventBus.trigger(constants.refreshCpuMin, data);
    };
    
 //**********************************************************   
 //**********************************************************   
    utils.refreshOneDayCpuMax = function () {
    	var data = {};
    	eventBus.trigger(constants.refreshOneDayCpuMax, data);
    };
    utils.refreshOneDayCpuMin = function () {
    	var data = {};
    	eventBus.trigger(constants.refreshOneDayCpuMin, data);
    };
 //**********************************************************   
 //**********************************************************      
    utils.refreshOneWeekCpuMax = function () {
    	var data = {};
    	eventBus.trigger(constants.refreshOneWeekCpuMax, data);
    };
    utils.refreshOneWeekCpuMin = function () {
    	var data = {};
    	eventBus.trigger(constants.refreshOneWeekCpuMin, data);
    };
  //**********************************************************   
 //**********************************************************   
     utils.refreshOneMonthCpuMax = function () {
    	var data = {};
    	eventBus.trigger(constants.refreshOneMonthCpuMax, data);
    };
    utils.refreshOneMonthCpuMin = function () {
    	var data = {};
    	eventBus.trigger(constants.refreshOneMonthCpuMin, data);
    };
    
 //**********************************************************   
 //**********************************************************   
    utils.refreshCpuMaxOneMoreTime= function(){
    	
    	var data = {};
    	eventBus.trigger(constants.refreshCpuMaxOneMoreTime, data);
    }
    //连接结束************************************************************************
    utils.refreshUserGroup = function () {
    	var data = {};
    	eventBus.trigger(constants.refreshUserGroup, data);
    };
    
    utils.refreshAccountGroup = function () {
    	var data = {};
    	eventBus.trigger(constants.refreshAccountGroup, data);
    };
    
    utils.refreshsessionInfo = function () {
    	var data = {};
    	eventBus.trigger(constants.refreshsessionInfo, data);
    };
    
    utils.refreshsession = function () {
    	var data = {};
    	eventBus.trigger(constants.refreshsession, data);
    };
    utils.refreshRackAll = function () {
        var data={};
        eventBus.trigger(constants.refreshRackAll, data)
    };
    utils.refreshRack = function () {
        var data={};
        eventBus.trigger(constants.refreshRack, data)
    };
    utils.storage = (function() {
      try {
         return 'localStorage' in window && window['localStorage'] !== null ? self.localStorage : self.cookie;
      } catch (e) {
         return self.cookie;
      }
    })();

    utils.decimalPlaces = function(num) {
      var match = (''+num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
      if (!match) { return 0; }
      return Math.max(
           0,
           // Number of digits right of decimal point.
           (match[1] ? match[1].length : 0)
           // Adjust for scientific notation.
           - (match[2] ? +match[2] : 0));
    };

    utils.areaChartParameters = {"time_period": "3600", "queue_selected": "all", "status_selected": "uncompleted"};

    return utils;
  });