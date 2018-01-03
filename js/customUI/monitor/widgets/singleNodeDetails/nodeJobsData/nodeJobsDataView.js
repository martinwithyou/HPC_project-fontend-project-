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
	'text!./templates/allNodesTmpl.mustache',
	'i18n!./nls/allNodes',
	'css!./style/allNodes.css'
	],function(Marionette, datatables, datatables_bootstrap, urlConstants, constants, eventBus, template, nls){
		return Marionette.ItemView.extend({
			template:template,
			templateHelpers:function(){
				return {
					nls:nls
				};
			},

			ui:{
				nodeJobsTable:'#nodeJobsTable'
			},

			onDestroy: function(){
		    // custom cleanup or destroying code, here
		    $("body").css("background-color", "#F6F6F4");
		    },

			onRender:function(){
				
				$("body").css("background-color", "white");
                
                console.log(urlConstants.running_jobs+Number($("#body").attr("data-node_id"))+"/runningjobs");

				$("#nodeJobsTable").dataTable({
					
					responsive:true,
					bPaginate:false,
					bInfo:false,
					sLengthMenu:'',
					bLengthChange:true,
                   	searching: false,
                     
					language: {
                    "url": require.toUrl('') + "translation/datatables.chinese.json"
                    },

                    columns:[
                    {
                    	'data':'jobid','title':nls.jobID,'className':'dt-center'
                    },{
                    	'data':'submiter','title':nls.userName,'className':'dt-center'
                    },{
                    	'data':'jobname','title':nls.jobName,'className':'dt-center'
                    },{
                    	'data':'queue','title':nls.batch,'className':'dt-center'
                    },{
                    	'data':'starttime','title':nls.startTime,'className':'dt-center'
                    },{
                    	'data':'core_num_on_node','title':nls.CPUCores,'className':'dt-center'
                    }
                    ],
                    ajax:{
						'url':urlConstants.running_jobs+Number($("#body").attr("data-node_id"))+"/runningjobs/",
						
						'dataSrc':function(res){
							
//							console.log(JSON.stringify(res.jobs));
							
							var data=res.jobs;
						    
						   $.each(data, function(index , item) {
						   	
						   	    	var  timeThis = new Date(item.starttime*1000);
						   	    	 
						   	        var qtime_year = timeThis.getFullYear()+"-";
    	                            var qtime_month = timeThis.getMonth()+1+"-";
    	                            var qtime_date = timeThis.getDate()+"   ";
    	                            var qtime_hour = timeThis.getHours()+":";
  		                            var qtime_minute = timeThis.getMinutes()+":";
  		                            var qtime_seconds=timeThis.getSeconds()+"";
  		                            
  		                            item.starttime = qtime_year+qtime_month+qtime_date+qtime_hour+qtime_minute+qtime_seconds
  		                            
  		                            item.core_num_on_node=item.core_num_on_node+nls.core;
  		                            
						   });
						 
							return data;
						}
					}
				});
				 eventBus.off(constants.refreshNodeJobsData);
				 eventBus.on(constants.refreshNodeJobsData,this.refreshTable);
			},
           refreshTable:function(){
           	
           	//    console.log("nodeJobsTable重复执行该方法开始！");
           	    
				var _table=$('#nodeJobsTable').DataTable();
				
				_table.ajax.reload();
				
			//	console.log("nodeJobsTable重复执行该方法结束！");
		    }

		
		});
	});