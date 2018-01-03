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
        'text!./welcomeTmpl.mustache'
    ],
    function (Marionette, myTemplate) {
        'use strict';
        return Marionette.ItemView.extend({
            template: myTemplate,
        });
    });
