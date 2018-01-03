define(['jquery','utils/utils','i18n!../nls/AllJobViewNls'],function($,utils,nls){
	var validate={};
	
	var nls=nls;


	   function addInvalidClass(tgt) {
    	  $(tgt).removeClass("form-control").addClass("form-control-invalid");
      };

      function removeInvalidClass(tgt) {
    	  $(tgt).removeClass("form-control-invalid").addClass("form-control");
      };

// checkbox、radio用
      validate.required=function(thisID){
        var isValid;
        var errMsg=nls.requiredMsg;
        var data=$(thisID).find('input:checked');
        if($(data).length!=0){
            utils.hideMessageOnSpot(thisID);
            removeInvalidClass(thisID);
            isValid=true;
        }else{
            utils.showMessageOnSpot(thisID,errMsg);
            addInvalidClass(thisID);
            isValid=false;
        }
        return isValid;
      }

// input用
      validate.commonRequire=function(thisID){
        var isValid;
        var errMsg=nls.requiredMsg;
        var val=$.trim($(thisID).val());
        if(val.length!=0){
          utils.hideMessageOnSpot(thisID);
          removeInvalidClass(thisID);
          isValid=true;
        }else{
          utils.showMessageOnSpot(thisID,errMsg);
          addInvalidClass(thisID);
          isValid=false;
        }
        return isValid;
      }

      validate.fileRequire=function(thisID){
        var isValid;
        var errMsg=nls.requiredMsg;
        var val=$.trim($(thisID).attr('placeholder'));
        var reg=/\//;
        if(val.length!=0 && reg.test(val)){
          utils.hideMessageOnSpot(thisID);
          removeInvalidClass(thisID);
          isValid=true;
        }else{
          utils.showMessageOnSpot(thisID,errMsg);
          addInvalidClass(thisID);
          isValid=false;
        }
        return isValid;
      }

      validate.mail=function(thisID,req){
         var isValid;
          var value = $.trim($(thisID).val());
          //var reg = /^[A-Za-zd]+([-_.][A-Za-zd]+)*@([A-Za-zd]+[-.])+[A-Za-zd]{2,5}$/;
          var reg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
          var errMsg = nls.mailMsg;
          if (req=="true" && value.length==0) {
              utils.showMessageOnSpot(thisID,errMsg);
              addInvalidClass(thisID);
              isValid = false;
          } else if (!reg.test(value) && value.length!=0) {
              utils.showMessageOnSpot(thisID, errMsg);
              addInvalidClass(thisID);
              isValid = false;
          } else {
              utils.hideMessageOnSpot(thisID);
              removeInvalidClass(thisID);
              isValid = true;
          }
          return isValid;
      };

      validate.number=function(thisID,req){
        var isValid;
          var value = $.trim($(thisID).val());
          var reg = /^[1-9]\d*$/;
          var errMsg = nls.intReqMsg;
          if (req=="true" && value.length==0) {
              utils.showMessageOnSpot(thisID,errMsg);
              addInvalidClass(thisID);
              isValid = false;
          } else if (!reg.test(value) && value.length!=0) {
              utils.showMessageOnSpot(thisID, errMsg);
              addInvalidClass(thisID);
              isValid = false;
          } else {
              utils.hideMessageOnSpot(thisID);
              removeInvalidClass(thisID);
              isValid = true;
          }
          return isValid;
      };

      validate.file=function(thisID,req){
            var isValid;
              var errMsg = nls.workingDirEmptyMsg;
              var reg = /\//;
              if ($.trim($(thisID).val()).length == 0 && req=="true") {
                  utils.showMessageOnSpot(thisID, errMsg);
                  addInvalidClass(thisID);
                  isValid = false;
              } else if(!reg.test($.trim($(thisID).val())) && $.trim($(thisID).val()).length!=0){
                  utils.showMessageOnSpot(thisID, errMsg);
                  addInvalidClass(thisID);
                  isValid = false;
              } else {
                  utils.hideMessageOnSpot(thisID);
                  removeInvalidClass(thisID);
                  isValid = true;
              }
          return isValid;
      };

      validate.text=function(thisID,req){
            var isValid;
            var errMsg = nls.textEmptyMsg;

          var value = $.trim($(thisID).val());
          if ((value == "" || value == null) && req=="true") {
              utils.showMessageOnSpot(thisID,errMsg);
              addInvalidClass(thisID);
              isValid = false;
          } else{
                utils.hideMessageOnSpot(thisID);
                removeInvalidClass(thisID);
                isValid=true;
          }
          return isValid;   
      };

      validate.jobName=function(thisID,req){
        var isValid;
          var reg = /^[a-zA-z]\w{3,15}$/;
          var errMsgEmpty = nls.jobNameEmptyMsg;
          var errMsgReg = nls.jobNameRegMsg;
          var value = $.trim($(thisID).val());
          if (value.length == 0 && req=="true") {
              utils.showMessageOnSpot(thisID, errMsgEmpty, "right");
              addInvalidClass(thisID);
              isValid = false;
          } else if (!reg.test(value) && value.length != 0) {
              utils.showMessageOnSpot(thisID, errMsgReg, "right");
              isValid = false;
              addInvalidClass(thisID);
          } else {
              utils.hideMessageOnSpot(thisID);
              isValid = true;
              removeInvalidClass(thisID);
          }
          return isValid;
      };




	 validate.validateEmail= function (thisID,req) {
    	  var isValid;
    	  var value = $.trim($(thisID).val());
    	  //var reg = /^[A-Za-zd]+([-_.][A-Za-zd]+)*@([A-Za-zd]+[-.])+[A-Za-zd]{2,5}$/;
    	  var reg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    	  var errMsg = nls.mailMsg;
    	  if ((value == "" || value == null) && req=="require") {
    		  utils.showMessageOnSpot(thisID,errMsg);
    		  addInvalidClass(thisID);
    		  isValid = false;
    	  } else if (!reg.test(value)) {
    		  utils.showMessageOnSpot(thisID, errMsg);
    		  addInvalidClass(thisID);
    		  isValid = false;
    	  } else {
    		  utils.hideMessageOnSpot(thisID);
    		  removeInvalidClass(thisID);
    		  isValid = true;
    	  }
    	  return isValid;
      };


     validate.validateNodeNum=function (thisID) {
          var isValid;
          var value = $.trim($(thisID).val());
          var reg = /^[1-9]\d*$/;
          var errMsg = nls.intReqMsg;
          if (value == "" || value == null) {
              utils.hideMessageOnSpot(thisID);
              removeInvalidClass(thisID);
              isValid = true;
          } else if (!reg.test(value)) {
              utils.showMessageOnSpot(thisID, errMsg);
              addInvalidClass(thisID);
              isValid = false;
          } else {
              utils.hideMessageOnSpot(thisID);
              removeInvalidClass(thisID);
              isValid = true;
          }
          return isValid;
      };


            validate.validateWalltimeMin=function (thisID) {
    	  var isValid;
    	  var value = $.trim($(thisID).val());
    	  var reg = /^([0-9]|[1-5]\d)$/;
    	  var errMsg = nls.minMsg;
    	  if (value == "" || value == null) {
    		  utils.hideMessageOnSpot(thisID);
    		  removeInvalidClass(thisID);
    		  isValid = true;
    	  } else if (!reg.test(value)) {
    		  utils.showMessageOnSpot(thisID, errMsg);
    		  addInvalidClass(thisID);
    		  isValid = false;
    	  } else {
    		  utils.hideMessageOnSpot(thisID);
    		  removeInvalidClass(thisID);
    		  isValid = true;
    	  }
    	  return isValid;
      };


      validate.validateCPUCoreNum=function (thisID) {
    	  var isValid;
    	  var value = $.trim($(thisID).val());
    	  var reg = /^[1-9]\d*$/;
    	  var errMsg = nls.intReqMsg;
    	  if (value == "" || value == null) {
    		  utils.hideMessageOnSpot(thisID);
    		  removeInvalidClass(thisID);
    		  isValid = true;
    	  } else if (!reg.test(value)) {
    		  utils.showMessageOnSpot(thisID, errMsg);
    		  addInvalidClass(thisID);
    		  isValid = false;
    	  } else {
    		  utils.hideMessageOnSpot(thisID);
    		  removeInvalidClass(thisID);
    		  isValid = true;
    	  }
    	  return isValid;
      };


            validate.validateWalltimeHour=function (thisID) {
    	  var isValid;
    	  var value = $.trim($(thisID).val());
    	  var reg = /^[1-9]\d*$/;
    	  var errMsg = nls.intReqMsg;
    	  if (value == "" || value == null) {
    		  utils.hideMessageOnSpot(thisID);
    		  removeInvalidClass(thisID);
    		  isValid = true;
    	  } else if (!reg.test(value)) {
    		  utils.showMessageOnSpot(thisID, errMsg, "bottom");
    		  addInvalidClass(thisID);
    		  isValid = false;
    	  } else {
    		  utils.hideMessageOnSpot(thisID);
    		  removeInvalidClass(thisID);
    		  isValid = true;
    	  }
    	  return isValid;
      };


            validate.validateMemSize=function (thisID) {
    	  var isValid;
    	  var value = $.trim($(thisID).val());
    	  var reg = /^[1-9]\d*$/;
    	  var errMsg = nls.intReqMsg;
    	  if (value == "" || value == null) {
    		  utils.hideMessageOnSpot(thisID);
    		  removeInvalidClass(thisID);
    		  isValid = true;
    	  } else if (!reg.test(value)) {
    		  utils.showMessageOnSpot(thisID, errMsg);
    		  addInvalidClass(thisID);
    		  isValid = false;
    	  } else {
    		  utils.hideMessageOnSpot(thisID);
    		  removeInvalidClass(thisID);
    		  isValid = true;
    	  }
    	  return isValid;
      };


      validate.validateWorkingDir=function (thisID,showMessageID) {
    	  var isValid;
    	  var errMsg = nls.workingDirEmptyMsg;
    	  if ($.trim($(thisID).val()).length == 0) {
    		  utils.showMessageOnSpot(showMessageID, errMsg);
    		  addInvalidClass(thisID);
    		  isValid = false;
    	  } else {
    		  utils.hideMessageOnSpot(showMessageID);
    		  removeInvalidClass(thisID);
    		  isValid = true;
    	  }
    	  return isValid;
      };

   
       validate.validateMPIProg=function (thisID,showMessageID) {
    	  var errMsg = nls.MPIProgEmptyMsg;
    	  var isValid;
    	  if ($.trim($(thisID).val()).length == 0) {
    		  utils.showMessageOnSpot(showMessageID, errMsg);
    		  addInvalidClass(thisID);
    		  isValid = false;
    	  } else {
    		  utils.hideMessageOnSpot(showMessageID);
    		  removeInvalidClass(thisID);
    		  isValid = true;
    	  }
    	  return isValid;
      };

      validate.validateJobName=function (thisID) {
    	  var isValid;
    	  var reg = /^[a-zA-z]\w{3,15}$/;
    	  var errMsgEmpty = nls.jobNameEmptyMsg;
		  var errMsgReg = nls.jobNameRegMsg;
		  var value = $.trim($(thisID).val());
    	  if (value.length == 0) {
    		  utils.showMessageOnSpot(thisID, errMsgEmpty, "right");
    		  addInvalidClass(thisID);
    		  isValid = false;
    	  } else if (!reg.test(value)) {
    		  utils.showMessageOnSpot(thisID, errMsgReg, "right");
    		  isValid = false;
    		  addInvalidClass(thisID);
    	  } else {
    		  utils.hideMessageOnSpot(thisID);
    		  isValid = true;
    		  removeInvalidClass(thisID);
    	  }
    	  return isValid;
      };

            validate.validateQueue=function (thisID) {
    	  var isValid;
    	  var errMsg = nls.queueEmptyMsg;
    	  if ($(thisID).val() == "empty") {
    		  utils.showMessageOnSpot(thisID, errMsg);
    		  addInvalidClass(thisID);
    		  isValid = false;
    	  } else {
    		  utils.hideMessageOnSpot(thisID);
    		  removeInvalidClass(thisID);
    		  isValid = true;
    	  }
    	  return isValid;
      };
	
	return validate;
});