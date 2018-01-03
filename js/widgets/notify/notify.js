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
  'bootstrap_notify',
  'css!/static/js/libs/animate.css/animate.css'
  ],
  function (bootstrap_notify) {
    'use strict';

    var notify = {};

    var defaultSettings = {
      allow_dismiss: true,
      placement: {
        from: "bottom",
        align: "right"
      },
      animate: {
        enter: 'animated zoomInUp',
        exit: 'animated zoomOutDown'
      },
      delay: 2000,
      offset: {
        x: 0,
        y: 30
      }
    };

    notify.warn = function(message, settings) {
      var warnSettings = $.extend({}, defaultSettings, settings, {type: "warning"});
      $.notify({
        // options
        icon: 'glyphicon glyphicon-warning-sign',
        message: message
      }, warnSettings);
    };

    notify.success = function(message, settings) {
      var errorSettings = $.extend({}, defaultSettings, settings, {type: "success"});
      $.notify({
        // options
        icon: 'glyphicon glyphicon-ok',
        message: message
      }, errorSettings);
    };

    notify.info = function(message, settings) {
      var infoSettings = $.extend({}, defaultSettings, settings, {type: "info"});
      $.notify({
        // options
        icon: 'glyphicon glyphicon-ok',
        message: message
      }, infoSettings);
    };

    notify.danger = function(message, settings) {
      var dangerSettings = $.extend({}, defaultSettings, settings, {type: "danger"});
      $.notify({
        // options
        icon: 'glyphicon glyphicon-remove-sign',
        message: message
      }, dangerSettings);
    };

    return notify;
  });