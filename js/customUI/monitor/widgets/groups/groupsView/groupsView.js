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
	'bootstrap',
	'utils/constants/urlConstants',
	'utils/constants/constants',
	'utils/eventBus',
	'text!./templates/groupsTmpl.mustache',
	'i18n!./nls/groups',
	'customUI/monitor/widgets/groups/groupView/groupView',
	'css!./style/groups.css'
	],function(Marionette ,bootstrap,  urlConstants, constants,
		        eventBus,template, nls,groupView){
		var group;
		return Marionette.ItemView.extend({
			template:template,
			templateHelpers:function(){
				return {
					nls:nls
				};
			},

			onDestroy: function(){
		    	$("body").css("background-color", "#F6F6F4");
		  	},

            onShow:function(){
			    var _this=this;
			    _this.ajax();
        		$("#groups_selected_item").off();
				$("#groups_selected_item").on("change",function () {
					var id=$("select option:selected").attr("data-id");
	            	group=new groupView({el:"#groups_group_content",id:id});
	            	group.render();
				});	
        	},
        	ajax:function(){
			    $.ajax({
			      type : "GET",
			      // url : "static/js/customUI/monitor/widgets/groups/groupsView/data/nodegroups.json",
			      url : urlConstants.nodegroups,
			      async:false,
			      dataType : "json",
			      success : function (data) {
			      	if(data.ret == "success"){
				        var _data=data.groups;
				        var _dataLen=_data.length;
				        for(var i=0;i<_dataLen;i++){
				        	$("#groups_selected_item").append("<option data-id='"+_data[i].id+"'>"+_data[i].groupname+"</option")
				        };
						var id=$("select option:selected").attr("data-id");
		            	group=new groupView({el:"#groups_group_content",id:id});
		            	group.render();
			      	} else {
	      				alert("ret:"+data.ret+"\n"+"msg:"+data.msg)
			      	}
			      },
			      error : function (jqXHR, textStatus, errorThrown) {
			        console.log(textStatus + errorThrown)
			        console.log(jqXHR);
			      }
			    });
        	}
		});
	});