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
		'RegionManager',
		'core/layout/welcome/welcomeView',
		'customUI/nodeList/nodeListView',
		'customUI/user/dashboard/overview/dashboardView',
		'customUI/admin/dashboard/overview/dashboardView',
		'customUI/admin/userboard/userboard/userboardView'
	],
	function (Marionette, regionManager, welcomeView, nodeListView, dashboardView, adminDashboardView, userboardView) {
		'use strict';

		return Marionette.Controller.extend({

			// initialize : function() {
			// 	regionManager.showHeader();
			// 	//regionManager.showNavigation();
			// },

			index: function () {
				var dashboard = new dashboardView();
				dashboard.render();
				regionManager.showContent(dashboard);
			},

			about: function () {
				regionManager.showContent(new welcomeView());
				//regionManager.showAbout();
			},

			user: function () {
				regionManager.showContent(new welcomeView());
				//regionManager.showAbout();
			},

			adminNodes: function () {
				// Prevent normal user logging into admin page
				if ($.cookie("is_admin") === "False") {
					return;
				}
				regionManager.showAllNodes();
			},
            //新增加监控部分开始
            adminMonitor: function(){
            	
            	regionManager.showAllMonitor();
            	
            	
            },
            //新增加监控部分结束 
            adminMonitorList:function(){
            	
            	regionManager.showAllMonitorList();
            	
            },
            adminMonitorPhysical:function(){
            	
            	regionManager.adminMonitorPhysical();
            },
			adminMonitorPhysicalRacks:function(){

				regionManager.adminMonitorPhysicalRacks();
			},
            adminMonitorGroup:function(){
            	
            	regionManager.adminMonitorGroup();
            	
            },
            //用户管理新路由开始
            userGroupsManagement:function(){
            	
            	regionManager.showUserGroupsManagement();
            	
            },
            uerUserManagement:function(){
            	
            	regionManager.showUserManagement();
            	
            },
            userAcountingManagement:function(){
            	
            	regionManager.showAcountingManagement();
            	
            },
            //用户管理新路由结束
			adminUsers: function (view) {
				// Prevent normal user logging into admin page
				if ($.cookie("is_admin") === "False") {
					return;
				}
				//regionManager.showNavigation();
				regionManager.showContent(new userboardView({"currentView": view}));
			},

			
			
			 
			session: function () {
				if ($.cookie("is_admin") === "False") {
					return;
				}
				regionManager.showAllVncSessions();
			},
			
			jobs: function () {
				regionManager.showJobView();
			},

			/*
			users: function(){
				regionManager.showUsers();
			},

			group: function(){
				regionManager.showGroup();
			},

			accounting: function(){
				regionManager.showAccounting();
			},
			*/

			files: function (){
				regionManager.showFileManagement();
			},
			
			sessionInfo: function (){
				regionManager.showSessionInfo();
			},

			admin: function() {
				// Prevent normal user logging into admin page
				if ($.cookie("is_admin") === "False") {
					return;
				} 
				if($.cookie("is_admin") === "True"){
					regionManager.showHeader({"isAdmin": true});
				}
				var adminDashboard = new adminDashboardView();
				adminDashboard.render();
				regionManager.showContent(adminDashboard);
			},

			jobChart: function () {
				
				regionManager.showJobChart();
				
			},
			
			templateSelectInfo:function(){
				
				regionManager.showTemplateSelect();
				
			}
		});

	});
