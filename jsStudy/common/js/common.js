/*--------------------------------------------------------------------
 common_global.js
----------------------------------------------------------------------*/
(function(window, undefined) {

	var App = {
		fn: {},
		ui: {},
		utils: {}
	};
	window.APP = App;

})(window);

/*--------------------------------------------------------------------
 common_fn.js
----------------------------------------------------------------------*/
(function(App, window, decument, undefined) {

	App.fn = {

// TODO:イッコでも書いて実行したい

	};

})(APP, window, document);
/*--------------------------------------------------------------------
 common_ui.js
----------------------------------------------------------------------*/
(function(App, window, decument, undefined) {

	App.ui = {

		// スムーススクロール
		smoothScroll: function() {
			var $el = {};
			var scrollSpeed = 500;
			var init = function(el) {
				$el = $(el);
				setEvents();
				return this;
			};
			var pageAnimateScroll = function(that) {
				var href = $(that).attr('href');
				var $target = $(href === '#' || href === '' ? 'html' : href);
				var position = $target.offset().top;
				$('html, body').animate({
					scrollTop: position
				}, scrollSpeed, 'swing');
				return this;
			};
			var setEvents = function() {
				$el.on('click', function() {
					pageAnimateScroll(this);
				});
				return this;
			};
			return {init: init};
		},

		// サイドバー表示・非表示
		sidebarAccordion: function() {
			var $sidevar = {};
			var $btn = {};
			var sidebarWidth = {};
			var isOpened = true;
			var set = function(sidebar, btn) {
				init(sidebar, btn);
				setEvents();
				return this;
			};
			var init = function(sidebar, btn) {
				$sidebar = $(sidebar);
				$btn = $(btn);
				sidebarWidth = $sidebar.outerWidth();
				$sidebar.css('right', -sidebarWidth);
				isOpened = false;
				return this;
			};
			var sidebarAnimateView = function() {
				$sidebar.animate({ right: isOpened ? -sidebarWidth : 0 });
				isOpened = isOpened ? false : true;
				return this;
			};
			var setEvents = function() {
				$btn.off('click').on('click', function() {
					sidebarAnimateView();
				});
				return this;
			};
			return {set: set};
		},

		// スクロール時にナビゲーションの位置を固定
		sidebarScrollFixed: function() {
			var $el = {};
			var $wrap = {};
			var scrollTop = {};
			var defaultOffsetTop = {};
			var set = function(el, wrap) {
				$el = $(el);
				$wrap = $(wrap);
				init();
				setEvents();
				return this;
			};
			var init = function() {
				defaultOffsetTop = $el.offset().top;
				wrapHeight = $wrap.outerHeight() + defaultOffsetTop;
				return this;
			};
			var scrollFixed = function() {
				scrollTop = $('body').scrollTop();
				var inRanged = (scrollTop > defaultOffsetTop && scrollTop < wrapHeight) ? true : false;
				$el.css('top', inRanged ? scrollTop - defaultOffsetTop : 0);
				return this;
			};
			var setEvents = function() {
				$(window).scroll(function() {
					scrollFixed();
				});
				return this;
			};
			return {set: set};
		}

	};

})(APP, window, document);
/*--------------------------------------------------------------------
 common_utils.js
----------------------------------------------------------------------*/
(function(App, window, decument, undefined) {

	App.utils = {

		// クロスフェード TODO:きれいにして実行
		crossfade: function($node) {

			var $wrap, $view, $thumb;  // 要素用変数
			var viewLen;  // 要素の数

			var fadeSpeed = 1500;  // アニメーションスピード
			var switchSpeed = 4000;  // 切り替わるまでのスピード
			var ACTIVE_CLASS = 'active';  // サムネイルに付与するアクティブクラス

			/**
			 * 初期処理
			 */
			var initial = function() {

				$view = $node.children();  // 子要素
				viewLen = $view.length;  // 要素の数

				// 対象要素に新たな親要素を作成
				$node.wrapAll('<div id="crossfadeWrap"></div>');

				$wrap = $('#crossfadeWrap');  // 親要素

				// 親要素にCSSを追加
				$wrap.css({
					position: 'relative',
					width: $view.outerWidth(),
					height: $view.outerHeight()
				});

				// 子要素にCSSを追加
				$view.css({
					position: 'absolute',
					top: 0,
					left: 0,
					opacity: 0
				}).eq(0).css({
					opacity: 1
				});

				// サムネイルを作成
				var thumb = [];
				thumb.push('<ul id="crossfadeThumb">');
				for(var i=0; i<viewLen; i++) {

					var num = i+1;  // ID用番号

					// 各子要素にIDを付与
					$view.eq(i).attr('id', 'crossfadeNum' + num);

					// アンカーに各子要素のIDを付与したサムネイルを作成
					thumb.push('<li><a href="#crossfadeNum' + num + '">●</a></li>');
				}
				thumb.push('</ul>');

				// 作成したサムネイルHTMLを結合して親要素内に追加
				$wrap.append(thumb.join('')).promise().done(function() {

					$thumb = $('#crossfadeThumb');  // サムネイル要素
					$thumb.children(':first-child').addClass(ACTIVE_CLASS);
				});

			};

			/**
			 * クロスフェード処理
			 * param@ str: 処理ストップ = 'stop'
			 */
			var setCrossfadeFn;
			var crossfadeFn = function(str) {

				if(str != 'stop') {

					// 処理スタート
					setCrossfadeFn = setInterval(function() {

						// 表示中のインデックス番号、次のインデックス番号を取得
						var INDEX_NUM = $thumb.find('.' + ACTIVE_CLASS).index();
						var NEXT_NUM = (INDEX_NUM+1 > viewLen-1) ? 0 : INDEX_NUM+1;

						// 次の要素を表示
						$view.eq(INDEX_NUM).animate({ opacity: 0 }, fadeSpeed);
						$view.eq(NEXT_NUM).animate({ opacity: 1 }, fadeSpeed);

						// 表示要素の対象サムネイルにアクティブクラスを付与
						$thumb.find('.' + ACTIVE_CLASS).removeClass(ACTIVE_CLASS);
						$thumb.find('li').eq(NEXT_NUM).addClass(ACTIVE_CLASS);

					}, switchSpeed);

				} else {

					// 処理ストップ
					clearInterval(setCrossfadeFn);
				}
			};

			/** 初期処理 */
			initial();

			/** クロスフェード処理 */
			crossfadeFn();

			// サムネイルクリック時の処理
			$thumb.find('a').off().on('click', function() {

				// クロスフェード処理を一時ストップ
				crossfadeFn('stop');

				var $this = $(this);
				var $target = $($this.attr('href'));

				// 表示切り替え
				$view.eq($thumb.find('.' + ACTIVE_CLASS).index()).animate({ opacity: 0 }, fadeSpeed);
				$target.animate({ opacity: 1 }, fadeSpeed, 'swing', function() {

					// クロスフェード処理を再開
					crossfadeFn();
				});

				// サムネイルのアクティブクラスを入れ替え
				$thumb.find('.' + ACTIVE_CLASS).removeClass(ACTIVE_CLASS);
				$this.parent('li').addClass(ACTIVE_CLASS);
			});

		}

	};

})(APP, window, document);
