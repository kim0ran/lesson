/* ===================================================================

 * common.js - 共通処理
 *
 * jQuery 2.1.1

======================================================================*/

(function($) {

	var fn = {

		global: {},
		ua: {},
		ui: {}

	};
	window.fn = fn;


/*--------------------------------------------------------------------
 グローバル変数
----------------------------------------------------------------------*/

	fn.global = {

		winHeight: $(this).height(),  // ウィンドウの高さ
		winWidth: parseInt($(this).width),  // ウィンドウの幅

		navHeight: $('#globalNav').outerHeight()  // グロナビの高さ

	};


/*--------------------------------------------------------------------
 ユーザエージェント判定
----------------------------------------------------------------------*/

	fn.ua = {

		/**
		 * ユーザエージェント判定(レスポンシブ用
		 */
		judge: function() {

			// bodyの幅が641px未満であればスマホ
			return fn.global.winWidth <= 768 ? 'sp' : 'pc';
		}

	};


/*--------------------------------------------------------------------
 UI処理関数
----------------------------------------------------------------------*/

	fn.ui = {

		/**
		 * スムーススクロール
		 * param@ href: アンカーパスID
		 */
		smoothScroll: function(href) {

			// 遷移先URLが#のみまたは空であれば先頭に
			var target = $(href === '#' || href === '' ? 'html' : href);
			var position = target != 'html' ? target.offset().top - fn.global.navHeight : 0;

			// スクロール処理
			$('html, body').animate({
				scrollTop: position
			}, 500, 'swing');
		},

		/**
		 * スクロール位置によってグロナビをfixedにする
		 */
		scrollFixed: function() {

			var $win = $(window);  // ウィンドウ要素
			var $nav = $('#globalNav');  // グロナビ要素

			// アンカー位置調整用の高さを算出
			var adjustHeight = (fn.global.navHeight*2)+(fn.global.winHeight/2);  // 引数：ナビの倍の高さとwindowの高さの半分

			// アンカー対象要素の位置を取得
			var anchorTopArray = [];
			for(var i=0; i<$nav.find('a').length; i++) {
				anchorTopArray.push($($nav.find('a').eq(i).attr('href')).offset().top - adjustHeight);
			}

			// 最後のアンカー対象要素の高さを追加
			anchorTopArray.push(anchorTopArray[i-1] + $($nav.find('a').eq(i-1).attr('href')).outerHeight());

			// グロナビの初期位置を取得
			var navOffsetTop = $nav.offset().top;

			// スクロール時の処理
			$win.scroll(function() {

				// scrollTopの取得方法がブラウザによって違うため、htmlとbody両方で取得
				var scrollTop;
				$.each($('html, body'), function() {
					var thisScrollTop = $(this).scrollTop();
					if(scrollTop != thisScrollTop && thisScrollTop > 0) scrollTop = thisScrollTop;
				});

				// スクロール位置によってグロナビをfixedにする
				$nav.css('position', scrollTop > navOffsetTop ? 'fixed' : 'relative');

				var ACTIVE_CLASS = 'active';  // アクティブクラス
				var $actived = $nav.find('.' + ACTIVE_CLASS);  // グロナビのアクティブ要素

				// 現在表示されているアンカー先を探してグロナビにアクティブクラスを付与
				var activeCnt;
				for(var i=0; i<anchorTopArray.length; i++) {
					if(scrollTop >= anchorTopArray[i] && scrollTop < anchorTopArray[i+1]) {
						activeCnt = i;
						break;
					}
				}
				if(!!$actived.length) $actived.removeClass(ACTIVE_CLASS);
				$nav.find('li').eq(activeCnt).addClass(ACTIVE_CLASS);

			});

		}

	};


/*--------------------------------------------------------------------
 即時処理
----------------------------------------------------------------------*/

	/**
	 * 処理実行
	 */
	var init = function() {

		// ヘッダの高さを算出して指定
		$('#globalHeader').height(fn.global.winHeight - fn.global.navHeight);

		/** PCのみススクロール位置によってグロナビをfixedにする */
		if(fn.ua.judge() == 'pc') fn.ui.scrollFixed();

		/** スムーススクロール */
		$('a[href^="#"]').on('click', function() {
			fn.ui.smoothScroll($(this).attr('href'));
		});

	};

	/** 処理実行 */
	init();

})(jQuery);
