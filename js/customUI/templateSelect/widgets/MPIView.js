define(['marionette',
        'elfinder',
        'elfinder_i18n',
        'widgets/elfinder/chooseFolder/chooseFolder',
        'widgets/elfinder/chooseFile/chooseFile',
        'utils/utils',
        'utils/constants/urlConstants',
		'text!./templates/MPIViewTmpl.mustache',
		'i18n!./nls/AllJobViewNls',
		'css!./styles/AllJobView.css',
        'css!/static/js/libs/jquery-ui/themes/flick/jquery-ui.min.css',
        'css!/static/js/libs/elfinder/css/elfinder.min.css'
	],function(Marionette,elfinder, elfinder_i18n, chooseFolder, chooseFile,utils, urlConstants,template,nls){
	'use strict';
	return Marionette.ItemView.extend({
		template:template,
		templateHelpers:function(){
			return {
				nls:nls
			};
		},

		clearQueueOption: function () {
    	  var queue_name = $("#queue_name");
    	  for (var i = queue_name[0].length; i > 1; i--) {
    		  queue_name[0].remove(i - 1);
    	  }
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


      initQueryCreateStatus: function (data) {
    	  var queryData = data;
    	  var current = this;
    	  setTimeout(this.checkCreateProgress, 2000, queryData, current);
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


		// validate
		onRender:function(){
			var current=this;

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



// i need a new button 

		$("#select_template_submit").click(function () {
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
        				  //$("#jobSubmitConfirm").modal('hide');
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

		}
	});
});