/* ===================================================================

 * common.js - 共通処理
 *
 * jQuery 2.1.1

======================================================================*/

(function($) {

	var App = {

		global: {},
		fn: {},
		ui: {},
		data: {}

	};
	window.js = App;

/*--------------------------------------------------------------------
 グローバル変数
----------------------------------------------------------------------*/

	App.global = {
	
	};

/*--------------------------------------------------------------------
 実行処理関数
----------------------------------------------------------------------*/

	App.fn = {

		/**
		 * API呼び出し共通関数
		 * param@ setting.url: APIのURL
		 * param@ setting.data: API呼び出しに必要なデータ
		 * param@ setting.callback: API呼び出し後のコールバック関数
		 */
		doCallApi: function(setting) {

			// APIからJSONデータを取得
			$.ajax({
				'type': 'GET',
				'url': setting.url,
				'dataType': 'json',
				'data': setting.data,
				'timeout': 300000,
				'success': function(data) {
					setting.callback(data);
				},
				'error': function() {
					return false;
				}
			});
		}

	};

/*--------------------------------------------------------------------
 UI処理関数
----------------------------------------------------------------------*/

	App.ui = {

		/**
		  * スムーススクロール
		  * param@ targetHref: アンカーパスID
		 **/
		smoothScroll: function(targetHref) {

			var href = targetHref;

			// 遷移先URLが#のみまたは空であれば先頭に
			var target = $(href === '#' || href === '' ? 'html' : href);
			var position = target.offset().top;

			// スクロール処理
			$('html, body').animate({
				scrollTop: position
			}, 500, 'swing');
		}

	};

/*--------------------------------------------------------------------
 データ変換処理関数
----------------------------------------------------------------------*/

	App.data = {

		/**
		  * 数値をカンマ区切りする
		  * 数値
		 **/
		doNumberDelimite: function(num) {

			return String(num).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
		},

		/**
		 * テキストがMAX文字数を超えた場合はトリミング
		 */
		trimDescription: function(str, maxCnt, more) {

			var descriptionText = str;
			var maxCnt = maxCnt;
			var judgeMoreView = more;

			var textCnt = descriptionText.length;

			// マックス文字数を超えていた場合
			if(textCnt > maxCnt) {
			var mainText = descriptionText.slice(0,maxCnt);
			var afterText = descriptionText.slice(maxCnt);

			var strText = [];
			strText.push(mainText);

			// moreアクションが必要ない場合は出力しない
			if(judgeMoreView == 'true' || judgeMoreView == true) {
				strText.push('<span class="dottedLine">&#46;&#46;&#46;</span>');
				strText.push('<span class="more" style="display: none">' + afterText + '</span>');
				strText.push('<a href="javascript:void(0);" class="viewMore">続きを見る</a>');
			} else {
				strText.push('<span class="dottedLine">&#46;&#46;&#46;</span>');
			}

			  var trimText = strText.join('');
			} else {
			  var trimText = descriptionText;
			}

			return trimText;
		}

	};

/*--------------------------------------------------------------------
 全ページ共通即時実行処理
----------------------------------------------------------------------*/

	/**
	  * 初期実行処理
	 **/
	var init = function() {

		/** pagetopボタンの表示処理 */
		btnPagetopView();

		/** スムーススクロール */
		$('a[href^="#"]').on('click', function() {
			App.ui.smoothScroll($(this).attr('href'));
		});

	};

	/**
	  * pagetopボタンの表示処理
	 **/
	var btnPagetopView = function() {

		var $win = $(window);
		var $linkPagetop = $('.globalFooter .btnPagetop');
		var viewSpeed = 150;

		// 初期は非表示
		$linkPagetop.hide();

		// スクロールイベント発生時のみ表示処理を実行
		$win.scroll(function() {
			var scrollTop = $('body').scrollTop();

			if(scrollTop > 0) {
				$linkPagetop.fadeIn(viewSpeed);
			} else {
				$linkPagetop.fadeOut(viewSpeed);
			}
		
		});

	};

	/** 初期実行処理 */
	init();

})(jQuery);