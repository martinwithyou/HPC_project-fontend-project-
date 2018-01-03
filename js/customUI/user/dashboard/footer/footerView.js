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
    'utils/constants/urlConstants',
    'text!./templates/footerTmpl.mustache',
    'css!./css/footerView'
  ],
  function(Marionette, urlConstants, dashboardFooter) {
    'use strict';
    return Marionette.ItemView.extend({
      template: dashboardFooter,

      onShow: function () {
        var footerXHR = $.ajax({url: urlConstants.config});
        footerXHR.done(function(data){
          $("#userFooter").text(data.footer);
        }
        );
      }
    });
  });