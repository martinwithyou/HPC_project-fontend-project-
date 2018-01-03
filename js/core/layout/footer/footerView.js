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
    "utils/constants/constants",
    'core/widgets/about/aboutView',
    'text!./templates/footerTmpl.mustache',
    'i18n!./nls/footer',
    'css!./css/footer'
  ],
  function(Marionette, urlConstants, constants, aboutView, footer, nls) {
    'use strict';
    return Marionette.ItemView.extend({
      template: footer,
      className: 'row ui-footer',

      templateHelpers: function () {
        return {
          nls: nls,
          constants: constants
        };
      },

      onShow: function () {
      	
        var footerXHR = $.ajax({
        	
          url: urlConstants.config,
          
          dataType: "json",
          
          contentType: "application/json"
          
        });

        footerXHR.done(function(data){
        	        	
            $("#footer-info").text(data.footer);
            
            $("#footer-info").attr("title", data.footer);
            
          }
        );

        $("#footer-about-hpc").on('click', function(event) {
        	
          var aboutDialog = new aboutView({
          	
              el:"#dialog-region"
              
            });
            
            aboutDialog.render();
          
        });
      }
    });
  });