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
	'datatables',
	'datatables_bootstrap',
	'utils/constants/urlConstants',
	'utils/constants/constants',
	'utils/eventBus',
	'text!./templates/allNodesTmpl.mustache',
	'i18n!./nls/allNodes'
	],function(Marionette, datatables, datatables_bootstrap, urlConstants, constants, eventBus, template, nls){
		return Marionette.ItemView.extend({
			template:template,
			templateHelpers:function(){
				return {
					nls:nls
				};
			},

			ui:{
				allNodesTable:'#allNodesTable'
			},


			onDestroy: function(){
		    // custom cleanup or destroying code, here
		       $("body").css("background-color", "#F6F6F4");
		  },

			onRender:function(){
				
				 $("body").css("background-color", "#ffffff");
			}

			
		});
	});