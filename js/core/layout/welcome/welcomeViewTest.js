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
		'./WelcomeView'
	],
	function (WelcomeView) {

		describe('WelcomeView', function () {

			var view;

			beforeEach(function () {
				view = new WelcomeView();
			});

			it('should exist', function () {
				WelcomeView.should.exist;
			});

			it('should render an h1 element', function () {
				view.render();
				view.$el.should.have.descendants('h1');
			});
		});
	});