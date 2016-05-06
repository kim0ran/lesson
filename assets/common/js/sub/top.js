/*--------------------------------------------------------------------
 top.js
----------------------------------------------------------------------*/

(function() {

	var global = APP.global;
	var fn = APP.fn;
	var ui = APP.ui;
	var utils = APP.utils;
	var views = APP.views;

	/**
	 * 初期処理
	 */
	var pageInit = function() {

		/* トップ */
		var pageView = new PageView();
		pageView.init('#PageView');

	};

	/**
	 * トップ
	 */
	var PageView = (function() {
		var constructor = function() {
			return this;
		};
		var proto = constructor.prototype = new views.PageView();
		proto.render = function() {

			views.PageView.prototype.render.apply(this);
			return this;
		};
		return constructor;
	})();

/* 初期処理 */
pageInit();

})();
