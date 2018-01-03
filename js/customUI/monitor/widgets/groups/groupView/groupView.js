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
	'echartjs',
	'utils/constants/urlConstants',
	'utils/constants/constants',
	'utils/eventBus',
	'customUI/monitor/widgets/groups/groupView/widgets/gListView/gListView',
	'customUI/monitor/widgets/groups/groupView/widgets/tendencyView/tendencyView',
	'customUI/monitor/widgets/groups/groupView/widgets/heatView/heatView',
	'text!./templates/groupTmpl.mustache',
	'i18n!./nls/group',
	'css!./style/group.css'
	],function(Marionette ,bootstrap,echartjs,  urlConstants, constants,
		        eventBus, gListView ,tendencyView, heatView, template, nls){
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

            onRender:function(){
		        // var name=this.options.name;
		        var id=this.options.id;
          //   	App.router.navigate('#admin/monitor/'+id);

		        // $("#groups-group-name").text(name);
		        // $("#groups-group-name").attr("data-target","_"+id);

		        // $("#groups-view").off();
		        // $("#groups-view").on("click",function(){
		        // 	App.router.navigate('#admin/monitor',true);
		        // 	$("#monitor_group_view").trigger('click');
		        // });
	        
		        var gList=new gListView({el:"#group_body",id:id});
		        gList.render();

		        $("#group_list").off();
		        $("#group_list").on("click",function(){
		        	$(".group-title-tab").removeClass('active');
		        	$(this).addClass('active');
		        	$("#group_body").empty();
			        var gList=new gListView({el:"#group_body",id:id});
			        gList.render();
		        });

		        $("#tendency").off();
		        $("#tendency").on("click",function(){
		        	$(".group-title-tab").removeClass('active');
		        	$(this).addClass('active');
		        	$("#group_body").empty();
			        var tendency=new tendencyView({el:"#group_body",id:id});
			        tendency.render();
		        });

		        $("#heat").off();
		        $("#heat").on("click",function(){
		        	$(".group-title-tab").removeClass('active');
		        	$(this).addClass('active');
		        	$("#group_body").empty();
			        var heat=new heatView({el:"#group_body",id:id});
			        heat.render();
		        });
        	}
		});
	});