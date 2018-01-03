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
	'text!./templates/progressModalTmpl.mustache'
	],function(Marionette,template){
	'use strict';
	return Marionette.ItemView.extend({
		template:template,

		onRender:function(){
			$('#progressModal').modal('show');
		}
	});	
});