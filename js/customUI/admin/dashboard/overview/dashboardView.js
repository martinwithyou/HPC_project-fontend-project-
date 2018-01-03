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
    'text!./templates/dashboardTmpl.mustache',
    '../resourceBar/resourceBarView',
    '../clusterBar/clusterBarView',
    '../jobNodeBar/jobNodeBarView',
    'css!./css/dashboardView'
  ],
  function(Marionette, dashboard, resourceBarView, clusterBarView, jobNodeBarView) {
    'use strict';
    return Marionette.LayoutView.extend({
      template: dashboard,

      regions: {
        adminDashboardCluster : '#admin-cluster-wrapper',
        adminDashboardResource : '#admin-resource-wrapper',
        adminDashboardJobNode : '#admin-job-node-wrapper'
      },

      onShow: function () {
        this.getRegion('adminDashboardCluster').show(new clusterBarView());
        this.getRegion('adminDashboardResource').show(new resourceBarView());
        this.getRegion('adminDashboardJobNode').show(new jobNodeBarView());
      }
    });
  });