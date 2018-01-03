define(['jquery'],function($){
	var newLicoDirectives={};

	// 通用取值方法
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

	// 1.选中所有的lico-directive，并进行精确定位（找到对应的id，绑定change事件），并保存此刻的值用以判断是否selected？checked
	// 2.根据此刻的状态执行对应的方法


	// output对象：key为触发事件，value为数组，数组里面是对象，key为函数名，value为参数数组
	newLicoDirectives['parseString']=function(inputString){
		var stringNeed=inputString;
		var stringOutput={};
		var directives=inputString.split(';');
		for(var i=0;i<directives.length;i++){
			var events=directives[i].split(':')[0];
			stringOutput[events]=[];
			var functions=directives[i].split(':')[1].split('),');
			for(var j=0;j<functions.length;j++){
				var functionOutput={};
				var functionString=functions[j];
				functionString=functionString.replace(')','');
				var functionName=functionString.split('(')[0];
				var functionPara=functionString.split('(')[1].split(',');
				functionOutput[functionName]=functionPara;
				stringOutput[events].push(functionOutput);
			}
		}

		return stringOutput;
	}

	newLicoDirectives['disable']=function(targetId){
		for(var i=0;i<targetId.length;i++){
			var thisTargetId=targetId[i];
			thisTargetId[0]=="#"?thisTargetId=thisTargetId:thisTargetId="#"+thisTargetId;
			$(thisTargetId).find('input').each(function(){
							$(this).attr('disabled',true);
						});
			$(thisTargetId).find('select').each(function(){
							$(this).attr('disabled',true);
						});
			$(thisTargetId).parent().find('button').each(function(){
							$(this).attr('disabled',true);
							// $(this.parent().prev().find('input')).attr('disabled',true);
			})
		}
	}

	newLicoDirectives['enable']=function(targetId){
		for(var i=0;i<targetId.length;i++){
			var thisTargetId=targetId[i];
			thisTargetId[0]=="#"?thisTargetId=thisTargetId:thisTargetId="#"+thisTargetId;
			$(thisTargetId).find('input').each(function(){
							$(this).attr('disabled',false);
						});
			$(thisTargetId).find('select').each(function(){
							$(this).attr('disabled',false);
						});
			$(thisTargetId).parent().find('button').each(function(){
							$(this).attr('disabled',false);
			})
			if($(thisTargetId).attr('lico-type')=='file' || $(thisTargetId).attr('lico-type')=='folder'){
				$(thisTargetId).find('input').each(function(){
							$(this).attr('disabled',true);
						});
			}
		}
	}

	newLicoDirectives['hide']=function(targetId){
		for(var i=0;i<targetId.length;i++){
			var thisTargetId=targetId[i];
			thisTargetId[0]=="#"?thisTargetId=thisTargetId:thisTargetId="#"+thisTargetId;
			if(!!$(thisTargetId).attr('lico-type')){
				$(thisTargetId).parent().hide();
			} else {
				$(thisTargetId).children().hide();
				$(thisTargetId).children(':first').show();
			}
		}
	}

	newLicoDirectives['show']=function(targetId){
		for(var i=0;i<targetId.length;i++){
			var thisTargetId=targetId[i];
			thisTargetId[0]=="#"?thisTargetId=thisTargetId:thisTargetId="#"+thisTargetId;
			if(!!$(thisTargetId).attr('lico-type')){
				$(thisTargetId).parent().show();
			} else {
				$(thisTargetId).children().show();
			}
		}
	}

	newLicoDirectives['init']=function(targetId,initData){
		for(var i=0;i<targetId.length;i++){
			var thisTarget=targetId[i];
			if(getThisData(thisTarget)!==initData[thisTarget][1]){
				$(thisTarget).html(initData[thisTarget][2]);
				$(thisTarget).trigger('change');
			}
		}
	}

	newLicoDirectives['getLocation']=function(targetId){
		var thisLocation;
		typeof $(targetId).attr('id') !== 'undefined' ?thisLocation='#'+$(targetId).attr('id'):typeof $(targetId).attr('name') !== 'undefined' ?thisLocation="#"+$(targetId).attr('name'):typeof $(targetId).parent().attr('id') !== 'undefined'?thisLocation="#"+$(targetId).parent().attr('id'):thisLocation="#"+$(targetId).parent().attr('name');
		return thisLocation;
	}

	return newLicoDirectives;
});