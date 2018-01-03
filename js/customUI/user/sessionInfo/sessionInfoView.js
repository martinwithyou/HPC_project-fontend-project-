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
	'datatables',
	'datatables_bootstrap',
	'utils/constants/urlConstants',
	'utils/constants/constants',
	'utils/eventBus',
	'text!./templates/sessionInfoTmpl.mustache',
	'i18n!./nls/sessionInfo',
	'css!./style/sessionInfo.css',
	'utils/utils'
	],function(Marionette, datatables, datatables_bootstrap, urlConstants, constants, eventBus, sessionInfo, nls,sessioncss,utils){
		return Marionette.ItemView.extend({
			template: sessionInfo,
			templateHelpers:function(){
				return {
					nls:nls
				};
			},
			
			self: this,

			ui:{
				allSessionInfoTable:'#allSessionInfoTable'
			},
			
			  tempSessionInfoId: "",
		   
			  showSessionInfo_viewConfirm: function (data) {
		    	  var _currentUser=$.cookie('username');	
		          var _location=window.location;
//		          window.open('http://'+_location.host+':6000/'+_currentUser+'/','_blank');
		          window.open('http://'+_location.hostname+':6080/vnc_auto.html?token='+data.token+'&password=123456','_blank');
//		          http://10.240.212.28:6080/vnc_auto.html?token=741776278992e18d10912df82cdccf528f275f96&password=123456

		      },
		      
		     
		      SessionInfo_DeleteFinishConfirm: function (data) {
		    	  self.tempSessionInfoId = data.id;
		    	  $("#sessionInfo_deleteFinishConfirm").modal('show');
		    	  $("#delete_finish_sessionName_section").html(nls.name + ": " +data.name);
		    	  $("#delete_finish_hostName_section").html(nls.SessionHost + ": " +data.host);
		    	  $("#delete_finish_owner_section").html(nls.Owner + ": " +data.username);		
		    	  $("#sessionInfo_deleteFinishConfirm_btn").click(function () {
		    		  var data_url = urlConstants.vncsessions;
		    		  data_url=data_url+self.tempSessionInfoId+'/'; 
		    		  $.ajax({
		    			    type: "DELETE",
		    			    'url':data_url,
		    			    success: function (res, textStatus) {
		    			    	$("#sessionInfo_deleteFinishConfirm_btn").unbind('click');
		    			    	$("#sessionInfo_deleteFinishConfirm").modal('hide');
								utils.refreshsessionInfo();
			    			  },  
			    			  error: function (XMLHttpRequest, textStatus, errorThrown) {
			    				  $("#sessionInfo_deleteFinishConfirm_btn").unbind('click');
			    				  $("#sessionInfo_deleteFinishConfirm").modal('hide');
			    				  $("#sessionInfo_CancelResultArea").addClass("alert alert-dismissable").css("background-color", "white");
			    				  $("#sessionInfo_CancelResultText").html("session "+data.name+"      "+nls.session_delete_fail);;
			    				  $("#sessionInfo_CancelIcon").attr("src", "/static/js/customUI/user/sessionInfo/resources/ic_clear_red_36x36.png");
			    				  $("#sessionInfo_CancelResult").modal('show'); 				  
			    				  utils.refreshsessionInfo();
			    			  }	
		    		  });	  
		    	  });
		      },
      
		  onDestroy: function(){
		    $("body").css("background-color", "#F6F6F4");
		  },

		  onRender:function(){
				$("body").css("background-color", "white");
				var _this=this;

				var sessionTable = this.ui.allSessionInfoTable.dataTable({
					responsive:true,
					bPaginate:true,
					bInfo:true,
					sLengthMenu:'',
					
					language: {
                    "url": require.toUrl('') + "translation/datatables.chinese.json"
                    },

                    columns:[
                    {                    	
                    	'data':'name','title':nls.name,'className':'dt-center'
                    },{
                    	'data':'host','title':nls.SessionHost,'className':'dt-center'
                    },{
                    	'data':'port','title':nls.port,'className':'dt-center'
                    },{
                    	'data':'username','title':nls.Owner,'className':'dt-center'
                    },{
                    	'data':'pid','title':nls.pid,'className':'dt-center'
                    },{
                    	'data':'index','title':nls.index,'className':'dt-center'
                    },{
                    	'data':'status','title':nls.Status,'className':'dt-center'
                    },{
                    	'data':'operation','title':nls.Operation,'className':'dt-center'                  
                    }
                ],
                    ajax:{
						'url':urlConstants.vncsessions,
						'dataSrc':function(res){
							var data=res;
							$.each(data,function(index,item){								
								var delete_finish_ID = "delete_"+item.id;
			        			var view_finish_ID = "view_"+item.id;
			        			if(item['status']!="Ready")
		    			    	{
		    			    		item['operation']="<a title='"+nls.view+"' id='"+view_finish_ID+"' href='javascript:void(0)'><img src='/static/js/customUI/user/sessionInfo/resources/session_grey_25x25.png'></img></a><a style='margin-left:15px' title='"+nls.del+"' id='"+delete_finish_ID+"' href='javascript:void(0)'><img src='/static/js/customUI/user/sessionInfo/resources/ic_delete_grey600_22dp.png'></img></a>";			    			    			    			    					
		    			    	}
								else
								{
									item['operation']="<a class='view' title='"+nls.view+"' id='"+view_finish_ID+"' href='javascript:void(0)'><img src='/static/js/customUI/user/sessionInfo/resources/session_blue_25x25.png'></img></a><a style='margin-left:15px' class ='delete' title='"+nls.del+"' id='"+delete_finish_ID+"' href='javascript:void(0)'><img src='/static/js/customUI/user/sessionInfo/resources/ic_delete_blue600_22dp.png'></img></a>";														
								}
							});					
							return data;										
						}
					},
			
				});

				this.ui.allSessionInfoTable.on("click", ".delete", function(e) {
					  var data = sessionTable.fnGetData($("#"+this.id).parents("tr")[0]);
					  _this.SessionInfo_DeleteFinishConfirm(data);
				  });

				this.ui.allSessionInfoTable.on("click", ".view", function (e) {
					var data = sessionTable.fnGetData($("#"+this.id).parents("tr")[0]);
					_this.showSessionInfo_viewConfirm(data);
				});
				
				eventBus.on(constants.refreshsessionInfo,_this.refreshTable);
				
				
			},
		
			refreshTable:function(){
				var _table=$('#allSessionInfoTable').DataTable();
				_table.ajax.reload();
			}
		});
		
		
	});