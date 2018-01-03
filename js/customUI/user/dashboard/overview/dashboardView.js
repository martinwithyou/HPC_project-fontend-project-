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
    '../footer/footerView',
    '../header/headerView',
    '../jobBar/jobBarView'
  ],
  function(Marionette, dashboard, resourceBarView, footerView, headerView, jobBarView) {
    'use strict';
    return Marionette.LayoutView.extend({
      template: dashboard,

      regions: {
        userDashboardHeader : '#header-wrapper',
        userResource : '#resource-wrapper',
        userJob : '#job-wrapper',
        userDashboardFooter : '#footer-wrapper'
      },

      onShow: function () {
        this.getRegion('userDashboardHeader').show(new headerView());
        this.getRegion('userResource').show(new resourceBarView());
        this.getRegion('userJob').show(new jobBarView());
        //setInterval(function(){ alert("Hello"); }, 3000);
        //this.getRegion('userDashboardFooter').show(new footerView());
      }
    });
  });