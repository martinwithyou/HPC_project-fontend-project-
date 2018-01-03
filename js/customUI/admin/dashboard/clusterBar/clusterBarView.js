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
        'text!./templates/clusterBarTmpl.mustache',
        'utils/constants/urlConstants',
        'utils/eventBus',
        'utils/constants/constants',
        'i18n!./nls/clusterBar',
        'css!./css/clusterBar'
        ],
        function(Marionette, clusterBarTemplate, urlConstants,
        		eventBus, constants, nls, clusterBarCss) {
	'use strict';
	return Marionette.ItemView.extend({
		className: 'row admin-clusterbar dashboard-shadow',

		templateHelpers: function () {
			return {
				nls: nls
			};
		},

		template: clusterBarTemplate,
		
		refresh: function (data) {
			$("#cluster_name").html(data.clusterOverview.name);
			if (data.clusterOverview.is_scheduler_workable == true) {
				$("#scheduler_status").css("background-color", "#8FE9A5");
			} else {
				$("#scheduler_status").css("background-color", "#D9534F");
			}
			if (data.clusterOverview.is_cluster_fs_workable == true) {
				$("#fs_status").css("background-color", "#8FE9A5");
			} else {
				$("#fs_status").css("background-color", "#D9534F");
			}
	        console.log("Cluster View Refreshed");
	    },

		onRender: function () {
			var self = this;
			
			eventBus.on(constants.refreshAdmin, self.refresh);
			
			$.ajax({
				type: "GET",
				url: urlConstants.clusterOverview,
				dataType: "json",
				success: function (data, textStatus) {
					$("#cluster_name").html(data.name);
					if (data.is_scheduler_workable == true) {
						$("#scheduler_status").css("background-color", "#8FE9A5");
					} else {
						$("#scheduler_status").css("background-color", "#D9534F");
					}
					if (data.is_cluster_fs_workable == true) {
						$("#fs_status").css("background-color", "#8FE9A5");
					} else {
						$("#fs_status").css("background-color", "#D9534F");
					}
				},
				error: function (XMLHttpRequest, textStatus, errorThrown) {
					$("#status_section").css("display", "none");
					$("#error_notify").css("display", "block");
				}
			});
			
		}

	});
});