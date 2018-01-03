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
	'utils/constants/constants',
	'utils/constants/urlConstants',
	'text!./templates/aboutTmpl.mustache',
	'i18n!./nls/about',
	'css!./css/about'
	],function(Marionette, constants, urlConstants, template, nls){
		'use strict';

		return Marionette.ItemView.extend({
			template: template,

			templateHelpers: function(){
				return {
					nls: nls,
					constants: constants
				};
			},

			onRender: function(){
				$('#about-dialog').modal({
					keyboard:true,
					backdrop:'static'
				});
			}
		});
});