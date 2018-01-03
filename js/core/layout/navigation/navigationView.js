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
    'metisMenu',
    'text!./templates/navigationTmpl.mustache',
    'i18n!nls/hpc'
  ],
  function(Marionette, metisMenu, navigation, nls) {
    'use strict';
    return Marionette.ItemView.extend({
      template: navigation,

      ui: {
        sideMenu: '#side-menu'
      },

      templateHelpers: function () {
        return {
          nls: nls
        };
      },

      onShow: function () {
        this.ui.sideMenu.metisMenu({toggle: false});
        this.$('#allNodes').click(function(event) {
          event.preventDefault();
          window.location.href = "#nodes";
        });
      },
    });
  });