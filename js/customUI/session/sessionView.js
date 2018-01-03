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
	'text!./templates/sessionTmpl.mustache',
	'i18n!./nls/session',
	'css!./style/session.css',
	'utils/utils'
	],function(Marionette, datatables, datatables_bootstrap, urlConstants, constants, eventBus, session, nls, sessioncss, utils){
		return Marionette.ItemView.extend({
			template: session,
			templateHelpers:function(){
				return {
					nls:nls
				};
			},
			
			self: this,

			ui:{
				allSessionsTable:'#allSessionsTable'
			},
			
			  tempSessionId: "",
		   
		      showSessionViewConfirm: function (data) {
		    	  var _currentUser=$.cookie('username');	
		          var _location=window.location;
		          window.open('http://'+_location.hostname+':6080/vnc_auto.html?token='+data.token+'&password=123456','_blank');
		      },
		      
		      showSessionDeleteFinishConfirm: function (data) {
	    	  self.tempSessionId = data.id;
	    	  $("#session_deleteFinishConfirm").modal('show');
	    	  $("#delete_finish_sessionName_section").html(nls.name + ": " +data.name);
	    	  $("#delete_finish_hostName_section").html(nls.SessionHost + ": " +data.host);
	    	  $("#delete_finish_owner_section").html(nls.Owner + ": " +data.username);		    	  
	    	  $("#session_deleteFinishConfirm_btn").click(function () { 
	    		  var data_url = urlConstants.vncsessions;
	    		  data_url1=data_url+self.tempSessionId+'/?role=admin'; 	    		     		 
	    		  $.ajax({
	    			    type: "DELETE",
	    			    'url':data_url1,
			    			  success: function (res, textStatus) {
			    			    	$("#session_deleteFinishConfirm_btn").unbind('click');
			    			    	$("#session_deleteFinishConfirm").modal('hide');
									utils.refreshsession();
				    			  },  
				    			  error: function (XMLHttpRequest, textStatus, errorThrown) {
				    				  $("#session_deleteFinishConfirm_btn").unbind('click');
				    				  $("#session_deleteFinishConfirm").modal('hide');
				    				  $("#session_CancelResultArea").addClass("alert alert-dismissable").css("background-color", "white");
				    				  $("#session_CancelResultText").html("session "+data.name+"      "+nls.delete_fail);;
				    				  $("#session_CancelIcon").attr("src", "/static/js/customUI/session/resources/ic_clear_red_36x36.png");
				    				  $("#session_CancelResult").modal('show'); 				  
				    				  utils.refreshsession();
				    			  }				    			  
	    		  });	  
	    	  });
	      },
		    
	      
	    	 
		    			  
	      
	      
			onDestroy: function(){
		    $("body").css("background-color", "#F6F6F4");
		  },

		  onShow:function(){
				$("body").css("background-color", "white");
				var _this=this;
				var sessionTable = this.ui.allSessionsTable.dataTable({
					responsive:true,
					bPaginate:true,
					bInfo:false,
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
                    	'url':urlConstants.vncsessions+"?role=admin",
						'dataSrc':function(res){
							var data=res;
							$.each(data,function(index,item){											        			
			        			var delete_finish_ID = "delete_"+item.id;
			        			var view_finish_ID = "view_"+item.id;	
			        			if(item['status']!="Ready")
		    			    	{
		    			    		item['operation']="<a title='"+nls.view+"' id='"+view_finish_ID+"' href='javascript:void(0)'><img src='/static/js/customUI/session/resources/session_grey_25x25.png'></img></a><a style='margin-left:15px' title='"+nls.del+"' id='"+delete_finish_ID+"' href='javascript:void(0)'><img src='/static/js/customUI/session/resources/ic_delete_grey600_22dp.png'></img></a>";			    			    			    			    					
		    			    	}
								else
								{
									item['operation']="<a class='view' title='"+nls.view+"' id='"+view_finish_ID+"' href='javascript:void(0)'><img src='/static/js/customUI/session/resources/session_blue_25x25.png'></img></a><a style='margin-left:15px' class ='delete' title='"+nls.del+"' id='"+delete_finish_ID+"' href='javascript:void(0)'><img src='/static/js/customUI/session/resources/ic_delete_blue600_22dp.png'></img></a>";														
								}
							});										
							return data;										
						}
					},
			
				});

				this.ui.allSessionsTable.on("click", ".delete", function(e) {
					  var data = sessionTable.fnGetData($("#"+this.id).parents("tr")[0]);
					  _this.showSessionDeleteFinishConfirm(data);
				  });

				this.ui.allSessionsTable.on("click", ".view", function (e) {
					var data = sessionTable.fnGetData($("#"+this.id).parents("tr")[0]);
					_this.showSessionViewConfirm(data);
				});
				
				eventBus.on(constants.refreshsession,_this.refreshTable);
				
				
			},
		
			refreshTable:function(){
				var _table=$('#allSessionsTable').DataTable();
				_table.ajax.reload();
			}
		});
		
		
	});