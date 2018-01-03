define(['jquery',
	'customUI/templateSelect/widgets/assets/validate',
	'customUI/templateSelect/widgets/assets/newLicoDirectives',
	'elfinder',
	'elfinder_i18n',
    'widgets/elfinder/chooseFolder/chooseFolder',
    'widgets/elfinder/chooseFile/chooseFile',
    'utils/constants/urlConstants',
    'utils/utils',
    'i18n!../nls/AllJobViewNls',
    'css!/static/js/libs/jquery-ui/themes/flick/jquery-ui.min.css',
    'css!/static/js/libs/elfinder/css/elfinder.min.css'
    ],function($,validate,newLicoDirectives,elfinder, elfinder_i18n, chooseFolder, chooseFile,urlConstants,utils,nls){
		var autoJobTemp={};
		var allOK={};
		var allData={};
		var initData={};

// 得到其他所有自定义属性
		function getAllAttr($id){
			var id_use="#"+$id;
			var allAttr={};
			allAttr['id']=id_use;
			allAttr['key']=$id;
			allAttr['licoType']=$(id_use).attr('lico-type');
			allAttr['licoDirective']=$(id_use).attr('lico-directive');
			allAttr['require']=$(id_use).attr('require');
			allAttr['validate']=$(id_use).attr('validate');
			return allAttr;
		}

// 得到所有带lico-type的标签id，这些是xml生成的
		function getAllTypeID(){
			var $allType=$("[lico-type]");
			var all=[];
			$($allType).each(function(){
				all.push($(this).attr('id'));
			});
			return all;
		}

// 得到id
		function getID(other){
			return $(other).attr('id');
		}

// 初始化validate
		function validateInit(){
			var needValidate=$('[validate]');
			$(needValidate).each(function(){
				var validateAttr=getAllAttr(getID($(this)));
				var requireAttr=validateAttr;
				var isRequired=false;
					if(!$(requireAttr['id']).parent().is(':hidden')){
						if($(requireAttr['id']).parent().find('button').length<1){
							if($(requireAttr['id']).parent().find(':disabled').length<1){
								isRequired=true;
							} 	
						} else if($(requireAttr['id']).parent().find('button:disabled').length<1){
								isRequired=true;
						}
					} 
				if(isRequired){
					bindValidate(validateAttr);
				}
			});
		}

// validate绑定：keyup，require，post，blur
		function bindValidate(allAttr){
			var validateID=allAttr['id'];
			var validateType=allAttr['validate'];
			var tagType=allAttr['licoType'];
			var validateRequire=allAttr['require'];
			if(tagType.toLowerCase()=="input"){
				onValidate(validateID,validateType,validateRequire);
			}
		}

		function onValidate(id,vd,r){
			var data=$(id).children()[0];
			var vd=vd.toLowerCase();
			switch(vd){
				case "mail":
					$(data).on("keyup change", function(){
						allOK[id]=validate.mail(data,r);
					});
					break;
				case "number":
					$(data).on("keyup change", function(){
						allOK[id]=validate.number(data,r);
					});
					break;
				case "file":
					$(data).on("keyup change", function(){
						allOK[id]=validate.file(data,r);
					});
					break;
				case "string":
					$(data).on("keyup change", function(){
						allOK[id]=validate.text(data,r);
					});
					break;
				case "jobname":
					$(data).on("keyup change", function(){
						allOK[id]=validate.jobName(data,r);
					});
					break;
				default:
					break;
			}
		}

// 检测require类型的正确性
		function checkRequire(){
			var allRequireKey=$("[require]");
				$(allRequireKey).each(function(){
					var requireAttr=getAllAttr(getID($(this)));
					var isRequired=false;
					if(!$(requireAttr['id']).parent().is(':hidden')){
						if($(requireAttr['id']).parent().find('button').length<1){
							if($(requireAttr['id']).parent().find(':disabled').length<1){
								isRequired=true;
							} 	
						} else if($(requireAttr['id']).parent().find('button:disabled').length<1){
								isRequired=true;
						}
					} 
				
					if(isRequired){
						if(requireAttr['require'].toLowerCase() == "true"){
							switch(requireAttr['licoType']){
								case "input":case "select":case "queue":
									var data=$(requireAttr['id']).children()[0];
									allOK[requireAttr['id']]=validate.commonRequire(data);
									if(typeof requireAttr['validate'] != 'undefined'){
											$(data).trigger('change');
										} else {
											$(data).on("change",function(){
												allOK[requireAttr['id']]=validate.commonRequire(data);
											});
										}
									break;
								case "file": case "folder":
									var data=$(requireAttr['id']).children()[0];
									allOK[requireAttr['id']]=validate.fileRequire(data);
									$(data).on("change",function(){
										allOK[requireAttr['id']]=validate.commonRequire(data);
									});
									break;
								case "radio": case "checkbox":
									var data=$(requireAttr['id']);
									allOK[requireAttr['id']]=validate.required(data);
									$(data).click(function(){
										allOK[requireAttr['id']]=validate.required(data);
									});
									break;
								default:
									break;
							}
						}
					} 
				});
		}

// 确认所有输入的正确性
		function checkEveryInput(){
			checkRequire();
		}

// 得到所有的值
		function getAllData(){
			var allAjaxID=getAllTypeID();
			for(var i=0;i<allAjaxID.length;i++){
				var thisData=getAllAttr(allAjaxID[i]);
				var ajaxKey=thisData['key'];
				var thisDataID=thisData['id'];
				var thisDataType=thisData['licoType'];
				switch(thisDataType){
					case "input":
						if(typeof($(thisDataID).find('input').val())=='undefined'){
							allData[ajaxKey]="";
						} else {
							allData[ajaxKey]=$(thisDataID).find('input').val();
						}
						break;
					case "select": case "queue":
						if(typeof($(thisDataID).find('select').val())=='undefined'){
							allData[ajaxKey]="";
						} else {
							allData[ajaxKey]=$(thisDataID).find('select').val();
						}
						break;
					case "file": case "folder":
						if(typeof($(thisDataID).find('input').attr('placeholder'))=='undefined'){
							allData[ajaxKey]="";
						} else {
							allData[ajaxKey]=$(thisDataID).find('input').attr('placeholder');
						}
						break;
					case "radio":
						if(typeof($(thisDataID).find('input:checked').val())=='undefined'){
							allData[ajaxKey]="";
						} else {
							allData[ajaxKey]=$(thisDataID).find('input:checked').val();
						}
						break;
					case "checkbox":
						var checkboxData=$(thisDataID).find('input:checked');
						var checkboxDatas=[];
						if(checkboxData.length<2){
							if(typeof($(thisDataID).find('input:checked').val())=='undefined'){
							allData[ajaxKey]="";
							} else {
								allData[ajaxKey]=$(thisDataID).find('input:checked').val();
							}
						} else {
							checkboxData.each(function(){
								checkboxDatas.push($(this).val());
							});
							allData[ajaxKey]=checkboxDatas;
						}
						break;
					default:
						break;
				}
			}
		}

		function getThisData(targetId){
				var thisDataID="#"+$(targetId).attr('id');
				var thisDataType=$(targetId).attr('lico-type');
				var dataOutput;
				switch(thisDataType){
					case "input":
						if(typeof($(thisDataID).find('input').val())=='undefined'){
							dataOutput='';
						} else {
							dataOutput=$(thisDataID).find('input').val();
						}
						break;
					case "select": case "queue":
						if(typeof($(thisDataID).find('select').val())=='undefined'){
							dataOutput='';
						} else {
							dataOutput=$(thisDataID).find('select').val();
						}
						break;
					case "file": case "folder":
						if(typeof($(thisDataID).find('input').attr('placeholder'))=='undefined'){
							dataOutput='';
						} else {
							dataOutput=$(thisDataID).find('input').attr('placeholder');
						}
						break;
					case "radio":
						if(typeof($(thisDataID).find('input:checked').val())=='undefined'){
							dataOutput='';
						} else {
							dataOutput=$(thisDataID).find('input:checked').val();
						}
						break;
					case "checkbox":
						var checkboxData=$(thisDataID).find('input:checked');
						var checkboxDatas=[];
						if(checkboxData.length<2){
							if(typeof($(thisDataID).find('input:checked').val())=='undefined'){
							dataOutput='';
							} else {
								dataOutput=$(thisDataID).find('input:checked').val();
							}
						} else {
							checkboxData.each(function(){
								checkboxDatas.push($(this).val());
							});
							dataOutput=checkboxDatas;
						}
						break;
					default:
						break;
				}
				return dataOutput;
		}

		function checkCreateResult(data, resultData) {
          if (data.operatestatus == "created") {
              $("#progressDialog").modal('hide');
              $("#createResultArea").addClass("alert alert-dismissable").css("background-color", "white");
              $("#createResult").html(nls.jobCreateSuccessfully).css("position:fixed");
              $("#resultIcon").attr("src", "/static/js/customUI/user/dashboard/job/resources/ic_check_green_36x36.png");
              $("#jobCreateID").html(nls.jobID + ": " + data.jobid).css("display","block");
              $("#jobCreateResult").modal('show');
              utils.forceRefresh();
          } else if (data.operatestatus == "createfailed") {
              $("#progressDialog").modal('hide');
              $("#createResultArea").addClass("alert alert-dismissable").css("background-color", "white");
              $("#createResult").html(nls.jobCreateFailed).css("position" ,"relative");
              $("#resultIcon").attr("src", "/static/js/customUI/user/dashboard/job/resources/ic_clear_red_36x36.png");
              $("#jobCreateID").css("display","none");
              $("#jobCreateResult").modal('show');
              utils.forceRefresh();
          } else {
              initQueryCreateStatus(resultData);
          }
      }

		function checkCreateProgress(jobData, current) {
          var check_create_url = urlConstants.jobs + jobData.id;
          $.ajax({
              type: "GET",
              url: check_create_url,
              dataType: "json",
              success: function (data, textStatus) {
                checkCreateResult(data, jobData);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                $("#progressDialog").modal('hide');
                $("#createResultArea").addClass("alert alert-dismissable").css("background-color", "white");
                $("#createResult").html(nls.jobCreateFailed).css("position" ,"relative");
                $("#resultIcon").attr("src", "/static/js/customUI/user/dashboard/job/resources/ic_clear_red_36x36.png");
                $("#jobCreateID").css("display","none");
                $("#jobCreateResult").modal('show');
                utils.forceRefresh();
            }
          });
      }

	    function initQueryCreateStatus(data) {
    	  var queryData = data;
    	  setTimeout(checkCreateProgress, 2000, queryData, this);
      	}


// 绑定submit:先确认所有的require已经选择，然后读取所有的值
		function bindSubmit(){
			checkEveryInput();
			var isOK;
			for(var key in allOK){
				if(!allOK[key]){
					isOK=allOK[key];
					break;
				}
			}
			if(isOK != false){
				// 可以post
				allData={};
				getAllData('[lico-type]');

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
        		  
        		  var dataWallTimeMinute = $("#walltime_minute").val();
        		  if((dataWallTimeHour == null || dataWallTimeHour == "") && (dataWallTimeMinute == null || dataWallTimeMinute == "" || dataWallTimeMinute == "0")){
        		  	var dataWallTime="";
        		  } else {
        		  	if (dataWallTimeHour == null || dataWallTimeHour == "") {
	        			  dataWallTimeHour = "0";
	        		  }
	        		  if (dataWallTimeMinute == null || dataWallTimeMinute == "" || dataWallTimeMinute == "0") {
	        			  dataWallTimeMinute = "00";
	        		  } else if (parseInt(dataWallTimeMinute) < 10) {
	        			  dataWallTimeMinute = "0" + dataWallTimeMinute;
	        		  }
	        		  var dataWallTime = dataWallTimeHour + ":" + dataWallTimeMinute + ":00";
        		  }
        		  var dataTrigger = "";
        		  if ($("#notice_finish").is(':checked') && $("#notice_suspend").is(':checked')) {
        			  dataTrigger = "be";
        		  } else if ($("#notice_finish").is(':checked')) {
        			  dataTrigger = "e";
        		  } else if ($("#notice_suspend").is(':checked')) {
        			  dataTrigger = "b";
        		  }
        		  var dataMail = $("#email").val();

        		  allData["action"]="create";
        		  allData["type"]=$('[lico-job]').attr('id');
        		  allData["pnodescount"]=dataNodesNum;
        		  allData["ppn"]=dataCoresPerNode;
        		  allData["pmem"]=dataMemSize;
        		  allData["walltime"]=dataWallTime;
        		  allData["mailtrigger"]=dataTrigger;
        		  allData["mail"]=dataMail;

        		  delete allData['resource001'];
        		  delete allData['resource002'];
        		  delete allData['resource003'];
        		  delete allData['resource004'];
        		  delete allData['resource005'];
        		  delete allData['resource006'];
        		  delete allData['resource007'];

        		  postData = JSON.stringify(allData);
				  $.ajax({
        			  type: "POST",
        			  url: urlConstants.jobs,
        			  data: postData,
        			  headers: {"Content-Type": "application/json;charset=UTF-8"},
        			  dataType: "json",
        			  success: function (data, textStatus) {
        				  $("#progressDialog").modal('show');
    					  initQueryCreateStatus(data);
        			  },
        			  error: function (XMLHttpRequest, textStatus, errorThrown) {
        				  $("#progressDialog").modal('hide');
        	      		  $("#createResultArea").addClass("alert alert-dismissable").css("background-color", "white");
        				  $("#createResult").html(nls.jobCreateFailed).css("position" ,"relative");
        				  $("#resultIcon").attr("src", "/static/js/customUI/user/dashboard/job/resources/ic_clear_red_36x36.png");
        				  $("#jobCreateID").css("display","none");
        				  $("#jobCreateResult").modal('show');
        				  utils.forceRefresh();
        			  }
        		  });
			}
		}

		function directiveInit(){
			var needDirective=$('[lico-directive]');
			needDirective.each(function(){
				var directiveID=newLicoDirectives['getLocation'](this);
				var directiveString=newLicoDirectives['parseString']($(this).attr('lico-directive'));
				var dataListener=!!$(this).attr('id')?$(this).find('input').val():$(this).val();

				$(directiveID).on('change',function(){
					if(getThisData(directiveID) == dataListener){
						// selected
						var thisDirective=directiveString['checked'];
						for(var i=0;i<thisDirective.length;i++){
							if(!!thisDirective[i]['init']){
								if(i != 0){
									newLicoDirectives['init'](thisDirective[i]['init'],initData);
									var q=thisDirective[0];
									var p=thisDirective[i];
									thisDirective[0]=p;
									thisDirective[i]=q;
								}
							} 
						}
						for(var i=0;i<thisDirective.length;i++){
							var thisFunction=thisDirective[i];
							for(var key in thisFunction){
								newLicoDirectives[key](thisFunction[key],initData);
							}
						}
					} else {
						// unselected
						var thisDirective=directiveString['unchecked'];
						for(var i=0;i<thisDirective.length;i++){
							if(!!thisDirective[i]['init']){
								if(i != 0){
									newLicoDirectives['init'](thisDirective[i]['init'],initData);
									var q=thisDirective[0];
									var p=thisDirective[i];
									thisDirective[0]=p;
									thisDirective[i]=q;
								}
							}
						}
						for(var i=0;i<thisDirective.length;i++){
							var thisFunction=thisDirective[i];
							for(var key in thisFunction){
								newLicoDirectives[key](thisFunction[key],initData);
							}
						}
					}
				});
				$(directiveID).trigger('change');
			});
		}


		function addHTML(){
			var htmlTempEn='<section class="col-md-12"><div class="col-md-12  select_title">Resource Required</div><div class="col-md-12 form-group"><span class="control-label col-md-2">*queue</span><div class="ajax col-md-4" id="queue" lico-type="queue" require="true"><select class="col-md-4 form-control" name="queue"></select></div></div><div class="col-md-12 form-group"><span class="control-label col-md-2">Node Count</span><div class="col-md-4" id="resource001" validate="number" lico-type="input"><input type="text" name="nodeCount" class="form-control" id="nodes_num"></div></div><div class="col-md-12 form-group"><span class="control-label col-md-2">CPUs/Node</span><div class="col-md-4" id="resource002" validate="number" lico-type="input"><input type="text" name="cpus" class="form-control" id="CPU_core_num_text"></div><span class="control-label col-md-1" style="text-align:left;">cores</span></div><div class="col-md-12 form-group"><span class="control-label col-md-2">Memory Size</span><div class="col-md-4" validate="number" lico-type="input" id="resource003"><input type="text" name="memory" class="form-control" id="mem_size_text"></div><span class="control-label col-md-1" style="text-align:left;">M</span></div><div class="col-md-12 form-group"><span class="control-label col-md-2">Wall Time</span><div class="col-md-1" validate="number" lico-type="input" id="resource004"><input type="text" name="walltime" class="form-control" id="walltime_hour"></div><span class="control-label col-md-1" style="text-align:left;">hours</span><div class="col-md-1" validate="number" lico-type="input" id="resource005"><input type="text" name="wallminute" class="form-control" id="walltime_minute"></div><span class="control-label col-md-1" style="text-align:left;">minutes</span></div><div class="col-md-12 form-group"><span class="control-label col-md-2">Status Notification</span><div class="col-md-6" id="resource006"><label class="checkbox-inline"><input type="checkbox" name="finish" value="finish" id="notice_finish">finish</label><label class="checkbox-inline"><input type="checkbox" name="suspend" value="suspend" id="notice_suspend">suspend</label></div></div><div class="col-md-12 form-group"><span class="control-label col-md-2">Email</span><div class="col-md-4" validate="mail" lico-type="input" id="resource007"><input type="text" name="mail" class="form-control" id="email"></div></div></section>';
			var htmlTempZh='<section class="col-md-12"><div class="col-md-12  select_title">资源需求</div><div class="col-md-12 form-group"><span class="control-label col-md-2">*队列</span><div class="ajax col-md-4" id="queue" lico-type="queue" require="true"><select class="col-md-4 form-control" name="queue"></select></div></div><div class="col-md-12 form-group"><span class="control-label col-md-2">节点数</span><div class="col-md-4" id="resource001" validate="number" lico-type="input"><input type="text" name="nodeCount" class="form-control" id="nodes_num"></div></div><div class="col-md-12 form-group"><span class="control-label col-md-2">每个节点的CPU核数</span><div class="col-md-4" id="resource002" validate="number" lico-type="input"><input type="text" name="cpus" class="form-control" id="CPU_core_num_text"></div><span class="control-label col-md-1" style="text-align:left;">核</span></div><div class="col-md-12 form-group"><span class="control-label col-md-2">内存容量</span><div class="col-md-4" validate="number" lico-type="input" id="resource003"><input type="text" name="memory" class="form-control" id="mem_size_text"></div><span class="control-label col-md-1" style="text-align:left;">M</span></div><div class="col-md-12 form-group"><span class="control-label col-md-2">预计运行时间</span><div class="col-md-1" validate="number" lico-type="input" id="resource004"><input type="text" name="walltime" class="form-control" id="walltime_hour"></div><span class="control-label col-md-1" style="text-align:left;">小时</span><div class="col-md-1" validate="number" lico-type="input" id="resource005"><input type="text" name="wallminute" class="form-control" id="walltime_minute"></div><span class="control-label col-md-1" style="text-align:left;">分钟</span></div><div class="col-md-12 form-group"><span class="control-label col-md-2">运行状态通知</span><div class="col-md-6" id="resource006"><label class="checkbox-inline"><input type="checkbox" name="finish" value="finish" id="notice_finish">完成</label><label class="checkbox-inline"><input type="checkbox" name="suspend" value="suspend" id="notice_suspend">开始执行</label></div></div><div class="col-md-12 form-group"><span class="control-label col-md-2">邮箱</span><div class="col-md-4" validate="mail" lico-type="input" id="resource007"><input type="text" name="mail" class="form-control" id="email"></div></div></section>';
			var thisJob=$('[lico-job]');
			var thisLanguage;
			typeof $('[lico-job]').attr('lico-language') !=='undefined'? thisLanguage=$('[lico-job]').attr('lico-language'):thisLanguage='en';
			if(thisLanguage.toLowerCase()=="zh"){
				$(thisJob).append(htmlTempZh);
			} else {
				$(thisJob).append(htmlTempEn);
			}
			$(".select_label_overflow").each(function(){
				if($(this).width()<$(this)[0].scrollWidth){
					$(this).attr('title',$(this).text());
				}
			});
			$(window).resize(function() {
			 	$(".select_label_overflow").each(function(){
					if($(this).width()<$(this)[0].scrollWidth){
						$(this).attr('title',$(this).text());
					} else {
						$(this).removeAttr('title');
					}
				});
			});
			$("[lico-type=queue]").each(function(){
				var $queue=this;
				$.ajax({
					type: "GET",
        			  url: urlConstants.queues,
        			  dataType: "json",
        			  success: function (data, textStatus) {
        				  $($queue).find("select").html("");
        				  var queueList = [];
        				  $.each(data, function (i, dt) {
        					  queueList.push(dt.name);
        				  });
        				  $.each(queueList, function(i, queue) {
        					  $($queue).find("select").append("<option value='" + queue + "'>" + queue + "</option>");
        				  });
        			  },
        			  error: function (XMLHttpRequest, textStatus, errorThrown) {

        			  }
				});
			});
		}

		function getInitData(){
			var allAjaxID=getAllTypeID();
			for(var i=0;i<allAjaxID.length;i++){
				var thisData=getAllAttr(allAjaxID[i]);
				var ajaxKey=thisData['key'];
				var thisDataID=thisData['id'];
				var thisDataType=thisData['licoType'];
				switch(thisDataType){
					case "input":
						if(typeof($(thisDataID).find('input').val())=='undefined'){
							initData[thisDataID]=[thisDataType,'',$(thisDataID).html()];
						} else {
							initData[thisDataID]=[thisDataType,$(thisDataID).find('input').val(),$(thisDataID).html()];
						}
						break;
					case "select": case "queue":
						if(typeof($(thisDataID).find('select').val())=='undefined'){
							initData[thisDataID]=[thisDataType,'',$(thisDataID).html()];
						} else {
							initData[thisDataID]=[thisDataType,$(thisDataID).find('select').val(),$(thisDataID).html()];
						}
						break;
					case "file": case "folder":
						if(typeof($(thisDataID).find('input').attr('placeholder'))=='undefined'){
							initData[thisDataID]=[thisDataType,'',$(thisDataID).html()];
						} else {
							initData[thisDataID]=[thisDataType,$(thisDataID).find('input').attr('placeholder'),$(thisDataID).html()];
						}
						break;
					case "radio":
						if(typeof($(thisDataID).find('input:checked').val())=='undefined'){
							initData[thisDataID]=[thisDataType,'',$(thisDataID).html()];
						} else {
							initData[thisDataID]=[thisDataType,$(thisDataID).find('input:checked').val(),$(thisDataID).html()];
						}
						break;
					case "checkbox":
						var checkboxData=$(thisDataID).find('input:checked');
						var checkboxDatas=[];
						if(checkboxData.length<2){
							if(typeof($(thisDataID).find('input:checked').val())=='undefined'){
								initData[thisDataID]=[thisDataType,'',$(thisDataID).html()];
							} else {
								initData[thisDataID]=[thisDataType,$(thisDataID).find('input:checked').val(),$(thisDataID).html()];
							}
						} else {
							checkboxData.each(function(){
								checkboxDatas.push($(this).val());
							});
							initData[thisDataID]=[thisDataType,checkboxDatas,$(thisDataID).html()];
						}
						
						break;
					default:
						break;
				}
			}
		}

		function bindLicoLink(){
			var needLink=$('[lico-link]');
			needLink.each(function(){
				var linkType=$(this).attr('lico-link');
				var $this=$(this);
				switch(linkType){
					case "folder":
						$($this).click(function () {
								$this=$(this);

								var $fileSelectionDialog = new elFinder($('#workdir-elfinder-dlg-content'),{
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
				                    navbar : ['open', '|', 'rm', '|'],

				                    cwd    : ['reload', 'back', '|', 'upload', 'mkdir'],

				                    files  : [
				                        'choosefolder', '|', 'download', '|',
				                        'rm', '|', 'rename'
				                    ]
				                },
				                getFileCallback: function(file) {
				                },
				                getFolderCallback: function(file) {
				             
				                    $($this.parent().prev().find('input')).val(file.path);
				                    $($this.parent().prev().find('input')).attr('title', file.path);
				                    $($this.parent().prev().find('input')).attr('placeholder', file.path);
				                    $("#workdir-elfinder-dlg").modal('hide');
				                    $($this.parent().prev().find('input')).trigger('change');

				                    if ($.trim($($this.parent().prev().find('input')).val()).length == 0 || $($this.parent().prev().find('input')).val() == null || $($this.parent().prev().find('input')).val() == "") {
				                        $("#job_create_submit").attr("disabled", true);
				                    }
				                }
				            });
								
				            $("#workdir-elfinder-dlg").modal('show');
				          });
						break;
					case "file":
						
						$($this).click(function () {
								$this=$(this);


								var $fileSelectionDialog = new elFinder($('#mpiprog-elfinder-dlg-content'),{
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
				                    navbar : ['open', '|', 'rm', '|'],

				                    cwd    : ['reload', 'back', '|', 'upload', 'mkdir'],

				                    files  : [
				                        'choosefile', '|', 'download', '|',
				                        'rm', '|', 'rename'
				                    ]
				                },
				                getFileCallback: function(file) {
				                    $($this.parent().prev().find('input')).val(file.path);
				                    $($this.parent().prev().find('input')).attr('title', file.path);
				                    $($this.parent().prev().find('input')).attr('placeholder', file.path);
				                    $($this.parent().prev().find('input')).trigger('change');
				                    $("#mpiprog-elfinder-dlg").modal('hide');
				                },
				                chooseFileCallback: function(file) {
				                    $($this.parent().prev().find('input')).val(file.path);
				                    $($this.parent().prev().find('input')).attr('title', file.path);
				                    $($this.parent().prev().find('input')).attr('placeholder', file.path);
				                    $($this.parent().prev().find('input')).trigger('change');
				                    $("#mpiprog-elfinder-dlg").modal('hide');
				                    if ($.trim($($this.parent().prev().find('input')).val()).length == 0 || $($this.parent().prev().find('input')).val() == null || $($this.parent().prev().find('input')).val() == "") {
				                        $("#job_create_submit").attr("disabled", true);
				                    }
				                }
				            });


								
				            $("#mpiprog-elfinder-dlg").modal('show');
				          });
						break;
					default:
						break;
				}
			});
		}

// 初始化
		function init(){
			addHTML();
			bindLicoLink();
			getInitData();
			// 绑定validate
			validateInit();
			// 绑定directive
			// 绑定submit
			directiveInit();
			$('#select_template_submit').unbind('click');
			$('#select_template_submit').click(bindSubmit);
		}




		autoJobTemp.createJobTemp=function(){
			init();

		}

		return autoJobTemp;






});
