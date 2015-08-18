/*--------------------------------------------------------------------
 top.js
----------------------------------------------------------------------*/
(function() {

	var fn = APP.fn;
	var ui = APP.ui;
	var utils = APP.utils;

	var init = function() {

		// スムーススクロール
		var smoothScroll = new ui.smoothScroll();
		smoothScroll.init('a[href^="#"]');

		// サイドバー表示・非表示
		var sidebarAccordion = new ui.sidebarAccordion();
		sidebarAccordion.set('.sidebar', '.btnNav');

		// スクロール時にナビゲーションの位置を固定
		var sidebarScrollFixed = new ui.sidebarScrollFixed();
		sidebarScrollFixed.set('.nav', '.sidebar');

	};
	init();

})();