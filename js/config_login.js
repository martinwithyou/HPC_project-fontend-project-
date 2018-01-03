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
    jquery_ui : 'libs/jquery-ui/jquery-ui.min',
    bootstrap : 'libs/bootstrap/dist/js/bootstrap.min',
    underscore : 'libs/lodash/lodash.min',
    backbone : 'libs/backbone/backbone',
    marionette : 'libs/marionette/lib/backbone.marionette.min',
    hogan : 'libs/hogan/web/1.0.0/hogan.min',
    text : 'libs/requirejs-text/text',
    i18n : 'libs/requirejs-i18n/i18n',
    css : 'libs/require-css/css.min',
    metisMenu : 'libs/metisMenu/dist/metisMenu.min',
    datatables : 'libs/datatables/media/js/jquery.dataTables.min',
    cookie : 'libs/jquery.cookie/jquery.cookie',
    multiselect:'libs/bootstrap-multiselect/dist/js/bootstrap-multiselect',
    datatables_bootstrap : 'libs/datatables-plugins/integration/bootstrap/3/dataTables.bootstrap.min',
    dataTables_tableTools: 'libs/datatables-tabletools/js/dataTables.tableTools',
    elfinder : 'libs/elfinder/js/elfinder.min',
    elfinder_i18n : 'libs/elfinder/js/i18n/elfinder.zh_CN',
    chartjs: 'libs/chartjs/Chart',
    chartStackedBar: 'libs/chartjs/Chart.StackedBar',
    bootstrap_notify: 'libs/remarkable-bootstrap-notify/bootstrap-notify.min',
    resourceDoughnutWidget : 'widgets/doughnut/resourceDoughnutWidget',
    resourceBarWidget : 'widgets/barView/resourceBarWidget',
    jqueryJson:'libs/jquery-json/src/jquery.json',
    raphael: 'libs/raphael/raphael-min',
    morris: 'libs/morrisjs/morris.min'
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
    metisMenu : {
      deps : ['jquery']
    },
    datatables : {
      deps : ['jquery']
    },
    cookie : {
      deps : ['jquery']
    },
    dataTables_tableTools: {
      deps:['datatables']
    },
    datatables_bootstrap : {
      deps : ['datatables']
    },
    elfinder : {
      deps: ['jquery_ui', 'css!libs/elfinder/css/elfinder.full']
    },
    elfinder_i18n : {
      deps: ['elfinder']
    },
    bootstrap_notify : {
      deps:['jquery']
    },
    resourceDoughnutWidget : {
      deps : ['chartjs']
    },
    morris: {
      deps: ['jquery','raphael']
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
		'core/layout/login/loginView',
		'marionette',
		'hogan'
	],
	function (loginView, Marionette, Hogan) {
		'use strict';
		Marionette.Renderer.render = function(template, data) {
			return Hogan.compile(template).render(data);
		};
		var loginView=new loginView({el:"#wrapper"});
		loginView.render();
	});
