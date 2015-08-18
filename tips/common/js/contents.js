/* ===================================================================

 * contents.js - コンテンツページ処理
 *
 * jQuery 2.1.1

======================================================================*/

$(function() {

	/**
	 * 実行処理
	 */
	var contentsInit = function() {

		/** タブをクリック時にサイドバーを表示 */
		sidebarView();

		/** スクロール時にコンテンツ一覧の位置を固定 */
		sidenavFixed();

		/** ゼロ埋め */
		$('.conv-sample .cnt').text(fn.conv.zeroPadding($('.conv-sample .cnt').text(), 3));

	};


/*--------------------------------------------------------------------
 実行関数
----------------------------------------------------------------------*/

	/**
	 * タブをクリック時にサイドバーを表示
	 */
	var sidebarView = function() {

		var $sidebar = $('#sidebar');
		var $nav = $('#nav ul');
		var sidebarWidth = $sidebar.outerWidth();

		// 初期時は非表示
		$sidebar.css('right', 0 - sidebarWidth);

		// アニメーション中は処理は行わない
		if($sidebar.is(':animated') == false) {

			// タブマウスオーバー時の処理
			$('#navTitle').off('click');
			$('#navTitle').on('click', function() {

				// PCの場合
				$nav.show();
				var setRight = (Number($sidebar.css('right').slice(0,-2)) < 0) ? 0 : 0 - sidebarWidth;
				$sidebar.animate({ right: setRight });

			});

		}

	};

	/**
	 * スクロール時にコンテンツ一覧の位置を固定
	 */
	var sidenavFixed = function() {

		var $nav = $('#nav');
		var defaultTop = $nav.offset().top;
		var sidebarHeight = $('#sidebar').outerHeight() + defaultTop;

		// スクロール時の処理
		$(window).scroll(function() {

			var scrollTop = $('body').scrollTop();

			// スクロール位置によっての数値を算出
			var setTop = (scrollTop > defaultTop && scrollTop < sidebarHeight) ? scrollTop - defaultTop : 0;

			// CSSで指定
			$nav.css('top', setTop);

		});

	};

	/** 初期処理 */
	contentsInit();

});
