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
		'core/layout/header/headerView',
		'core/layout/welcome/welcomeView',
		'core/layout/footer/footerView',
		'customUI/nodeList/nodeListView',
		'customUI/user/dashboard/job/jobView',
		'customUI/userManagement/userManagementView',
		'customUI/groupManagement/userGroupView',
		'customUI/accountingManagement/accountingMgtView',
		'customUI/nodes/allNodesView',
		'customUI/user/fileManagement/fileManagementView',
		'customUI/admin/dashboard/jobChart/jobChart',   	
    	'customUI/session/sessionView',
    	'customUI/user/sessionInfo/sessionInfoView',
    	'customUI/showTemplateSelect/showTemplateSelectView',
        'customUI/monitor/widgets/listView/listView',
        'customUI/monitor/widgets/groups/groupsView/groupsView',
        'customUI/monitor/widgets/physicals/physical/physicalView',
		'customUI/monitor/widgets/physicals/rack/rackView'
	],
	function (Marionette, headerView, welcomeView, footerView,
		nodeListView, jobView, userManagementView, userGroupView,
		accountingMgtView, allNodesView,fileManagementView, jobChart,
		sessionView,sessionInfoView,showTemplateSelectView,listView,groupsView,
		physicalView,rackView) {

		'use strict';

		var rm = new Marionette.RegionManager();

		var regions = rm.addRegions({
			header: "#header",
			navigation: "#navigation",
			body: '#body',
			dialogregion: '#dialog-region',
			footer: '#footer'
		});

		return {
			showIndex: function () {
				regions.header.show(new headerView());
				//regions.navigation.show(new navigationView());
				regions.body.show(new welcomeView());
			},

			showFileManagement: function (){
				regions.body.show(new fileManagementView());
			},

			showSessionInfo: function (){
				regions.body.show(new sessionInfoView());
			},
			
			
			showHeader: function (options) {
				regions.header.show(new headerView(options));
			},

			showFooter: function() {
				regions.footer.show(new footerView());
			},

			showNavigation: function () {
				//regions.navigation.show(new navigationView());
			},

			showContent: function (contentView) {
				regions.body.show(contentView);
			},

			showAbout: function () {
				//rm.emptyRegions();
				regions.login.show(new loginView())
			},

			showNodeList: function () {
				regions.header.show(new headerView());
				//regions.navigation.show(new navigationView());
				regions.body.show(new nodeListView());
			},

			showJobView: function () {
				regions.header.show(new headerView());
				//regions.navigation.show(new navigationView());
				
				var cc=new jobView();
				
				regions.dialogregion.show(cc);
				console.log(cc);
			},
			/*
			showUsers:function(){
				regions.header.show(new headerView());
				regions.navigation.show(new navigationView());
				regions.body.show(new userManagementView());
			},

			showGroup:function(){
				regions.header.show(new headerView());
				regions.navigation.show(new navigationView());
				regions.body.show(new userGroupView());
			},

			showAccounting:function(){
				regions.header.show(new headerView());
				regions.navigation.show(new navigationView());
				regions.body.show(new accountingMgtView());
			},
			*/

			showJobChart: function () {
				regions.header.show(new headerView());
				//regions.navigation.show(new navigationView());
				regions.body.show(new jobChart());
			},

			showAllNodes:function(){
				//regions.header.show(new headerView());
				//regions.navigation.show(new navigationView());
				regions.body.show(new allNodesView());
            },
			
			showAllVncSessions:function(){
				regions.body.show(new sessionView());
			},
			
			showTemplateSelect:function(){
				
				regions.body.show(new showTemplateSelectView());
				
			},
			showAllMonitorList:function(){
				
				regions.body.show(new listView());
			},
			adminMonitorPhysical:function(){

				regions.body.show(new physicalView());
			},
			adminMonitorPhysicalRacks:function(){
				
				var num = Number(window.location.hash.lastIndexOf('/')) + 1;
				var id = Number(window.location.hash.substr(num));
				var name="Rack" + id;
				var rack=new rackView({el:"#body",name:name,id:id});
				rack.render();
			},
			adminMonitorGroup:function(){
				
				regions.body.show(new groupsView());
			},
			showUserGroupsManagement:function(){
				regions.body.show(new userGroupView() );
			},
			showUserManagement:function(){
				regions.body.show(new userManagementView());
			},
			showAcountingManagement:function(){
				regions.body.show(new accountingMgtView() );
			}
		};

	});