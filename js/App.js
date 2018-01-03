/*
 * © Copyright Lenovo 2015.
 *
 * LIMITED AND RESTRICTED RIGHTS NOTICE:
 *
 * If data or software is delivered pursuant a General Services Administration
 * "GSA" contract, use, reproduction, or disclosure is subject to
 * restrictions set forth in Contract No. GS-35F-05925.
*/
/*jshint -W031 */
define([
		'marionette',
		'backbone',
		'hogan',
		'util',
		'Router',
		'RegionManager',
		'utils/utils',
        'utils/constants/urlConstants'
	],
	function (Marionette, Backbone, Hogan, util,Router, RegionManager, utils, urlConstants) {
		'use strict';

		var router;

		var App = new Marionette.Application({
			initialize: function() {
				router = new Router();
			}
		});

		App.on('before:start', function () {
			Marionette.Renderer.render = function (template, data) {
				return Hogan.compile(template).render(data);
			};

		});

		App.on('start', function () {
			

			Backbone.history.start();
			$.ajaxSetup({ cache: false });
			var open = XMLHttpRequest.prototype.open;
      XMLHttpRequest.prototype.open = function (method, url) {
        // Only include the headers if this is a request that we want to include them in based on the url
        var lowerMethod = method.toLowerCase();
        if (lowerMethod === "post" || lowerMethod === "put" || lowerMethod === "delete") {
          var send = this.send;
          
          this.send = function () {
        	if($.cookie("confluentsessionid"))
        	{
        		this.setRequestHeader("confluentsessionid", $.cookie("confluentsessionid"));
        	}
            this.setRequestHeader("X-CSRFToken", $.cookie("csrftoken"));
            if (url === urlConstants.files) {
              this.setRequestHeader("Accept", "application/json");
            }
            send.apply(this, arguments);
          };
        }
        open.apply(this, arguments);
      };
      
      //启动async请求开始      
		function async_running() {
              console.log( "async请求已经启动");
         }
        
        startAsync(async_running.bind({username: 'demouser'}));
      //启动async请求结束      
            
      var isAdmin = false;
      if (window.location.hash.indexOf("admin") !== -1) {
        if ($.cookie("is_admin") === "True") {
          isAdmin = true;
        }
      }
			RegionManager.showHeader({"isAdmin": isAdmin});
			RegionManager.showFooter();
			//window.eventBus = _.extend({}, Backbone.Events);
			utils.startRefreshing();
		});

		App.router = router;
		window.App = App;


		return App;
	});