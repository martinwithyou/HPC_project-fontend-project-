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
    'text!./templates/nodeListTmpl.mustache',
    'utils/utils',
    'utils/constants/constants',
    'utils/constants/urlConstants',
    'utils/eventBus',
    'datatables',
    'datatables_bootstrap',
    'i18n!./nls/nodeList',
    'css!./css/nodeListView'
  ],
  function(Marionette, elfinder, elfinder_i18n, nodeList, utils, constants, urlConstants, eventBus, datatables, datatables_bootstrap, nls) {
    'use strict';
    return Marionette.ItemView.extend({
      template: nodeList,

      ui: {
        runningTable : "#running-dataTables",
        waitingTable : "#waiting-dataTables",
        hangingTable : "#hanging-dataTables",
        finishTable : "#finish-dataTables"
      },

      templateHelpers: function () {
        return {
          nls: nls
        };
      },

      self: this,
      runningTable: "",
      waitingTable: "",
      finishTable: "",

      tempJobID: "",

      getJobNum: function () {
    	  $.ajax ({
    		  type: "GET",
    		  url: urlConstants.jobSummary,
    		  success: function (data, textStatus) {
        		  $("#running_num").html(data.running_num);
        		  $("#waiting_num").html(data.waitforrun_num);
        		  $("#finish_num").html(data.finished_num);
    		  },
    		  error: function (XMLHttpRequest, textStatus, errorThrown) {

    		  }
    	  });
      },

      setBlack: function (btn) {
    	  btn.css("color", "black");
      },

      setBlue: function (btn) {
    	  btn.css("color", "rgb(51, 122, 183)");
      },

      showCancelConfirm: function (full) {
    	  self.tempJobID = full.id;
    	  $("#deleteConfirm").modal("show");

    	  $("#delete_jobID_section").html(nls.job_id + ": " + full.jobid);
    	  $("#delete_jobName_section").html(nls.job_name + ": " + full.jobname);

    	  var qtime_string = new Date((full.qtime - full.timezone) * 1000);
    	  var qtime_year = qtime_string.getFullYear();
    	  var qtime_month = qtime_string.getMonth()+1;
    	  var qtime_date = qtime_string.getDate();
    	  var qtime_hour = qtime_string.getHours();
  		  var qtime_minute = qtime_string.getMinutes();
  		  if (qtime_month < 10) {
  			qtime_month = "0" + qtime_month;
  		  }
  		  if (qtime_date < 10) {
  			qtime_date = "0" + qtime_date;
  		  }
  		  if (qtime_hour < 10) {
  			qtime_hour = "0" + qtime_hour;
  		  }
  		  if (qtime_minute < 10) {
  			qtime_minute = "0" + qtime_minute;
  		  }
  		  var qtime_display = qtime_year + "-" + qtime_month + "-" + qtime_date + " " + qtime_hour + ":" + qtime_minute;

  		  $("#delete_submit_time_section").html(nls.qtime + ": " + qtime_display);

      },

      showDeleteFinishConfirm: function (full) {
    	  self.tempJobID = full.id;
    	  $("#deleteFinishConfirm").modal('show');
    	  $("#delete_finish_jobID_section").html(nls.job_id + ": " + full.jobid);
    	  $("#delete_finish_jobName_section").html(nls.job_name + ": " + full.jobname);
    	  var qtime_string = new Date((full.qtime - full.timezone) * 1000);
    	  var qtime_year = qtime_string.getFullYear();
    	  var qtime_month = qtime_string.getMonth()+1;
    	  var qtime_date = qtime_string.getDate();
    	  var qtime_hour = qtime_string.getHours();
  		  var qtime_minute = qtime_string.getMinutes();
  		  if (qtime_month < 10) {
  			qtime_month = "0" + qtime_month;
  		  }
  		  if (qtime_date < 10) {
  			qtime_date = "0" + qtime_date;
  		  }
  		  if (qtime_hour < 10) {
  			qtime_hour = "0" + qtime_hour;
  		  }
  		  if (qtime_minute < 10) {
  			qtime_minute = "0" + qtime_minute;
  		  }
  		  var qtime_display = qtime_year + "-" + qtime_month + "-" + qtime_date + " " + qtime_hour + ":" + qtime_minute;

  		  $("#delete_finish_submit_time_section").html(nls.qtime + ": " + qtime_display);
      },

      showdetail: function (full) {
    	  var id = full.id;
    	  var getjoburl = urlConstants.jobs + id;
      	  $.ajax({
      		  type: "GET",
      		  url: getjoburl,
      		  dataType: "json",
      		  success: function (data, textStatus) {
      			 $("#showdetail").modal('show');
      	    	 $("#show_job_id").html(nls.job_id + ": " + data.jobid);
      	    	 $("#show_job_name").html(nls.job_name + ": " + data.jobname);
      	    	 $("#show_job_exechosts").html(nls.exechosts + ": " + data.exechosts);   
      	    },
      		error: function (XMLHttpRequest, textStatus, errorThrown) {
      			 $("#showdetail").modal('show');
     	    	 $("#show_job_id").html(nls.job_id + ": ");
     	    	 $("#show_job_name").html(nls.job_name + ": ");
     	    	 $("#show_job_exechosts").html(nls.exechosts + ": ");     
      		}
      	  });
      },
      
      showRerunConfirm: function (full) {
    	  self.tempJobID = full.id;
    	  $("#rerunConfirm").modal('show');
    	  $("#rerun_jobID_section").html(nls.job_id + ": " +full.jobid);
    	  $("#rerun_jobName_section").html(nls.job_name + ": " +full.jobname);
    	  var qtime_string = new Date((full.qtime - full.timezone) * 1000);
    	  var qtime_year = qtime_string.getFullYear();
    	  var qtime_month = qtime_string.getMonth()+1;
    	  var qtime_date = qtime_string.getDate();
    	  var qtime_hour = qtime_string.getHours();
  		  var qtime_minute = qtime_string.getMinutes();
  		  if (qtime_month < 10) {
  			qtime_month = "0" + qtime_month;
  		  }
  		  if (qtime_date < 10) {
  			qtime_date = "0" + qtime_date;
  		  }
  		  if (qtime_hour < 10) {
  			qtime_hour = "0" + qtime_hour;
  		  }
  		  if (qtime_minute < 10) {
  			qtime_minute = "0" + qtime_minute;
  		  }
  		  var qtime_display = qtime_year + "-" + qtime_month + "-" + qtime_date + " " + qtime_hour + ":" + qtime_minute;

  		  var endtime_string = new Date((full.endtime - full.timezone) * 1000);
	  	  var endtime_year = endtime_string.getFullYear();
	  	  var endtime_month = endtime_string.getMonth()+1;
	  	  var endtime_date = endtime_string.getDate();
	  	  var endtime_hour = endtime_string.getHours();
		  var endtime_minute = endtime_string.getMinutes();
		  if (endtime_month < 10) {
			  endtime_month = "0" + endtime_month;
	  		  }
	  		  if (endtime_date < 10) {
	  			endtime_date = "0" + endtime_date;
	  		  }
	  		  if (endtime_hour < 10) {
	  			endtime_hour = "0" + endtime_hour;
	  		  }
	  		  if (endtime_minute < 10) {
	  			endtime_minute = "0" + endtime_minute;
	  		  }
		  var endtime_display = endtime_year + "-" + endtime_month + "-" + endtime_date + " " + endtime_hour + ":" + endtime_minute;
    	  $("#rerun_submit_time_section").html(nls.qtime + ": " + qtime_display);
    	  $("#rerun_finish_time_section").html(nls.endtime + ": " + endtime_display);
      },

      showModifyJob: function () {
    	  $("#jobModify").modal("show");
      },

      setLocalFileHashByName: function (initialPath, self) {
        var defer = $.ajax({
          url: urlConstants.files,
          type: 'GET',
          dataType: 'json',
          data: {"cmd": "hash", "path": initialPath},
        })
        .done(function(data) {
          utils.storage["elfinder-lastdireditor"] = data.hash;
          self.showFileManagementDialog();
        });
      },

      showFileManagementDialog: function() {
        var $fileSelectionDialog = $('<div id="editor" />').dialogelfinder({
            url: urlConstants.files,
            lang: 'zh_CN',
            defaultView: 'list',
            useBrowserHistory: false,
            width: '700px',
            //rememberLastDir : false,
            //customData: {'startPath': 'Home/untitled folder'},
            uiOptions: {
                // toolbar configuration
                toolbar : [
                    ['back', 'forward'],
                    ['mkdir', 'upload','rename'],
                    ['sort']
                ]
            },
            commands: [
                'back', 'forward','sort','mkdir','upload','search','getfile','open','download','rm',
                'rename'
            ],
            contextmenu : {
                // navbarfolder menu
                navbar : ['open', '|', 'rm', '|'],

                // current directory menu
                cwd    : ['reload', 'back', '|', 'upload', 'mkdir'],

                // current directory file menu
                files  : [
                    'getfile', '|', 'download', '|',
                    'rm', '|', 'rename'
                ]
            },
            getFileCallback: function(file) {
            },
            handlers : {
                init : function(event, elfinderInstance) {
                    $(".elfinder-button form input[type='file']").attr('title', nls.uploadFiles);
                }
            }
        });
      },

      setModifyQueueOptions: function (data) {
    	  this.clearModifyQueueOption();
    	  var modify_queues = data.queues;
    	  var modify_selected_queue = data.queue_selected;
    	  $.each(modify_queues, function (i, queue) {
    		  $("#modify_queue_name").append("<option value='" + queue + "'>" + queue + "</option>");
    	  });
    	  for (var i = 0; i < $("#modify_queue_name")[0].length; i ++) {
    		  if ($("#modify_queue_name")[0][i].innerHTML == modify_selected_queue) {
    			  $("#modify_queue_name")[0][i].selected = true;
    		  } else {
    			  $("#modify_queue_name")[0][i].selected = false;
    		  }
    	  }
      },

      clearModifyQueueOption: function () {
    	  var modify_queue_name = $("#modify_queue_name");
    	  for (var i = modify_queue_name[0].length; i > 1; i--) {
    		  modify_queue_name[0].remove(i - 1);
    	  }
      },

      setModifyCheck: function (data) {
    	  if (data.share == true) {
    		  $("#modify_nodesRadios2").removeAttr("checked");
    		  $("#modify_nodesRadios1").attr("checked","checked");
    	  } else {
    		  $("#modify_nodesRadios1").removeAttr("checked");
    		  $("#modify_nodesRadios2").attr("checked","checked");
    	  }
      },

      setModifyNotify: function (data) {
    	  var triggerList = data.trigger;
    	  var notifyArr = triggerList.split(",");
    	  if ($.inArray("finish", notifyArr)!==-1 ) {
    		  $("#modify_notice_finish").attr("checked","checked");
    	  } else {
    		  $("#modify_notice_finish").attr("checked",false);
    	  }

    	  if ($.inArray("suspend", notifyArr)!==-1) {
    		  $("#modify_notice_suspend").attr("checked","checked");
    	  } else {
    		  $("#modify_notice_suspend").attr("checked",false);
    	  }
      },

      clearModifyCommands: function () {
    	  $("#modify_exec_command").html("");
      },

      setModifyCommands: function (data) {
    	  this.clearModifyCommands();
    	  var commands = data.commands;
    	  $.each(commands, function (i, command) {
    		  $("#modify_exec_command").append(command + "\r");
    	  });
      },

      setModifyValue: function (data) {
    	  $("#modify_job_name").val(data.name);
    	  $("#modify_file_name").val(data.filename);
    	  $("#modify_output_dir_text").val(data.output_path);
    	  $("#modify_CPU_core_num_text").val(data.cpus);
    	  $("#modify_nodes_num").val(data.nodes);
    	  $("#modify_mem_size_text").val(data.mem_size);
    	  $("#modify_run_time_text").val(data.walltime);
    	  this.setModifyQueueOptions(data);
    	  this.setModifyCheck(data);
    	  this.setModifyNotify(data);
    	  $("#modify_email").val(data.mail);
    	  $("#modify_cell").val(data.phone);
    	  this.setModifyCommands(data);
      },

      initRunningTable: function () {
    	  	var current = this;
			var runningTable = this.ui.runningTable.dataTable({
				  responsive: true,
				  language: {
					  "url": "/static/js/translation/datatables.chinese.json"
				  },
				  aaSorting: [[ 0, "desc"]],
				  columns: [
		            { "title": "<div style='text-align:center;font-size:12px;color:#000000'>"+nls.job_id+"</div>", "data": "jobid",
		            	"render": function (data, type, full, meta) {
		            		return "<div style='text-align:center;font-size:12px;color:#000000'>"+data+"</div>";
		            	}},
			        { "title": "<div style='text-align:center;font-size:12px;color:#000000'>"+nls.job_name+"</div>", "data": "jobname",
		            	"render": function (data, type, full, meta) {
		            		return "<div style='text-align:center;font-size:12px;color:#000000'>"+data+"</div>";
		            	}},
			        { "title": "<div style='text-align:center;font-size:12px;color:#000000'>"+nls.queue+"</div>", "data": "queue",
			        	"render": function (data, type, full, meta) {
		            		return "<div style='text-align:center;font-size:12px;color:#000000'>"+data+"</div>";
		            	}},
			        { "title": "<div style='text-align:center;font-size:12px;color:#000000'>"+nls.qtime+"</div>", "class": "center", "data": "qtime", "defaultContent": "",
			        	"render": function (data, type, full, meta) {
			        		var timeString = new Date((data - full.timezone) * 1000);
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
			        		return "<div style='text-align:center;font-size:12px;color:#000000'>"+dateDisplay+"</div><div style='text-align:center;color:#666666;;font-size:12px'>"+timeDisplay+"</div>";
			        	}},
			        { "title": "<div style='text-align:center;font-size:12px;color:#000000'>"+nls.run_time+"</div>", "class": "center", "data": "starttime",
			        	"render": function (data, type, full, meta) {
			        		var deltaTime = full.currtime - data;
			        		var run_hour = parseInt(deltaTime/3600);
			        		var left_sec = parseInt(deltaTime%3600);
			        		var run_min = parseInt(left_sec/60);
		            		return "<div style='text-align:center;font-size:12px;color:#000000'>"+run_hour+" "+nls.hour+" "+run_min+" "+nls.min+"</div>";
		            	}},
		        	{ "title": "<div style='font-size:12px;color:#000000'>"+nls.working_dir+"</div>", "data": "workingdir",
			        	"render": function (data, type, full, meta) {
			        		return "<div class='running_working_dir' style='color:#0000ff;font-size:12px'>"+data+"</div>";
			        	}},
		        	{ "title": "<div style='text-align:center;font-size:12px;color:#000000'>"+nls.action+"</div>", "defaultContent": "",
			        	"render": function (data, type, full, meta) {
			        		var id = full.id;
		        			//var delete_rerun_finish_btn = "<div style='text-align:center'><ul style='list-style:none;padding-left:10px'><li class='dropdown'><a href='javascript:void(0)' class='dropdown-toggle' data-toggle='dropdown'><img src='/static/js/customUI/nodeList/resources/rerun.png'></img><b class='caret'></b></a><ul class='dropdown-menu'><li><a class='delete' id='delete_finish_"+delete_finish_ID+"' href='javascript:void(0)'><img src='/static/js/customUI/nodeList/resources/ic_delete_grey_25x25.png'></img><span style='margin-left:5px'>"+nls.del+"</span></a></li><li><a class='rerun' id='rerun_finish_"+rerun_finish_ID+"' href='javascript:void(0)'><img src='/static/js/customUI/nodeList/resources/rerun.png'></img><span style='margin-left:5px'>"+nls.rerun+"</span></a></li></ul></li></ul></div>";
		        			var operation_btns = "<div style='text-align:center'>" +
		        					"<a style='margin-left:10px' class ='view' title='"+nls.viewjobdetail+"' id='view_detail_"+id+"' href='javascript:void(0)'><img src='/static/js/customUI/nodeList/resources/details.png'></img></a>" +
		        					"<a class='cancel' title='"+nls.canceljob+"' id='cancel_"+id+"' href='javascript:void(0)'><img src='/static/js/customUI/nodeList/resources/cancel2.png'></img></a>" +
		        							"</div>";
		        			
			        		return operation_btns;
			        	}}
			        ],
			      ajax: {
					  "url": urlConstants.jobsRun,
					  "dataSrc": ""
			      }
			  });

			 this.ui.runningTable.on("click", ".cancel", function(e) {
				  var data = runningTable.fnGetData($("#"+this.id).parents("tr")[0]);
				  current.showCancelConfirm(data);
			  });
			  
			  this.ui.runningTable.on("click", ".view", function(e) {
				  var data = runningTable.fnGetData($("#"+this.id).parents("tr")[0]);
				  current.showdetail(data);
			  });
			  
        this.ui.runningTable.on("click", ".running_working_dir", function(e) {
          current.setLocalFileHashByName(this.textContent, current);
        });
      },

      initWaitingTable: function () {
    	  	var current = this;
			var waitingTable = this.ui.waitingTable.dataTable({
				  responsive: true,
				  language: {
					  "url": "/static/js/translation/datatables.chinese.json"
				  },
				  aaSorting: [[ 0, "desc"]],
				  columns: [
	            	{ "title": "<div style='text-align:center;font-size:12px'>"+nls.job_id+"</div>", "data": "jobid",
	            		"render": function (data, type, full, meta) {
		            		return "<div style='text-align:center;font-size:12px;color:#000000'>"+data+"</div>";
		            	}},
			        { "title": "<div style='text-align:center;font-size:12px'>"+nls.job_name+"</div>", "data": "jobname",
			        	"render": function (data, type, full, meta) {
		            		return "<div style='text-align:center;font-size:12px;color:#000000'>"+data+"</div>";
		            	}},
			        { "title": "<div style='text-align:center;font-size:12px'>"+nls.queue+"</div>", "data": "queue",
			        	"render": function (data, type, full, meta) {
		            		return "<div style='text-align:center;font-size:12px;color:#000000'>"+data+"</div>";
		            	}},
			        { "title": "<div style='text-align:center;font-size:12px'>"+nls.qtime+"</div>", "class": "center", "data": "qtime", "defaultContent": "",
		            		"render": function (data, type, full, meta) {
		            			var timeString = new Date((data - full.timezone) * 1000);
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
				        		return "<div style='text-align:center;font-size:12px;color:#000000'>"+dateDisplay+"</div><div style='text-align:center;color:#666666;font-size:12px'>"+timeDisplay+"</div>";
				        	}},
			        { "title": "<div style='text-align:center;font-size:12px'>"+nls.waittime+"</div>", "class": "center", "data": "qtime",
			        		"render": function (data, type, full, meta) {
				        		var deltaTime = full.currtime - data;
				        		var wait_hour = parseInt(deltaTime/3600);
				        		var left_sec = parseInt(deltaTime%3600);
				        		var wait_min = parseInt(left_sec/60);
			            		return "<div style='text-align:center;font-size:12px;color:#000000'>"+wait_hour+" "+nls.hour+" "+wait_min+" "+nls.min+"</div>";
			            	}},
			        { "title": "<div style='text-align:center;font-size:12px'>"+nls.status+"</div>", "class": "center", "data": "status",
			            	"render": function (data, type, full, meta) {
			            		if (data == "waiting") {
				        			return "<div style='text-align:center;font-size:12px;color:#000000'>"+nls.waiting+"</div>";
				        		} else if (data == "suspending") {
				        			return "<div style='text-align:center;font-size:12px;color:#000000'>"+nls.suspend+"</div>";
				        		} else if (data == "holding") {
				        			return "<div style='text-align:center;font-size:12px;color:#000000'>"+nls.holding+"</div>";
				        		} else if (data == "queueing") {
				        			return "<div style='text-align:center;font-size:12px;color:#000000'>"+nls.queueing+"</div>";
				        		}
			            	}},
		            { "title": "<div style='font-size:12px'>"+nls.working_dir+"</div>", "data": "workingdir", "defaultContent": "",
	            		"render": function (data, type, full, meta) {
			        		return "<div class='waiting_working_dir' style='color:#0000ff;font-size:12px'>"+data+"</div>";
			        	}},
		        	{ "title": "<div style='text-align:center;font-size:12px'>"+nls.cancel+"</div>", "defaultContent": "",
		        		"render": function (data, type, full, meta) {
		        			var delete_queue_ID = full.id;
			        		var delete_queue_btn = "<div style='text-align:center'><a id='delete_queuing_"+delete_queue_ID+"' href='javascript:void(0)'><img src='/static/js/customUI/nodeList/resources/cancel2.png'></img></a></div>";
			        		var a_id = "delete_queuing_" + delete_queue_ID;
			        		//$("#"+a_id).click(function () {
			        		//	current.showCancelConfirm(full);
			        		//});
			        		return delete_queue_btn;
		        		}}
			        ],
			      ajax: {
					  "url": urlConstants.jobsWait,
					  "dataSrc": ""
			      }
			  });

      // this.ui.runningTable.dataTable.responsive.recalc();

			this.ui.waitingTable.on("click", "a", function(e) {
				  var data = waitingTable.fnGetData($("#"+this.id).parents("tr")[0]);
				  current.showCancelConfirm(data);
			  });
      this.ui.waitingTable.on("click", ".waiting_working_dir", function(e) {
          current.setLocalFileHashByName(this.textContent, current);
        });
      },

      initHangingTable: function () {
    	  	var current = this;
			this.ui.hangingTable.dataTable({
				  responsive: true,
				  language: {
					  "url": "/static/js/translation/datatables.chinese.json"
				  },
				  aaSorting: [[ 0, "desc"]],
				  columns: [
			        { "title": "<div style='text-align:center'>"+nls.job_id+"</div>", "data": "jobid",
			        	"render": function (data, type, full, meta) {
		            		return "<div style='text-align:center'>"+data+"</div>";
		            	}},
			        { "title": "<div style='text-align:center'>"+nls.job_name+"</div>", "data": "jobname",
			        	"render": function (data, type, full, meta) {
		            		return "<div style='text-align:center'>"+data+"</div>";
		            	}},
			        { "title": "<div style='text-align:center'>"+nls.queue+"</div>", "data": "queue",
			        	"render": function (data, type, full, meta) {
		            		return "<div style='text-align:center'>"+data+"</div>";
		            	}},
			        { "title": "<div style='text-align:center'>"+nls.qtime+"</div>", "class": "center", "data": "qtime", "defaultContent": "",
	            		"render": function (data, type, full, meta) {
			        		var timeString = new Date(data);
			        		var year = timeString.getUTCFullYear();
			        		var month = timeString.getUTCMonth() + 1;
			        		var date1 = timeString.getUTCDate();
			        		var hour = timeString.getUTCHours();
			        		var minute = timeString.getUTCMinutes();
			        		var timeDisplay = hour + ":" + minute;
			        		var dateDisplay = year + "/" + month + "/" + date1;
			        		return "<div style='text-align:center'>"+dateDisplay+"</div><div style='text-align:center;color:#666666;font-size:10px'>"+timeDisplay+"</div>";
			        	}},
			        { "title": "<div style='text-align:center'>"+nls.rund_time+"</div>", "data": "starttime",
		        		"render": function (data, type, full, meta) {
		        			var currentDate = new Date();
			        		var currentDateString = currentDate.getTime();
			        		var deltaTime = (currentDateString - data)/1000;
			        		var run_hour = parseInt(deltaTime/3600);
			        		var left_run_sec = parseInt(deltaTime%3600);
			        		var run_min = parseInt(left_run_sec/60);
		            		return "<div style='text-align:center'>"+run_hour+" "+nls.hour+" "+run_min+" "+nls.min+"</div>";
		            	}},
		        	{ "title": nls.working_dir, "data": "workingdir",
		        		"render": function (data, type, full, meta) {
		        			return "<div style='color:#0000ff'>"+data+"</div>";
		        		}},
		        	{ "title": "<div style='text-align:center'>"+nls.cancel+"</div>", "defaultContent": "",
		        		"render": function (data, type, full, meta) {
		        			var delete_hanging_ID = full.id;
		        			var delete_hanging_btn = "<div style='text-align:center'><a id='delete_hanging_"+delete_hanging_ID+"' href='javascript:void(0)' onclick='_deleteJob("+full+")'><img src='/static/js/customUI/nodeList/resources/cancel2.png'></img></a></div>";
		        			var a_delete_hanging_id = "delete_hanging_" + delete_hanging_ID;
		        			$('#'+a_delete_hanging_id).click(function () {
		        				current.showCancelConfirm(full);
		        			});
		        			return delete_hanging_btn;
		        		}}
			        ],
			      ajax: {
					  "url": urlConstants.jobsHang,
					  "dataSrc": ""
			      }
			  });
      },

      initFinishTable: function () {
    	  	var current = this;
			var finishTable = this.ui.finishTable.dataTable({
				  responsive: true,
				  language: {
					  "url": "/static/js/translation/datatables.chinese.json"
				  },
				  aaSorting: [[ 0, "desc"]],
				  columns: [
	            	{ "title": "<div style='text-align:center;font-size:12px'>"+nls.job_id+"</div>", "data": "jobid",
	            		"render": function (data, type, full, meta) {
		            		return "<div style='text-align:center;font-size:12px;color:#000000'>"+data+"</div>";
		            	}},
			        { "title": "<div style='text-align:center;font-size:12px'>"+nls.job_name+"</div>", "data": "jobname",
			        	"render": function (data, type, full, meta) {
		            		return "<div style='text-align:center;font-size:12px;color:#000000'>"+data+"</div>";
		            	}},
			        { "title": "<div style='text-align:center;font-size:12px'>"+nls.queue+"</div>", "data": "queue",
			        	"render": function (data, type, full, meta) {
		            		return "<div style='text-align:center;font-size:12px;color:#000000'>"+data+"</div>";
		            	}},
			        { "title": "<div style='text-align:center;font-size:12px'>"+nls.qtime+"</div>", "class": "center", "data": "qtime", "defaultContent": "",
			        	"render": function (data, type, full, meta) {
			        		var timeString = new Date((data - full.timezone) * 1000);
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
			        		return "<div style='text-align:center;font-size:12px;color:#000000'>"+dateDisplay+"</div><div style='text-align:center;color:#666666;font-size:12px'>"+timeDisplay+"</div>";
			        	}},
		        	{ "title": "<div style='text-align:center;font-size:12px'>"+nls.endtime+"</div>", "class": "center", "data": "endtime", "defaultContent": "",
			        	"render": function (data, type, full, meta) {
			        		if (data == 0 || data == "0") {
			        			return "";
			        		} else {
			        			var timeString = new Date((data - full.timezone) * 1000);
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
				        		return "<div style='text-align:center;font-size:12px;color:#000000'>"+dateDisplay+"</div><div style='text-align:center;color:#666666;font-size:12px'>"+timeDisplay+"</div>";
			        		}

			        	}},
		        	{ "title": "<div style='text-align:center;font-size:12px'>"+nls.status+"</div>", "class": "center", "data": "status",
			        	"render": function (data, type, full, meta) {
			        		if (data == "completed") {
			        			return "<div style='text-align:center;font-size:12px;color:#000000'>"+nls.success+"</div>";
			        		} else if (data == "cancelled") {
			        			return "<div style='text-align:center;font-size:12px;color:#000000'>"+nls.cancel+"</div>";
			        		} else if (data == "createfailed") {
			        			return "<div style='text-align:center;font-size:12px;color:#000000'>"+nls.failed+"</div>";
			        		}
			        	}},
		        	{ "title": "<div style='font-size:12px'>"+nls.working_dir+"</div>", "data": "workingdir",
		        		"render": function (data, type, full, meta) {
		        			return "<div class='finish_working_dir' style='color:#0000ff;font-size:12px'>"+data+"</div>";
		        		}},
		        	{ "title": "<div style='text-align:center;font-size:12px'>"+nls.action+"</div>", "defaultContent": "",
		        		"render": function (data, type, full, meta) {
		        			var id = full.id;
		        			//var delete_rerun_finish_btn = "<div style='text-align:center'><ul style='list-style:none;padding-left:10px'><li class='dropdown'><a href='javascript:void(0)' class='dropdown-toggle' data-toggle='dropdown'><img src='/static/js/customUI/nodeList/resources/rerun.png'></img><b class='caret'></b></a><ul class='dropdown-menu'><li><a class='delete' id='delete_finish_"+delete_finish_ID+"' href='javascript:void(0)'><img src='/static/js/customUI/nodeList/resources/ic_delete_grey_25x25.png'></img><span style='margin-left:5px'>"+nls.del+"</span></a></li><li><a class='rerun' id='rerun_finish_"+rerun_finish_ID+"' href='javascript:void(0)'><img src='/static/js/customUI/nodeList/resources/rerun.png'></img><span style='margin-left:5px'>"+nls.rerun+"</span></a></li></ul></li></ul></div>";
//		        			var operation_btns = "<div style='text-align:center'>" +
//	        					"<a class='rerun' title='"+nls.rerun+"' id='rerun_finish_"+id+"' href='javascript:void(0)'><img src='/static/js/customUI/nodeList/resources/rerun.png'></img></a>" +
//	        					"<a style='margin-left:10px' class ='delete' title='"+nls.del+"' id='delete_finish_"+id+"' href='javascript:void(0)'><img src='/static/js/customUI/nodeList/resources/ic_delete_grey600_22dp.png'></img></a>" +
//	        					"<a style='margin-left:10px' class ='view' title='"+nls.viewjobdetail+"' id='view_detail_"+id+"' href='javascript:void(0)'><img src='/static/js/customUI/nodeList/resources/details.png'></img></a>" +
//	        							"</div>";
		        			var view_del="<a style='margin-left:10px' class ='view' title='"+nls.viewjobdetail+"' id='view_detail_"+id+"' href='javascript:void(0)'><img src='/static/js/customUI/nodeList/resources/details.png'></img></a>"+
		        			"<a style='margin-left:10px' class ='delete' title='"+nls.del+"' id='delete_finish_"+id+"' href='javascript:void(0)'><img src='/static/js/customUI/nodeList/resources/ic_delete_grey600_22dp.png'></img></a>";		        			
		        			var rerun_1="<a class='rerun' title='"+nls.rerun+"' id='rerun_finish_"+id+"' href='javascript:void(0)'><img src='/static/js/customUI/nodeList/resources/rerun_2.png'></img></a>";
	        				var operation_btns = "<div style='text-align:center'>" +rerun_1+view_del+"</div>";	        				
	        				var job_filename=full.jobfilename;	        				
	        				if (job_filename.length == 0){
	        				    var operation_btns ="<div style='text-align:center'>" +view_del+"</div>";		
	        				}
		        			return operation_btns;
		        		}}
			        ],
			      ajax: {
					  "url": urlConstants.jobsFinish,
					  "dataSrc": ""
			      }
			  });

			this.ui.finishTable.on("click", ".delete", function(e) {
				  var data = finishTable.fnGetData($("#"+this.id).parents("tr")[0]);
				  current.showDeleteFinishConfirm(data);
			  });

			this.ui.finishTable.on("click", ".rerun", function (e) {
				var data = finishTable.fnGetData($("#"+this.id).parents("tr")[0]);
				  current.showRerunConfirm(data);
			});
			
			this.ui.finishTable.on("click", ".view", function (e) {
				var data = finishTable.fnGetData($("#"+this.id).parents("tr")[0]);
				 current.showdetail(data);
			});

      this.ui.finishTable.on("click", ".finish_working_dir", function (e) {
        current.setLocalFileHashByName(this.textContent, current);
      });
      },

      initQueryCancelStatus: function (data) {
    	  var queryData = data;
    	  var current = this;
    	  setTimeout(this.checkCancelProgress, 2000, queryData, current);
      },

      checkCancelProgress: function (jobData, current) {
    	  var check_cancel_url = urlConstants.jobs + jobData.id;
      	  $.ajax({
      		  type: "GET",
      		  url: check_cancel_url,
      		  dataType: "json",
      		  success: function (data, textStatus) {
      			current.checkCancelResult(data, jobData);
      		},
      		error: function (XMLHttpRequest, textStatus, errorThrown) {
      			$("#jobDetailProgressDialog").modal('hide');
      			$("#jobCancelResultArea").addClass("alert alert-dismissable").css("background-color", "white");
			    $("#jobCancelResultText").html(nls.job_cancel_fail);
			    $("#jobCancelIcon").attr("src", "/static/js/customUI/nodeList/resources/ic_clear_red_36x36.png");
			    $("#jobCancelID").css("display","none");
			    $("#jobCancelResult").modal('show');
			    utils.forceRefresh();
			    //setTimeout($("#jobCancelResult").modal('hide'), 3000);
			    /*setTimeout(function () {
			    	$("#jobCancelResult").modal('hide');
			    }, 3000);*/
      		}
      	  });
      },

      checkCancelResult: function (data, resultData) {
    	  var current = this;
    	  if (data.operatestatus == "cancelled") {
    		  $("#jobDetailProgressDialog").modal('hide');
			  $("#jobCancelResultArea").addClass("alert alert-dismissable").css("background-color", "white");
		      $("#jobCancelResultText").html(nls.job_cancel_success);
		      $("#jobCancelIcon").attr("src", "/static/js/customUI/nodeList/resources/ic_check_green_36x36.png");
		      $("#jobCancelID").css("display","none");
		      $("#jobCancelResult").modal('show');
		      utils.forceRefresh();
			  //setTimeout($("#jobCancelResult").modal('hide'), 3000);
		      /*setTimeout(function () {
			    	$("#jobCancelResult").modal('hide');
			    }, 3000);*/

    	  } else if (data.operatestatus == "cancelfailed") {
    		  $("#jobDetailProgressDialog").modal('hide');
    		  $("#jobCancelResultArea").addClass("alert alert-dismissable").css("background-color", "white");
			  $("#jobCancelResultText").html(nls.job_cancel_fail);
			  $("#jobCancelIcon").attr("src", "/static/js/customUI/nodeList/resources/ic_clear_red_36x36.png");
			  $("#jobCancelID").css("display","none");
			  $("#jobCancelResult").modal('show');
			  utils.forceRefresh();
			  //setTimeout($("#jobCancelResult").modal('hide'), 3000);
			  /*setTimeout(function () {
			    	$("#jobCancelResult").modal('hide');
			    }, 3000);*/
    	  } else {
    		  current.initQueryCancelStatus(resultData);
    	  }
      },

      initQueryRerunStatus: function (data) {
    	  var queryRerunData = data;
    	  var current = this;
    	  setTimeout(this.checkRerunProgress, 2000, queryRerunData, current);
      },

      checkRerunProgress: function (jobData, current) {
    	  var check_rerun_url = urlConstants.jobs + jobData.id;
      	  $.ajax({
      		  type: "GET",
      		  url: check_rerun_url,
      		  dataType: "json",
      		  success: function (data, textStatus) {
      			current.checkRerunResult(data, jobData);
      		},
      		error: function (XMLHttpRequest, textStatus, errorThrown) {
      			$("#jobDetailProgressDialog").modal('hide');
	    		$("#jobRerunResultArea").addClass("alert alert-dismissable").css("background-color", "white");
				$("#jobRerunResultText").html(nls.job_rerun_fail).css("position", "relative");
				$("#jobRerunIcon").attr("src", "/static/js/customUI/nodeList/resources/ic_clear_red_36x36.png");
				$("#jobRerunID").css("display","none");
				$("#jobRerunResult").modal('show');
				utils.forceRefresh();
				//setTimeout($("#jobRerunResult").modal('hide'), 3000);
				/*setTimeout(function () {
			    	$("#jobRerunResult").modal('hide');
			    }, 3000);*/
      		}
      	  });
      },

      checkRerunResult: function (data, resultData) {
    	  var current = this;
    	  if (data.operatestatus == "created") {
    		  $("#jobDetailProgressDialog").modal('hide');
			  $("#jobRerunResultArea").addClass("alert alert-dismissable").css("background-color", "white");
		      $("#jobRerunResultText").html(nls.job_rerun_success).css("position","fixed");
		      $("#jobRerunIcon").attr("src", "/static/js/customUI/nodeList/resources/ic_check_green_36x36.png");
		      $("#jobRerunID").html(nls.job_id + ": " + data.jobid).css("display","block");
		      $("#jobRerunResult").modal('show');
		      utils.forceRefresh();
		      //setTimeout($("#jobRerunResult").modal('hide'), 3000);
		      /*setTimeout(function () {
		    	  $("#jobRerunResult").modal('hide');
		      }, 3000);*/

    	  } else if (data.operatestatus == "createfailed") {
    		  $("#jobDetailProgressDialog").modal('hide');
	    	  $("#jobRerunResultArea").addClass("alert alert-dismissable").css("background-color", "white");
			  $("#jobRerunResultText").html(nls.job_rerun_fail).css("position", "relative");
			  $("#jobRerunIcon").attr("src", "/static/js/customUI/nodeList/resources/ic_clear_red_36x36.png");
			  $("#jobRerunID").css("display","none");
			  $("#jobRerunResult").modal('show');
			  utils.forceRefresh();
			  //setTimeout($("#jobRerunResult").modal('hide'), 3000);
			  /*setTimeout(function () {
				  $("#jobRerunResult").modal('hide');
			  }, 3000);*/
    	  } else {
    		  current.initQueryRerunStatus(resultData);
    	  }
      },

      refresh: function (data) {
		  $("#running_num").html(data.runningJobs.length);
		  $("#waiting_num").html(data.waitingJobs.length);
		  $("#finish_num").html(data.finishedJobs.length);
		  console.log("Job Num refreshed");

/*		  var data_running = data.runningJobs;
		  var data_waiting = data.waitingJobs;
		  var data_finish = data.finishedJobs;*/

		  if (data.runningJobs.length == 0) {
			  $("#running-dataTables").dataTable().fnClearTable();
		  } 
      else if($(".modal.in").length > 0){
        return 
      } else {
			  $("#running-dataTables").dataTable().fnClearTable();
			  $("#running-dataTables").dataTable().fnAddData(data.runningJobs);
			  $("#running-dataTables").dataTable().fnDraw();
		  }

		  if (data.waitingJobs.length == 0) {
			  $("#waiting-dataTables").dataTable().fnClearTable();
		  } 
      else if($(".modal.in").length > 0){
        return 
      }  else {
			  $("#waiting-dataTables").dataTable().fnClearTable();
			  $("#waiting-dataTables").dataTable().fnAddData(data.waitingJobs);
			  $("#waiting-dataTables").dataTable().fnDraw();
		  }

		  if (data.finishedJobs.length == 0) {
			  $("#finish-dataTables").dataTable().fnClearTable();
		  } 
      else if($(".modal.in").length > 0){
        return 
      }  else {
			  $("#finish-dataTables").dataTable().fnClearTable();
			  $("#finish-dataTables").dataTable().fnAddData(data.finishedJobs);
			  $("#finish-dataTables").dataTable().fnDraw();
		  }

          console.log("In nodelist, tables refreshed");

      },

      onRender: function () {
    	  var current = this;
    	  eventBus.on(constants.refreshUser, current.refresh);

    	  current.getJobNum();
    	  current.initRunningTable();
    	  current.initWaitingTable();
    	  current.initFinishTable();

    	  $("#running_btn").click(function () {
    		  current.setBlack($("#running_btn"));
    		  current.setBlue($("#waiting_btn"));
    		  current.setBlue($("#hanging_btn"));
    		  current.setBlue($("#finish_btn"));
    		  $("#running-tab-panel").show();
    		  $("#waiting-tab-panel").hide();
    		  $("#hanging-tab-panel").hide();
    		  $("#finish-tab-panel").hide();

    	  });

    	  $("#waiting_btn").click(function () {
    		  current.setBlue($("#running_btn"));
    		  current.setBlack($("#waiting_btn"));
    		  current.setBlue($("#hanging_btn"));
    		  current.setBlue($("#finish_btn"));
    		  $("#waiting-tab-panel").show();
    		  $("#running-tab-panel").hide();
    		  $("#hanging-tab-panel").hide();
    		  $("#finish-tab-panel").hide();
    	  });

    	  $("#hanging_btn").click(function () {
    		  current.setBlue($("#running_btn"));
    		  current.setBlue($("#waiting_btn"));
    		  current.setBlack($("#hanging_btn"));
    		  current.setBlue($("#finish_btn"));
    		  $("#hanging-tab-panel").show();
    		  $("#waiting-tab-panel").hide();
    		  $("#running-tab-panel").hide();
    		  $("#finish-tab-panel").hide();
    	  });

    	  $("#finish_btn").click(function () {
    		  current.setBlue($("#running_btn"));
    		  current.setBlue($("#waiting_btn"));
    		  current.setBlue($("#hanging_btn"));
    		  current.setBlack($("#finish_btn"));
    		  $("#hanging-tab-panel").hide();
    		  $("#waiting-tab-panel").hide();
    		  $("#running-tab-panel").hide();
    		  $("#finish-tab-panel").show();
    	  });

    	  $("#rerunConfirm_btn").click(function () {
    		  var data_url = urlConstants.jobs;
    		  //var csrftoken = $.cookie('csrftoken');
    		  $("#rerunConfirm").modal('hide');
    		  var postJobID = parseInt(self.tempJobID);
    		  var postData = {"action":"rerun","id":postJobID};
    		  postData = JSON.stringify(postData);
    		  $.ajax({
    			  type: "POST",
    			  url: data_url,
    			  //headers: {"X-CSRFToken":csrftoken, "Content-Type": "application/json;charset=UTF-8"},
    			  headers: {"Content-Type": "application/json;charset=UTF-8"},
    			  data: postData,
    			  dataType: "json",
    			  success: function (data, textStatus) {
    				  $("#jobDetailProgressDialog").modal('show');
    				  current.initQueryRerunStatus(data);
    			  },
    			  error: function (XMLHttpRequest, textStatus, errorThrown) {
    				  $("#jobDetailProgressDialog").modal('hide');
    	    		  $("#jobRerunResultArea").addClass("alert alert-dismissable").css("background-color", "white");
    				  $("#jobRerunResultText").html(nls.job_rerun_fail).css("position","relative");
    				  $("#jobRerunIcon").attr("src", "/static/js/customUI/nodeList/resources/ic_clear_red_36x36.png");
    				  $("#jobRerunID").css("display","none");
    				  $("#jobRerunResult").modal('show');
    				  utils.forceRefresh();
    				  //setTimeout($("#jobRerunResult").modal('hide'), 3000);
    				  /*setTimeout(function () {
    					  $("#jobRerunResult").modal('hide');
    				  }, 3000);*/
    			  }
    		  });
    	  });

    	  $("#deleteConfirm_btn").click(function () {
    		  var data_url = urlConstants.jobs;
    		  data_url = data_url + self.tempJobID;
    		  //var csrftoken = $.cookie("csrftoken");
    		  var postData = {"action": "cancel"};
    		  postData = JSON.stringify(postData);
    		  $("#deleteConfirm").modal('hide');
    		  $.ajax({
    			  type: "PUT",
    			  url: data_url,
    			  //headers: {"X-CSRFToken":csrftoken, "Content-Type": "application/json;charset=UTF-8"},
    			  headers: {"Content-Type": "application/json;charset=UTF-8"},
    			  data: postData,
    			  dataType: "json",
    			  success: function (data, textStatus) {
    				  $("#jobDetailProgressDialog").modal('show');
    				  current.initQueryCancelStatus(data);
    			  },
    			  error: function (XMLHttpRequest, textStatus, errorThrown) {
    				  $("#jobDetailProgressDialog").modal('hide');
    	    		  $("#jobCancelResultArea").addClass("alert alert-dismissable").css("background-color", "white");
    				  $("#jobCancelResultText").html(nls.job_cancel_fail);
    				  $("#jobCancelIcon").attr("src", "/static/js/customUI/nodeList/resources/ic_clear_red_36x36.png");
    				  $("#jobCancelID").css("display","none");
    				  $("#jobCancelResult").modal('show');
    				  utils.forceRefresh();
    				  //setTimeout($("#jobCancelResult").modal('hide'), 3000);
    				  /*setTimeout(function () {
    					  $("#jobCancelResult").modal('hide');
    					  }, 3000);*/
    				  }
    		  });
    	  });

    	  $("#deleteFinishConfirm_btn").click(function () {
    		  var data_url = urlConstants.jobs;
    		  data_url = data_url + self.tempJobID;
    		  //var csrftoken = $.cookie("csrftoken");
    		  $("#deleteFinishConfirm").modal('hide');
    		  $.ajax({
    			  type: "DELETE",
    			  url: data_url,
    			  //headers: {"X-CSRFToken":csrftoken},
    			  success: function (data, textStatus) {
    				  utils.forceRefresh();
    			  },
    			  error: function (XMLHttpRequest, textStatus, errorThrown) {
    				  $("#jobCancelResultArea").addClass("alert alert-dismissable").css("background-color", "white");
    				  $("#jobCancelResultText").html(nls.job_delete_fail);
    				  $("#jobCancelIcon").attr("src", "/static/js/customUI/nodeList/resources/ic_clear_red_36x36.png");
    				  $("#jobCancelID").css("display","none");
    				  $("#jobCancelResult").modal('show');
    				  utils.forceRefresh();
    				  //setTimeout($("#jobCancelResult").modal('hide'), 3000);
    				  /*setTimeout(function () {
    					  $("#jobCancelResult").modal('hide');
    				  }, 3000);*/
    			  }
    		  });
    	  });

    	  $("#running_btn").click();
      },
    });
  });