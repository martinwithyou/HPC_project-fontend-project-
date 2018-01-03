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
    'RegionManager',
    'elfinder',
    'elfinder_i18n',
    'widgets/elfinder/chooseFolder/chooseFolder',
    'widgets/elfinder/chooseFile/chooseFile',
    'utils/utils',
    'utils/constants/urlConstants',
    'customUI/templateSelect/widgets/MPIView',
    'customUI/templateSelect/widgets/GeneralView',
    'customUI/templateSelect/TemplateSelectView',
    'text!./templates/jobTmpl.mustache',
    'i18n!customUI/user/dashboard/job/nls/jobView',
    'css!/static/js/libs/jquery-ui/themes/flick/jquery-ui.min.css',
    'css!/static/js/libs/elfinder/css/elfinder.min.css',
    'css!./css/jobView'
  ],
  function(Marionette, RegionManager, elfinder, elfinder_i18n,
  	chooseFolder, chooseFile, utils, urlConstants,MPIView,GeneralView,
  	TemplateSelectView,jobView,nls, jQueryCSS, elfinderCSS
) {
    'use strict';
    return Marionette.ItemView.extend({
      template: jobView,

      self: this,

      ui: {
        jobInputText: "#job_file_input_text",
      },

      selected_queue: "",

      templateHelpers: function () {
        return {
          nls: nls
        };
      },

      clearCheck: function () {
    	  $("#nodesRadios1").removeAttr("checked");
    	  $("#nodesRadios2").removeAttr("checked");
    	  $("#notice_finish").attr("checked",false);
    	  $("#notice_suspend").attr("checked",false);
      },

      clearQueueOption: function () {
    	  var queue_name = $("#queue_name");
    	  for (var i = queue_name[0].length; i > 1; i--) {
    		  queue_name[0].remove(i - 1);
    	  }
      },

      clearConfirmQueueOption: function () {
    	  var confirm_queue_name = $("#confirm_queue_name");
    	  for (var i = confirm_queue_name[0].length; i > 1; i--) {
    		  confirm_queue_name[0].remove(i - 1);
    	  }
      },

      clearCreatePage: function () {
    	  $("input").html("");
    	  $("textarea").html("");
    	  this.clearQueueOption();
    	  this.clearCheck();
      },

      setConfirmNotify: function (data) {
    	  var triggerList = data.trigger;
    	  var notifyArr = triggerList.split(",");
    	  if ($.inArray("finish", notifyArr)!==-1 ) {
    		  $("#confirm_notice_finish").attr("checked","checked");
    	  } else {
    		  $("#confirm_notice_finish").attr("checked",false);
    	  }

    	  if ($.inArray("suspend", notifyArr)!==-1) {
    		  $("#confirm_notice_suspend").attr("checked","checked");
    	  } else {
    		  $("#confirm_notice_suspend").attr("checked",false);
    	  }
      },

      setConfirmCheck: function (data) {
    	  if (data.share == true) {
    		  $("#confirm_nodesRadios2").removeAttr("checked");
    		  $("#confirm_nodesRadios1").attr("checked","checked");
    	  } else {
    		  $("#confirm_nodesRadios1").removeAttr("checked");
    		  $("#confirm_nodesRadios2").attr("checked","checked");
    	  }
      },

      clearConfirmCommands: function () {
    	  $("#confirm_exec_command").html("");
      },

      setConfirmCommands: function (data) {
    	  this.clearConfirmCommands();
    	  var commands = data.commands;
    	  $.each(commands, function (i, command) {
    		  $("#confirm_exec_command").append(command + "\r");
    	  });
      },

      setConfirmQueueOptions: function (data) {
    	  this.clearConfirmQueueOption();
    	  var confirm_queues = data.queues;
    	  var confirm_selected_queue = data.queue_selected;
    	  $.each(confirm_queues, function (i, queue) {
    		  $("#confirm_queue_name").append("<option value='" + queue + "'>" + queue + "</option>");
    	  });
    	  for (var i = 0; i < $("#confirm_queue_name")[0].length; i ++) {
    		  if ($("#confirm_queue_name")[0][i].innerHTML == confirm_selected_queue) {
    			  $("#confirm_queue_name")[0][i].selected = true;
    		  } else {
    			  $("#confirm_queue_name")[0][i].selected = false;
    		  }
    	  }
      },

      setConfirmValue: function (data) {
    	  $("#confirm_job_create_name").val(data.name);
    	  $("#job_submit_confirm_file_name").val(data.filename);
    	  $("#confirm_output_dir_text").val(data.output_path);
    	  $("#confirm_CPU_core_num_text").val(data.cpus);
    	  $("#confirm_nodes_num").val(data.nodes);
    	  $("#confirm_mem_size_text").val(data.mem_size);
    	  $("#confirm_run_time_text").val(data.walltime);
    	  this.setConfirmQueueOptions(data);
    	  this.setConfirmCheck(data);
    	  this.setConfirmNotify(data);
    	  $("#confirm_email").val(data.mail);
    	  $("#confirm_cell").val(data.phone);
    	  this.setConfirmCommands(data);
      },

      initQueryCreateStatus: function (data) {
    	  var queryData = data;
    	  var current = this;
    	  setTimeout(this.checkCreateProgress, 2000, queryData, current);
      },

      checkCreateProgress: function (jobData, current) {
    	  var check_create_url = urlConstants.jobs + jobData.id;
      	  $.ajax({
      		  type: "GET",
      		  url: check_create_url,
      		  dataType: "json",
      		  success: function (data, textStatus) {
      			current.checkCreateResult(data, jobData);
      		},
      		error: function (XMLHttpRequest, textStatus, errorThrown) {
      			$("#progressDialog").modal('hide');
      			$("#createResultArea").addClass("alert alert-dismissable").css("background-color", "white");
			    $("#createResult").html(nls.jobCreateFailed).css("position" ,"relative");
			    $("#resultIcon").attr("src", "/static/js/customUI/user/dashboard/job/resources/ic_clear_red_36x36.png");
			    $("#jobCreateID").css("display","none");
			    $("#jobCreateResult").modal('show');
			    utils.forceRefresh();
			    /*setTimeout(function () {
			    	$("#jobCreateResult").modal('hide');
			    }, 3000);*/
      		}
      	  });
      },

      checkCreateResult: function (data, resultData) {
    	  var current = this;
    	  if (data.operatestatus == "created") {
    		  $("#progressDialog").modal('hide');
			  $("#createResultArea").addClass("alert alert-dismissable").css("background-color", "white");
		      $("#createResult").html(nls.jobCreateSuccessfully).css("position:fixed");
		      $("#resultIcon").attr("src", "/static/js/customUI/user/dashboard/job/resources/ic_check_green_36x36.png");
		      $("#jobCreateID").html(nls.jobID + ": " + data.jobid).css("display","block");
		      $("#jobCreateResult").modal('show');
		      utils.forceRefresh();
		      /*setTimeout(function () {
			    	$("#jobCreateResult").modal('hide');
			    }, 3000);*/
    	  } else if (data.operatestatus == "createfailed") {
    		  $("#progressDialog").modal('hide');
    		  $("#createResultArea").addClass("alert alert-dismissable").css("background-color", "white");
			  $("#createResult").html(nls.jobCreateFailed).css("position" ,"relative");
			  $("#resultIcon").attr("src", "/static/js/customUI/user/dashboard/job/resources/ic_clear_red_36x36.png");
			  $("#jobCreateID").css("display","none");
			  $("#jobCreateResult").modal('show');
			  utils.forceRefresh();
			  /*setTimeout(function () {
			    	$("#jobCreateResult").modal('hide');
			    }, 3000);*/
    	  } else {
    		  current.initQueryCreateStatus(resultData);
    	  }
      },

      addInvalidClass: function (tgt) {
    	  $(tgt).removeClass("form-control").addClass("form-control-invalid");
      },

      removeInvalidClass: function (tgt) {
    	  $(tgt).removeClass("form-control-invalid").addClass("form-control");
      },

      validateJobName: function (current) {
    	  var isValid;
    	  var reg = /^[a-zA-z]\w{3,15}$/;
    	  var errMsgEmpty = nls.jobNameEmptyMsg;
		  var errMsgReg = nls.jobNameRegMsg;
		  var value = $.trim($("#job_create_name").val());
    	  if (value.length == 0) {
    		  utils.showMessageOnSpot("#job_create_name", errMsgEmpty, "right");
    		  current.addInvalidClass("#job_create_name");
    		  isValid = false;
    	  } else if (!reg.test(value)) {
    		  utils.showMessageOnSpot("#job_create_name", errMsgReg, "right");
    		  isValid = false;
    		  current.addInvalidClass("#job_create_name");
    	  } else {
    		  utils.hideMessageOnSpot("#job_create_name");
    		  isValid = true;
    		  current.removeInvalidClass("#job_create_name");
    	  }
    	  return isValid;
      },

      validateJobNameE: function (event) {
    	  var current = event.data.foo;
    	  var isValid;
    	  var reg = /^[a-zA-z]\w{3,15}$/;
    	  var errMsgEmpty = nls.jobNameEmptyMsg;
		  var errMsgReg = nls.jobNameRegMsg;
		  var value = $.trim($("#job_create_name").val());
    	  if (value.length == 0) {
    		  utils.showMessageOnSpot("#job_create_name", errMsgEmpty, "right");
    		  current.addInvalidClass("#job_create_name");
    		  isValid = false;
    	  } else if (!reg.test(value)) {
    		  utils.showMessageOnSpot("#job_create_name", errMsgReg, "right");
    		  isValid = false;
    		  current.addInvalidClass("#job_create_name");
    	  } else {
    		  utils.hideMessageOnSpot("#job_create_name");
    		  isValid = true;
    		  current.removeInvalidClass("#job_create_name");
    	  }
    	  return isValid;
      },

      validateQueue: function (current) {
    	  var isValid;
    	  var errMsg = nls.queueEmptyMsg;
    	  if ($("#queue_name").val() == "empty") {
    		  utils.showMessageOnSpot("#queue_name", errMsg);
    		  current.addInvalidClass("#queue_name");
    		  isValid = false;
    	  } else {
    		  utils.hideMessageOnSpot("#queue_name");
    		  current.removeInvalidClass("#queue_name");
    		  isValid = true;
    	  }
    	  return isValid;
      },

      validateQueueE: function (event) {
    	  var current = event.data.foo;
    	  var isValid;
    	  var errMsg = nls.queueEmptyMsg;
    	  if ($("#queue_name").val() == "empty") {
    		  utils.showMessageOnSpot("#queue_name", errMsg);
    		  current.addInvalidClass("#queue_name");
    		  isValid = false;
    	  } else {
    		  utils.hideMessageOnSpot("#queue_name");
    		  current.removeInvalidClass("#queue_name");
    		  isValid = true;
    	  }
    	  return isValid;
      },

      validateJobFile: function (current) {
    	  var isValid;
    	  var errMsg = nls.jobFileEmptyMsg;
    	  if ($.trim($("#job_file_input_text").val()).length == 0) {
    		  utils.showMessageOnSpot("#job_file_input_text", errMsg, "bottom");
    		  current.addInvalidClass("#job_file_input_text");
    		  isValid = false;
    	  } else {
    		  utils.hideMessageOnSpot("#job_file_input_text");
    		  current.removeInvalidClass("#job_file_input_text");
    		  isValid = true;
    	  }
    	  return isValid;
      },

      validateWorkingDir: function (current) {
    	  var isValid;
    	  var errMsg = nls.workingDirEmptyMsg;
    	  if ($.trim($("#work_dir_text").val()).length == 0) {
    		  utils.showMessageOnSpot("#work_dir_select_btn", errMsg);
    		  current.addInvalidClass("#work_dir_text");
    		  isValid = false;
    	  } else {
    		  utils.hideMessageOnSpot("#work_dir_select_btn");
    		  current.removeInvalidClass("#work_dir_text");
    		  isValid = true;
    	  }
    	  return isValid;
      },

      validateWorkingDirE: function (event) {
    	  var current = event.data.foo;
    	  var isValid;
    	  var errMsg = nls.workingDirEmptyMsg;
    	  if ($.trim($("#work_dir_text").val()).length == 0) {
    		  utils.showMessageOnSpot("#work_dir_select_btn", errMsg);
    		  current.addInvalidClass("#work_dir_text");
    		  isValid = false;
    	  } else {
    		  utils.hideMessageOnSpot("#work_dir_select_btn");
    		  current.removeInvalidClass("#work_dir_text");
    		  isValid = true;
    	  }
    	  return isValid;
      },

      validateMPIProg: function (current) {
    	  var errMsg = nls.MPIProgEmptyMsg;
    	  var isValid;
    	  if ($.trim($("#MPI_prog_text").val()).length == 0) {
    		  utils.showMessageOnSpot("#MPI_prog_select_btn", errMsg);
    		  current.addInvalidClass("#MPI_prog_text");
    		  isValid = false;
    	  } else {
    		  utils.hideMessageOnSpot("#MPI_prog_select_btn");
    		  current.removeInvalidClass("#MPI_prog_text");
    		  isValid = true;
    	  }
    	  return isValid;
      },

      validateMPIProgE: function (event) {
    	  var current = event.data.foo;
    	  var errMsg = nls.MPIProgEmptyMsg;
    	  var isValid;
    	  if ($.trim($("#MPI_prog_text").val()).length == 0) {
    		  utils.showMessageOnSpot("#MPI_prog_select_btn", errMsg);
    		  current.addInvalidClass("#MPI_prog_text");
    		  isValid = false;
    	  } else {
    		  utils.hideMessageOnSpot("#MPI_prog_select_btn");
    		  current.removeInvalidClass("#MPI_prog_text");
    		  isValid = true;
    	  }
    	  return isValid;
      },

      validateNodeNum: function (current) {
    	  var isValid;
    	  var value = $.trim($("#nodes_num").val());
    	  var reg = /^[1-9]\d*$/;
    	  var errMsg = nls.intReqMsg;
    	  if (value == "" || value == null) {
    		  utils.hideMessageOnSpot("#nodes_num");
    		  current.removeInvalidClass("#nodes_num");
    		  isValid = true;
    	  } else if (!reg.test(value)) {
    		  utils.showMessageOnSpot("#nodes_num", errMsg);
    		  current.addInvalidClass("#nodes_num");
    		  isValid = false;
    	  } else {
    		  utils.hideMessageOnSpot("#nodes_num");
    		  current.removeInvalidClass("#nodes_num");
    		  isValid = true;
    	  }
    	  return isValid;
      },

      validateNodeNumE: function (event) {
    	  var current = event.data.foo;
    	  var isValid;
    	  var value = $.trim($("#nodes_num").val());
    	  var reg = /^[1-9]\d*$/;
    	  var errMsg = nls.intReqMsg;
    	  if (value == "" || value == null) {
    		  utils.hideMessageOnSpot("#nodes_num");
    		  current.removeInvalidClass("#nodes_num");
    		  isValid = true;
    	  } else if (!reg.test(value)) {
    		  utils.showMessageOnSpot("#nodes_num", errMsg);
    		  current.addInvalidClass("#nodes_num");
    		  isValid = false;
    	  } else {
    		  utils.hideMessageOnSpot("#nodes_num");
    		  current.removeInvalidClass("#nodes_num");
    		  isValid = true;
    	  }
    	  return isValid;
      },

      validateCPUCoreNum: function (current) {
    	  var isValid;
    	  var value = $.trim($("#CPU_core_num_text").val());
    	  var reg = /^[1-9]\d*$/;
    	  var errMsg = nls.intReqMsg;
    	  if (value == "" || value == null) {
    		  utils.hideMessageOnSpot("#CPU_core_num_text");
    		  current.removeInvalidClass("#CPU_core_num_text");
    		  isValid = true;
    	  } else if (!reg.test(value)) {
    		  utils.showMessageOnSpot("#CPU_core_num_text", errMsg);
    		  current.addInvalidClass("#CPU_core_num_text");
    		  isValid = false;
    	  } else {
    		  utils.hideMessageOnSpot("#CPU_core_num_text");
    		  current.removeInvalidClass("#CPU_core_num_text");
    		  isValid = true;
    	  }
    	  return isValid;
      },

      validateCPUCoreNumE: function (event) {
    	  var current = event.data.foo;
    	  var isValid;
    	  var value = $.trim($("#CPU_core_num_text").val());
    	  var reg = /^[1-9]\d*$/;
    	  var errMsg = nls.intReqMsg;
    	  if (value == "" || value == null) {
    		  utils.hideMessageOnSpot("#CPU_core_num_text");
    		  current.removeInvalidClass("#CPU_core_num_text");
    		  isValid = true;
    	  } else if (!reg.test(value)) {
    		  utils.showMessageOnSpot("#CPU_core_num_text", errMsg);
    		  current.addInvalidClass("#CPU_core_num_text");
    		  isValid = false;
    	  } else {
    		  utils.hideMessageOnSpot("#CPU_core_num_text");
    		  current.removeInvalidClass("#CPU_core_num_text");
    		  isValid = true;
    	  }
    	  return isValid;
      },

      validateMemSize: function (current) {
    	  var isValid;
    	  var value = $.trim($("#mem_size_text").val());
    	  var reg = /^[1-9]\d*$/;
    	  var errMsg = nls.intReqMsg;
    	  if (value == "" || value == null) {
    		  utils.hideMessageOnSpot("#mem_size_text");
    		  current.removeInvalidClass("#mem_size_text");
    		  isValid = true;
    	  } else if (!reg.test(value)) {
    		  utils.showMessageOnSpot("#mem_size_text", errMsg);
    		  current.addInvalidClass("#mem_size_text");
    		  isValid = false;
    	  } else {
    		  utils.hideMessageOnSpot("#mem_size_text");
    		  current.removeInvalidClass("#mem_size_text");
    		  isValid = true;
    	  }
    	  return isValid;
      },

      validateMemSizeE: function (event) {
    	  var current = event.data.foo;
    	  var isValid;
    	  var value = $.trim($("#mem_size_text").val());
    	  var reg = /^[1-9]\d*$/;
    	  var errMsg = nls.intReqMsg;
    	  if (value == "" || value == null) {
    		  utils.hideMessageOnSpot("#mem_size_text");
    		  current.removeInvalidClass("#mem_size_text");
    		  isValid = true;
    	  } else if (!reg.test(value)) {
    		  utils.showMessageOnSpot("#mem_size_text", errMsg);
    		  current.addInvalidClass("#mem_size_text");
    		  isValid = false;
    	  } else {
    		  utils.hideMessageOnSpot("#mem_size_text");
    		  current.removeInvalidClass("#mem_size_text");
    		  isValid = true;
    	  }
    	  return isValid;
      },

      validateWalltimeHour: function (current) {
    	  var isValid;
    	  var value = $.trim($("#walltime_hour").val());
    	  var reg = /^[1-9]\d*$/;
    	  var errMsg = nls.intReqMsg;
    	  if (value == "" || value == null) {
    		  utils.hideMessageOnSpot("#walltime_hour");
    		  current.removeInvalidClass("#walltime_hour");
    		  isValid = true;
    	  } else if (!reg.test(value)) {
    		  utils.showMessageOnSpot("#walltime_hour", errMsg, "bottom");
    		  current.addInvalidClass("#walltime_hour");
    		  isValid = false;
    	  } else {
    		  utils.hideMessageOnSpot("#walltime_hour");
    		  current.removeInvalidClass("#walltime_hour");
    		  isValid = true;
    	  }
    	  return isValid;
      },

      validateWalltimeHourE: function (event) {
    	  var current = event.data.foo;
    	  var isValid;
    	  var value = $.trim($("#walltime_hour").val());
    	  var reg = /^[1-9]\d*$/;
    	  var errMsg = nls.intReqMsg;
    	  if (value == "" || value == null) {
    		  utils.hideMessageOnSpot("#walltime_hour");
    		  current.removeInvalidClass("#walltime_hour");
    		  isValid = true;
    	  } else if (!reg.test(value)) {
    		  utils.showMessageOnSpot("#walltime_hour", errMsg, "bottom");
    		  current.addInvalidClass("#walltime_hour");
    		  isValid = false;
    	  } else {
    		  utils.hideMessageOnSpot("#walltime_hour");
    		  current.removeInvalidClass("#walltime_hour");
    		  isValid = true;
    	  }
    	  return isValid;
      },

      validateWalltimeMin: function (current) {
    	  var isValid;
    	  var value = $.trim($("#walltime_minute").val());
    	  var reg = /^([0-9]|[1-5]\d)$/;
    	  var errMsg = nls.minMsg;
    	  if (value == "" || value == null) {
    		  utils.hideMessageOnSpot("#walltime_minute");
    		  current.removeInvalidClass("#walltime_minute");
    		  isValid = true;
    	  } else if (!reg.test(value)) {
    		  utils.showMessageOnSpot("#walltime_minute", errMsg);
    		  current.addInvalidClass("#walltime_minute");
    		  isValid = false;
    	  } else {
    		  utils.hideMessageOnSpot("#walltime_minute");
    		  current.removeInvalidClass("#walltime_minute");
    		  isValid = true;
    	  }
    	  return isValid;
      },

      validateWalltimeMinE: function (event) {
    	  var current = event.data.foo;
    	  var isValid;
    	  var value = $.trim($("#walltime_minute").val());
    	  var reg = /^([0-9]|[1-5]\d)$/;
    	  var errMsg = nls.minMsg;
    	  if (value == "" || value == null) {
    		  utils.hideMessageOnSpot("#walltime_minute");
    		  current.removeInvalidClass("#walltime_minute");
    		  isValid = true;
    	  } else if (!reg.test(value)) {
    		  utils.showMessageOnSpot("#walltime_minute", errMsg);
    		  current.addInvalidClass("#walltime_minute");
    		  isValid = false;
    	  } else {
    		  utils.hideMessageOnSpot("#walltime_minute");
    		  current.removeInvalidClass("#walltime_minute");
    		  isValid = true;
    	  }
    	  return isValid;
      },

      validateEmail: function (current) {
    	  var isValid;
    	  var value = $.trim($("#email").val());
    	  //var reg = /^[A-Za-zd]+([-_.][A-Za-zd]+)*@([A-Za-zd]+[-.])+[A-Za-zd]{2,5}$/;
    	  var reg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    	  var errMsg = nls.mailMsg;
    	  if (value == "" || value == null) {
    		  utils.hideMessageOnSpot("#email");
    		  current.removeInvalidClass("#email");
    		  isValid = true;
    	  } else if (!reg.test(value)) {
    		  utils.showMessageOnSpot("#email", errMsg);
    		  current.addInvalidClass("#email");
    		  isValid = false;
    	  } else {
    		  utils.hideMessageOnSpot("#email");
    		  current.removeInvalidClass("#email");
    		  isValid = true;
    	  }
    	  return isValid;
      },

      validateEmailE: function (event) {
    	  var current = event.data.foo;
    	  var isValid;
    	  var value = $.trim($("#email").val());
    	  //var reg = /^[A-Za-zd]+([-_.][A-Za-zd]+)*@([A-Za-zd]+[-.])+[A-Za-zd]{2,5}$/;
    	  var reg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    	  var errMsg = nls.mailMsg;
    	  if (value == "" || value == null) {
    		  utils.hideMessageOnSpot("#email");
    		  current.removeInvalidClass("#email");
    		  isValid = true;
    	  } else if (!reg.test(value)) {
    		  utils.showMessageOnSpot("#email", errMsg);
    		  current.addInvalidClass("#email");
    		  isValid = false;
    	  } else {
    		  utils.hideMessageOnSpot("#email");
    		  current.removeInvalidClass("#email");
    		  isValid = true;
    	  }
    	  return isValid;
      },

      validateJobNameOnCreate: function (current) {
    	  var isValid;
    	  var value = $.trim($("#job_name").val());
    	  var reg = /^[a-zA-z]\w{3,15}$/;
		  var errMsgReg = nls.jobNameRegMsg;
    	  if (value == "" || value == null) {
    		  utils.hideMessageOnSpot("#job_name");
    		  current.removeInvalidClass("#job_name");
    		  isValid = true;
    	  } else if (!reg.test(value)) {
    		  utils.showMessageOnSpot("#job_name", errMsgReg);
    		  current.addInvalidClass("#job_name");
    		  isValid = false;
    	  } else {
    		  utils.hideMessageOnSpot("#job_name");
    		  current.removeInvalidClass("#job_name");
    		  isValid = true;
    	  }
    	  return isValid;
      },

      validateJobNameOnCreateE: function (event) {
    	  var current = event.data.foo;
    	  var isValid;
    	  var value = $.trim($("#job_name").val());
    	  var reg = /^[a-zA-z]\w{3,15}$/;
		  var errMsgReg = nls.jobNameRegMsg;
    	  if (value == "" || value == null) {
    		  utils.hideMessageOnSpot("#job_name");
    		  current.removeInvalidClass("#job_name");
    		  isValid = true;
    	  } else if (!reg.test(value)) {
    		  utils.showMessageOnSpot("#job_name", errMsgReg);
    		  current.addInvalidClass("#job_name");
    		  isValid = false;
    	  } else {
    		  utils.hideMessageOnSpot("#job_name");
    		  current.removeInvalidClass("#job_name");
    		  isValid = true;
    	  }
    	  return isValid;
      },

      setInputErr: function (tgt) {
    	  $(tgt).css("border", "1px solid red");
      },

      recoverInputErr: function (tgt) {
    	  $(tgt).css("border", "1px solid #ccc");
      },

      onRender: function () {
    	  var current = this;

    	  $("#dialog_init").click(function () {
			  
		  $("#jobSubmit").css('display','none');
			
	   // var  generalView= new GeneralView({el: $('#select_mainContainer_top')});
          
	   //	     generalView.render();

		//var newTemplateSelectView= new TemplateSelectView({el: $('#select_sidebar')});
			  
		//	 newTemplateSelectView.render();
			  
		//	 $("#jobSubmitConfirm").modal('show');
			 //$("#modal_backdrop").css(display','none');
			
			    
    	  });
    	  
    	  $("#select_template_reset").click(function(){
          	 
          	//alert("初始generalView  开启重置功能");
          	
       var  generalView= new GeneralView({el: $('#select_mainContainer_top')});
          
	   	    generalView.render();

          	//alert("初始generalView 重置功能结束");
          	
            });
             
    	$("#close_job_submit_btn_2").click(function () {
    	  	
    		  $("#jobSubmitMain_title").modal('hide');
    		  
    	  });
    	  
    	  $("#cancel_confirm_submit_x").click(function () {
    		  $("#jobSubmitConfirm").modal('hide');
    	  });

    	  $("#close_job_create_result_btn").click(function () {
    		  $("#jobCreateSuccess").modal('hide');
    	  });

    	  $("#close_jobSubmitMain_title_btn").click(function(){
    	  	$("#jobSubmitMain_title").modal('hide');
    	  });

    	  $("#confirm_cancel").click(function () {
    		  $("#jobSubmit").modal('hide');
    	  });

    	  $("#submit_cancel").click(function () {
    		  current.clearCreatePage();
    		  $("#jobCreate").modal('hide');
    		  current.selected_queue = "";
    		  $("#jobSubmit").modal('hide');
    	  });

    	  $("#cancel_create_x").click(function () {
    		  current.clearCreatePage();
    		  $("#jobCreate").modal('hide');
    		  current.selected_queue = "";
    		  $("#jobSubmit").modal('hide');
    	  });
    	  

    	  $("#job_create_name").on("keyup", {foo: current}, current.validateJobNameE);
    	  $("#job_create_name").on("blur", {foo: current}, current.validateJobNameE);

    	  $("#nodes_num").on("keyup", {foo: current}, current.validateNodeNumE);
    	  $("#nodes_num").on("blur", {foo: current}, current.validateNodeNumE);

    	  $("#CPU_core_num_text").on("keyup", {foo: current}, current.validateCPUCoreNumE);
    	  $("#CPU_core_num_text").on("blur", {foo: current}, current.validateCPUCoreNumE);

    	  $("#mem_size_text").on("keyup", {foo: current}, current.validateMemSizeE);
    	  $("#mem_size_text").on("blur", {foo: current}, current.validateMemSizeE);

    	  $("#walltime_hour").on("keyup", {foo: current}, current.validateWalltimeHourE);
    	  $("#walltime_hour").on("blur", {foo: current}, current.validateWalltimeHourE);

    	  $("#walltime_minute").on("keyup", {foo: current}, current.validateWalltimeMinE);
    	  $("#walltime_minute").on("blur", {foo: current}, current.validateWalltimeMinE);

    	  $("#email").on("keyup", {foo: current}, current.validateEmailE);
    	  $("#email").on("blur", {foo: current}, current.validateEmailE);

    	  $("#job_name").on("keyup", {foo: current}, current.validateJobNameOnCreateE);
    	  $("#job_name").on("blur", {foo: current}, current.validateJobNameOnCreateE);

    	  $("#job_create_submit").click(function () {
    		  if (current.validateJobName(current) & current.validateQueue(current) & current.validateWorkingDir(current) & current.validateMPIProg(current) & current.validateNodeNum(current) & current.validateCPUCoreNum(current) & current.validateMemSize(current) & current.validateWalltimeHour(current) & current.validateWalltimeMin(current) & current.validateEmail(current)) {
    			  $("#jobCreate").modal('hide');
        		  $("#jobSubmit").modal('hide');
        		  var dataJobName = $("#job_create_name").val();
        		  var dataQueueName = $("#queue_name").val();
        		  var dataWorkDir = $("#work_dir_text").val();
        		  var dataMPIProg = $("#MPI_prog_text").val();
        		  var dataMPIArg = $("#MPI_arg").val();
        		  var dataNodesNum = $("#nodes_num").val();
        		  if (dataNodesNum == null || dataNodesNum == "") {
        			  dataNodesNum = 0;
        		  } else {
        			  dataNodesNum = parseInt(dataNodesNum);
        		  }
        		  var dataCoresPerNode = $("#CPU_core_num_text").val();
        		  if (dataCoresPerNode == null || dataCoresPerNode == "") {
        			  dataCoresPerNode = 0;
        		  } else {
        			  dataCoresPerNode = parseInt(dataCoresPerNode);
        		  }
        		  var dataMemSize = $("#mem_size_text").val();
        		  if (dataMemSize == null || dataMemSize == "") {
        			  dataMemSize = 0;
        		  } else {
        			  dataMemSize = parseInt(dataMemSize);
        		  }
        		  var dataWallTimeHour = $("#walltime_hour").val();
        		  if (dataWallTimeHour == null || dataWallTimeHour == "") {
        			  dataWallTimeHour = "0";
        		  }
        		  var dataWallTimeMinute = $("#walltime_minute").val();
        		  if (dataWallTimeMinute == null || dataWallTimeMinute == "" || dataWallTimeMinute == "0") {
        			  dataWallTimeMinute = "00";
        		  } else if (parseInt(dataWallTimeMinute) < 10) {
        			  dataWallTimeMinute = "0" + dataWallTimeMinute;
        		  }
        		  var dataWallTime = dataWallTimeHour + ":" + dataWallTimeMinute + ":00";
        		  var dataTrigger = "";
        		  if ($("#notice_finish").is(':checked') && $("#notice_suspend").is(':checked')) {
        			  dataTrigger = "be";
        		  } else if ($("#notice_finish").is(':checked')) {
        			  dataTrigger = "e";
        		  } else if ($("#notice_suspend").is(':checked')) {
        			  dataTrigger = "b";
        		  }
        		  var dataMail = $("#email").val();
        		  //var csrftoken = $.cookie('csrftoken');
        		  //var dataCommand = $("#exec_command").val();
        		  var dataPost = {"type":"template","action":"create","jobname":dataJobName,"queue":dataQueueName,"workingdir":dataWorkDir,"mpi_prog":dataMPIProg,"mpi_prog_arguments":dataMPIArg,"pnodescount":dataNodesNum,"ppn":dataCoresPerNode,"pmem":dataMemSize,"walltime":dataWallTime,"mailtrigger":dataTrigger,"mail":dataMail};
        		  dataPost = JSON.stringify(dataPost);

        		  $.ajax({
        			  type: "POST",
        			  url: urlConstants.jobs,
        			  data: dataPost,
        			  //headers: {"X-CSRFToken":csrftoken, "Content-Type": "application/json;charset=UTF-8"},
        			  headers: {"Content-Type": "application/json;charset=UTF-8"},
        			  dataType: "json",
        			  success: function (data, textStatus) {
        				  $("#jobCreate").modal('hide');
        				  $("#progressDialog").modal('show');
    					  current.initQueryCreateStatus(data);
        			  },
        			  error: function (XMLHttpRequest, textStatus, errorThrown) {
        				  $("#progressDialog").modal('hide');
        	      		  $("#createResultArea").addClass("alert alert-dismissable").css("background-color", "white");
        				  $("#createResult").html(nls.jobCreateFailed).css("position" ,"relative");
        				  $("#resultIcon").attr("src", "/static/js/customUI/user/dashboard/job/resources/ic_clear_red_36x36.png");
        				  $("#jobCreateID").css("display","none");
        				  $("#jobCreateResult").modal('show');
        				  utils.forceRefresh();
        				  /*setTimeout(function () {
        					  $("#jobCreateResult").modal('hide');
        				  }, 3000);*/
        			  }
        		  });
    		  	} else {

    		  }


    	  });

    	  $("#job_name").change(function () {
    		  $("#job_create_name").val($("#job_name").val());
    	  });

    	  //$("#email").focus(function () {
    		//  $("#mail_notice").css("display", "block");
    	  //});

    	  //$("#email").blur(function () {
    		//  $("#mail_notice").css("display", "none");
    	  //});

    	  $("#create_job").click(function () {
    		  if (current.validateJobNameOnCreate(current)) {
    			  $("#jobCreate").modal('show');
        		  $.ajax({
        			  type: "GET",
        			  url: urlConstants.queues,
        			  dataType: "json",
        			  success: function (data, textStatus) {
        				  current.clearQueueOption();
        				  var queueList = [];
        				  $.each(data, function (i, dt) {
        					  queueList.push(dt.name);
        				  });
        				  $.each(queueList, function(i, queue) {
        					  $("#queue_name").append("<option value='" + queue + "'>" + queue + "</option>");
        				  });
        				  for (var i = 0; i < $("#queue_name")[0].length; i ++) {
        	    	    	if ($("#queue_name")[0][i].innerHTML == current.selected_queue) {
        	    	    		$("#queue_name")[0][i].selected = true;
        	    	    	} else {
        	    	    		$("#queue_name")[0][i].selected = false;
        	    	    	}
        				  }
        			  },
        			  error: function (XMLHttpRequest, textStatus, errorThrown) {

        			  }
        		  });
    		  } else {

    		  }
    	  });

    	  $("#job_file_select_btn").click(function () {
            var $fileSelectionDialog = $('#jobfile-elfinder-dlg-content').elfinder({
                url: urlConstants.files,
                lang: 'zh_CN',
                defaultView: 'list',
                useBrowserHistory: false,
                uiOptions: {
                    // toolbar configuration
                    toolbar : [
                        ['back', 'forward'],
                        ['choosefile'],
                        ['mkdir', 'upload', 'rename'],
                        ['sort']
                    ]
                },
                handlers : {
                    init : function(event, elfinderInstance) {
                        $('.elfinder-button-icon-choosefile').parent().css("width","100px");
                        $('.elfinder-button-icon-choosefile').parent().css("cursor","default");
                        $('.elfinder-button-icon-choosefile').css("padding-left","20px");
                        $('.elfinder-button-icon-choosefile').css("font-family", 'Arial, "Microsoft YaHei", "微软雅黑", sans-serif');
                        $('.elfinder-button-icon-choosefile').css("font-size", "14px");
                        $('.elfinder-button-icon-choosefile').css("display","inline");
                        $('.elfinder-button-icon-choosefile').text(nls.chooseFile);
                        $(".elfinder-button form input[type='file']").attr('title', nls.uploadFiles);
                    }
                },
                commands: [
                    'back', 'forward','sort','mkdir','upload','search','getfile','open','download','rm',
                    'rename','choosefile'
                ],
                contextmenu : {
                    // navbarfolder menu
                    navbar : ['open', '|', 'rm', '|'],

                    // current directory menu
                    cwd    : ['reload', 'back', '|', 'upload', 'mkdir'],

                    // current directory file menu
                    files  : [
                        'choosefile', '|', 'download', '|',
                        'rm', '|', 'rename'
                    ]
                },
                getFileCallback: function(file) {
                    $('#job_file_input_text').val(file.path);
                    $('#job_file_input_text').attr('title', file.path);
                    $("#jobfile-elfinder-dlg").modal('hide');

                    current.validateJobFile(current);
                },
                chooseFileCallback: function(file) {
                    $('#job_file_input_text').val(file.path);
                    $('#job_file_input_text').attr('title', file.path);
                    $("#jobfile-elfinder-dlg").modal('hide');

                    current.validateJobFile(current);
                }
            });
          $("#jobfile-elfinder-dlg").modal('show');
    	  });

          $("#work_dir_select_btn").click(function () {
            var $fileSelectionDialog = $('#workdir-elfinder-dlg-content').elfinder({
                url: urlConstants.files,
                lang: 'zh_CN',
                defaultView: 'list',
                useBrowserHistory: false,
                uiOptions: {
                    // toolbar configuration
                    toolbar : [
                        ['back', 'forward'],
                        ['choosefolder'],
                        ['mkdir', 'upload', 'rename'],
                        ['sort']
                    ]
                },
                handlers : {
                    init : function(event, elfinderInstance) {
                        $('.elfinder-button-icon-choosefolder').parent().css("width","100px");
                        $('.elfinder-button-icon-choosefolder').parent().css("cursor","default");
                        $('.elfinder-button-icon-choosefolder').css("padding-left","20px");
                        $('.elfinder-button-icon-choosefolder').css("font-family", 'Arial, "Microsoft YaHei", "微软雅黑", sans-serif');
                        $('.elfinder-button-icon-choosefolder').css("font-size", "14px");
                        $('.elfinder-button-icon-choosefolder').css("display","inline");
                        $('.elfinder-button-icon-choosefolder').text(nls.chooseFolder);
                        $(".elfinder-button form input[type='file']").attr('title', nls.uploadFiles);
                    }
                },
                commands: [
                    'back', 'forward','sort','mkdir','upload','search','getfile','open','download','rm',
                    'rename','choosefolder'
                ],
                contextmenu : {
                    // navbarfolder menu
                    navbar : ['open', '|', 'rm', '|'],

                    // current directory menu
                    cwd    : ['reload', 'back', '|', 'upload', 'mkdir'],

                    // current directory file menu
                    files  : [
                        'choosefolder', '|', 'download', '|',
                        'rm', '|', 'rename'
                    ]
                },
                getFileCallback: function(file) {
                },
                getFolderCallback: function(file) {
                    $('#work_dir_text').val(file.path);
                    $('#work_dir_text').attr('title', file.path);
                    $("#workdir-elfinder-dlg").modal('hide');
                    
                    current.validateWorkingDir(current);

                    if ($.trim($("#work_dir_text").val()).length == 0 || $("#work_dir_text").val() == null || $("#work_dir_text").val() == "") {
                        $("#job_create_submit").attr("disabled", true);
                    }
                }
            });
            $("#workdir-elfinder-dlg").modal('show');
          });

          $("#MPI_prog_select_btn").click(function () {
            var $fileSelectionDialog = $('#mpiprog-elfinder-dlg-content').elfinder({
                url: urlConstants.files,
                lang: 'zh_CN',
                defaultView: 'list',
                useBrowserHistory: false,
                uiOptions: {
                    // toolbar configuration
                    toolbar : [
                        ['back', 'forward'],
                        ['choosefile'],
                        ['mkdir', 'upload', 'rename'],
                        ['sort']
                    ]
                },
                handlers : {
                    init : function(event, elfinderInstance) {
                        $('.elfinder-button-icon-choosefile').parent().css("width","100px");
                        $('.elfinder-button-icon-choosefile').parent().css("cursor","default");
                        $('.elfinder-button-icon-choosefile').css("padding-left","20px");
                        $('.elfinder-button-icon-choosefile').css("font-family", 'Arial, "Microsoft YaHei", "微软雅黑", sans-serif');
                        $('.elfinder-button-icon-choosefile').css("font-size", "14px");
                        $('.elfinder-button-icon-choosefile').css("display","inline");
                        $('.elfinder-button-icon-choosefile').text(nls.chooseFile);
                        $(".elfinder-button form input[type='file']").attr('title', nls.uploadFiles);
                    }
                },
                commands: [
                    'back', 'forward','sort','mkdir','upload','search','getfile','open','download','rm',
                    'rename','choosefile'
                ],
                contextmenu : {
                    // navbarfolder menu
                    navbar : ['open', '|', 'rm', '|'],

                    // current directory menu
                    cwd    : ['reload', 'back', '|', 'upload', 'mkdir'],

                    // current directory file menu
                    files  : [
                        'choosefile', '|', 'download', '|',
                        'rm', '|', 'rename'
                    ]
                },
                getFileCallback: function(file) {
                    $('#MPI_prog_text').val(file.path);
                    $('#MPI_prog_text').attr('title', file.path);
                    $("#mpiprog-elfinder-dlg").modal('hide');
                    
                    current.validateMPIProg(current);
                },
                chooseFileCallback: function(file) {
                    $('#MPI_prog_text').val(file.path);
                    $('#MPI_prog_text').attr('title', file.path);
                    $("#mpiprog-elfinder-dlg").modal('hide');
                    
                    current.validateMPIProg(current);

                    if ($.trim($("#MPI_prog_text").val()).length == 0 || $("#MPI_prog_text").val() == null || $("#MPI_prog_text").val() == "") {
                        $("#job_create_submit").attr("disabled", true);
                    }
                }
            });
            $("#mpiprog-elfinder-dlg").modal('show');
          });

    	  $('#queue_name').change(function () {
    		  current.selected_queue = $('#queue_name').val();
    		  current.validateQueue(current);
    	  });

    	  $("#work_dir_text").change(function () {
    		  current.validateWorkingDir(current);
    	  });

    	  $("#MPI_prog_text").change(function () {
    		  current.validateMPIProg(current);
    	  });

    	  $("#job_file_input").change(function () {
    		  var filename = $("#job_file_input").val();
    		  $("#job_file_input_text").val(filename);
    	  });

    	  $("#job_file_input_text").change(function () {
    		  current.validateJobFile(current);
    	  });

    	  $("#confirm_submit").click(function () {
    		  if (current.validateJobFile(current) & current.validateJobNameOnCreate(current)) {
    			  var fileName = $("#job_file_input_text").val();
        		  var jobName = $("#job_name").val();
        		  var dataURL = urlConstants.jobs;
        		  var csrftoken = $.cookie('csrftoken');
        		  var dataPost = {"type": "file", "action":"create", "jobname": jobName, "jobfilename": fileName };
        		  dataPost = JSON.stringify(dataPost);
        		  $.ajax({
        			  type: "POST",
        			  url: dataURL,
        			  data: dataPost,
        			  headers: {"Content-Type": "application/json;charset=UTF-8"},
        			  success: function (data, textStatus) {
        				  $("#jobSubmit").modal('hide');
        				  $("#progressDialog").modal('show');
        				  current.initQueryCreateStatus(data);
        			  },
        			  error: function (XMLHttpRequest, textStatus, errorThrown) {
        				  $("#jobSubmit").modal('hide');
        				  $("#progressDialog").modal('hide');
        	      		  $("#createResultArea").addClass("alert alert-dismissable").css("background-color", "white");
        				  $("#createResult").html(nls.jobCreateFailed).css("position" ,"relative");
        				  $("#resultIcon").attr("src", "/static/js/customUI/user/dashboard/job/resources/ic_clear_red_36x36.png");
        				  $("#jobCreateID").css("display","none");
        				  $("#jobCreateResult").modal('show');
        				  utils.forceRefresh();
        				  /*setTimeout(function () {
        				    	$("#jobCreateResult").modal('hide');
        				    }, 3000);*/
        			  }
        		  });
    		  } else {

    		  }
    	  });

    	  $("#dialog_init").click();
      },

    });
  });