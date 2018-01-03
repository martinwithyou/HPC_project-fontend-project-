/*
 * © Copyright Lenovo 2015.
 *
 * LIMITED AND RESTRICTED RIGHTS NOTICE:
 *
 * If data or software is delivered pursuant a General Services Administration
 * "GSA" contract, use, reproduction, or disclosure is subject to
 * restrictions set forth in Contract No. GS-35F-05925.
*/
/*jshint -W117*/
require.config({
  baseUrl : '/static/js',
  config:{
	  i18n : {
		locale: "zh"
	  }
  },
  waitSeconds : 0,
  paths : {
    jquery : 'libs/jquery/dist/jquery.min',
    bootstrap : 'libs/bootstrap/dist/js/bootstrap.min',
    underscore : 'libs/lodash/lodash.min',
    backbone : 'libs/backbone/backbone',
    marionette : 'libs/marionette/lib/backbone.marionette.min',
    hogan : 'libs/hogan/web/1.0.0/hogan.min',
    text : 'libs/requirejs-text/text',
    i18n : 'libs/requirejs-i18n/i18n',
    css : 'libs/require-css/css.min',
    lib:'libs/3droom/lib',
    plotly : 'libs/plotly/plotly-gl3d.min'
  },
  deps : ['text', 'marionette', 'i18n'],
  map: {
      '*': {
        'css': 'libs/require-css/css'
      }
  },
  shim : {
    backbone : {
      deps : ['jquery', 'underscore']
    },
    marionette : {
      deps : ['backbone']
    },
    bootstrap : {
      deps : ['jquery']
    },
    hogan : {
      exports : 'Hogan'
    },
    plotly: {
	  exports : 'plotly'
	},
	lib:{
	  exports : 'lib'
	}
  }
});

requirejs.onError = function (err) {
	'use strict';
	console.log(err);
	console.log(err.requireType);
	console.log(err.requireModules);
};

requirejs([
        
		'marionette',
		'hogan',
		'customUI/monitor/widgets/threeDnodeRoom/nodeRoomView',
	],
	function ( Marionette, Hogan,nodeRoomView) {
		'use strict';
		Marionette.Renderer.render = function(template, data) {
			return Hogan.compile(template).render(data);
		};
		
		var nodeRoom=new nodeRoomView({el:"#wrapper"});
		
		    nodeRoom.render();
		
	});
