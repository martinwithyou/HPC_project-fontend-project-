define(['marionette',
    'elfinder',
    'elfinder_i18n',
    'widgets/elfinder/chooseFolder/chooseFolder',
    'widgets/elfinder/chooseFile/chooseFile',
    'utils/utils',
    'utils/constants/urlConstants',
	'text!./templates/GeneralViewTmpl.mustache',
	'i18n!./nls/AllJobViewNls',
	'css!./styles/AllJobView.css', 
    'css!/static/js/libs/jquery-ui/themes/flick/jquery-ui.min.css',
    'css!/static/js/libs/elfinder/css/elfinder.min.css',
	],function(Marionette,elfinder, elfinder_i18n, chooseFolder, chooseFile,utils, urlConstants,template,nls){
	'use strict';
	return Marionette.ItemView.extend({
		template:template,
		templateHelpers:function(){
			return {
				nls:nls
			};
		},

    addInvalidClass: function (tgt) {
          $(tgt).removeClass("form-control").addClass("form-control-invalid");
      },

    removeInvalidClass: function (tgt) {
          $(tgt).removeClass("form-control-invalid").addClass("form-control");
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

      initQueryCreateStatus: function (data) {
    	  var queryData = data;
    	  var current = this;
    	  setTimeout(this.checkCreateProgress, 2000, queryData, current);
      },

		// validate
		onRender:function(){

			var current=this;

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


// submit i need a new button id
      $("#select_template_submit").unbind('click');
			$("#select_template_submit").click(function () {
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
        			  	  
        				  //$("#jobSubmitConfirm").modal('hide');
        				  $("#progressDialog").modal('show');
        				  current.initQueryCreateStatus(data);
        			  },
        			  error: function (XMLHttpRequest, textStatus, errorThrown) {
        				  $("#jobSubmitMain_title").modal('hide');
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