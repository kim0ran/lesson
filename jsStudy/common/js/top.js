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
		smoothScroll.init('a[href^="#"]', 500);

		// サイドバー
		ui.sidebar.init('.sidebar', '.btnNav', '.nav');

	};
	init();

})();