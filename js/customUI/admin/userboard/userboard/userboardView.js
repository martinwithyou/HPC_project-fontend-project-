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
    'text!./templates/userboardTmpl.mustache',
    'customUI/userManagement/userManagementView',
    'customUI/groupManagement/userGroupView',
    'customUI/accountingManagement/accountingMgtView',
    'i18n!./nls/userboard',
    'css!./css/userboardView'
  ],
  function(Marionette, userboard, userManagementView, userGroupView, accountingMgtView, nls) {
    'use strict';
    return Marionette.LayoutView.extend({
      className: 'clearfix admin-users',

      template: userboard,

      templateHelpers:function(){
        return {
          nls:nls
        };
      },

      regions: {
        adminDashboardCluster : '#admin-cluster-wrapper',
        adminDashboardResource : '#admin-resource-wrapper',
        adminDashboardJobNode : '#admin-job-node-wrapper'
      },

      initialize: function(options){
         this.currentView = options.currentView;
      },

      onShow: function () {
        var self = this;

        if (this.currentView === "usersManagement") {
          self.changeView($(".admin-users-users-mgt"), userManagementView);
         
        }
        else if (this.currentView === "accountingManagement") {
          self.changeView($(".admin-users-accounting-mgt"), accountingMgtView);
        }
        else {
          self.changeView($(".admin-users-groups-mgt"), userGroupView);
        }

        $(".admin-users").css("background-color", "white");
        $("body").css("background-color", "#ffffff");
//      $(".admin-users-nav").css("height", document.body.scrollHeight - 60);
//      $(window).resize(function(){
//        if ($(".admin-users-nav").length > 0) {
//          $(".admin-users-nav").css("height", document.body.scrollHeight - 60);
//        }
//      });

      },

      changeView: function(nav, containter) {
        nav.css("background-color", "white");
        var containerView = new containter({el: $("#admin-users-container")});
        containerView.render();
      }
    });
  });