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
		'Controller'
	],
	function (Marionette, Controller) {
		'use strict';
		return Marionette.AppRouter.extend({

			controller: new Controller(),

			appRoutes: {
				'': 'index',
				'admin/nodes': 'adminNodes',
				'admin/monitor/list':'adminMonitorList',
				'admin/monitor/physical':'adminMonitorPhysical',
				'admin/monitor/physical/:view': 'adminMonitorPhysicalRacks',
				'admin/monitor/group':'adminMonitorGroup',
				'admin/user/groupsManagement':'userGroupsManagement',
				'admin/user/userManagement':'uerUserManagement',
				'admin/user/accountingManagement':'userAcountingManagement',
				'admin/users/:view': 'adminUsers',
				'files': 'files',
				'sessions': 'sessionInfo',
				'admin': 'admin',
				'admin/vncsessions':'session',
				'templateSelect':'templateSelectInfo'
				
			}

		});
	});
