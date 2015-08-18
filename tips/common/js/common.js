/* ===================================================================

 * common.js - 共通処理
 *
 * jQuery 2.1.1

======================================================================*/

(function($) {

	var App = {

		ua: {},
		api: {},
		ui: {},
		conv: {}

	};
	window.fn = App;


/*--------------------------------------------------------------------
 ユーザエージェント判定
----------------------------------------------------------------------*/

	App.ua.name		 = window.navigator.userAgent.toLowerCase();

	App.ua.isIE		 = (App.ua.name.indexOf('msie') >= 0 || App.ua.name.indexOf('trident') >= 0);
	App.ua.isiPhone	 = App.ua.name.indexOf('iphone') >= 0;
	App.ua.isiPod	 = App.ua.name.indexOf('ipod') >= 0;
	App.ua.isiPad	 = App.ua.name.indexOf('ipad') >= 0;
	App.ua.isiOS	 = (App.ua.isiPhone || App.ua.isiPod || App.ua.isiPad);
	App.ua.isAndroid = App.ua.name.indexOf('android') >= 0;
	App.ua.isTablet	 = (App.ua.isiPad || (App.ua.isAndroid && App.ua.name.indexOf('mobile') < 0));
	App.ua.isPc		 = (!App.ua.isiPhone && !App.ua.isiPad && !App.ua.isiPod && !App.ua.isAndroid);

	// 各バージョン判定
	if (App.ua.isIE) {
		App.ua.verArray = /(msie|rv:?)\s?([0-9]{1,})([\.0-9]{1,})/.exec(App.ua.name);
		if (App.ua.verArray) App.ua.ver = parseInt(App.ua.verArray[2], 10);
	}
	if (App.ua.isiOS) {
		App.ua.verArray = /(os)\s([0-9]{1,})([\_0-9]{1,})/.exec(App.ua.name);
		if (App.ua.verArray) App.ua.ver = parseInt(App.ua.verArray[2], 10);
	}
	if (App.ua.isAndroid) {
		App.ua.verArray = /(android)\s([0-9]{1,})([\.0-9]{1,})/.exec(App.ua.name);
		if (App.ua.verArray) App.ua.ver = parseInt(App.ua.verArray[2], 10);
	}

	App.ua = {

		/**
		 * ユーザエージェント判定(レスポンシブ用
		 */
		judge: function() {

			// bodyの幅が641px未満であればスマホ
			return $('body').outerWidth() < 641 ? 'sp' : 'pc';
		}

	}


/*--------------------------------------------------------------------
 API処理関数
----------------------------------------------------------------------*/

	App.api = {

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
/*
	var doApiSetting = {
		url: '/data/data.do',       // ★APIファイルパス
		callback: setContents,  // ★読み取り後の実行関数
		data: {
			'id': 'sample'
		}
	};
	doCallApi(doApiSetting);
*/


/*--------------------------------------------------------------------
 UI処理関数
----------------------------------------------------------------------*/

	App.ui = {

		/**
		 * スムーススクロール
		 * param@ targetHref: アンカーパスID
		 */
		smoothScroll: function(targetHref) {

			var href = targetHref;
			var scrollSpeed = 500;

			// 遷移先URLが#のみまたは空であれば先頭に
			var target = $(href === '#' || href === '' ? 'html' : href);
			var position = target.offset().top;

			// スクロール処理
			$('html, body').animate({
				scrollTop: position
			}, scrollSpeed, 'swing');
		},

		/**
		 * 画像マウスオーバー時の画像ファイル名を変換
		 * param@ $targetNode マウスオーバーした要素
		 */
		imageRollover: function($targetNode) {

			var $this = $targetNode;

			// 画像パスを取得して分解、画像ファイル名のみを取得
			var imgSrc = $this.attr('src');
			var imgPath = imgSrc.split('/');
			var imgFile = imgPath[imgPath.length -1];

			// 画像ファイル名に_onがなければ追加、あれば削除
 			var imgReplacedFile = (imgFile.indexOf('_on') == -1) ? imgSrc.replace(/(\.)(gif|jpg|png)/i, '_on$1$2') : imgSrc.replace(/(\_on)(.)(gif|jpg|png)/i, '$2$3');

			// 変換した画像パスをsrc属性に代入
			$this.attr('src', imgReplacedFile);

			return false;
		},

		/**
		 * アコーディオン
		 */
		accordion: function() {

			var $acdHead = $('.acdHead');  // クリック要素
			var $acdBody = $('.acdBody');  // 開閉要素

			// クリック要素と開閉要素が存在する場合に処理を実行
			if(!!$acdHead.length && !!$acdBody.length) {

				var OPENED_CLASS = 'opened';  // 開閉要素が開いている時にクリック要素に付与するクラス名

				// クリック要素のカーソルをポインターに
				$acdHead.css('cursor', 'pointer');

				// 初期処理はクラスが付与されていない本体を非表示
				$acdHead.not('.' + OPENED_CLASS).next($acdBody).hide();

				// ボタンクリック時の処理
				$acdHead.on('click', function() {

					var $this = $(this);

					// クラス付与、削除の切り替え
					$this.toggleClass(OPENED_CLASS);

					// 本体の表示、非表示の切り替え
					$this.next($acdBody).slideToggle();
				});

			}
		},

		/**
		 * タブ連動コンテンツ
		 */
		tabContents: function() {

			var $tabNav = $('.tabNav');
			var ACTIVE_CLASS = 'active';

			// 一度全てのコンテンツを非表示
			for(var i=0; i<$tabNav.find('a').length; i++) {
				$($tabNav.find('a').eq(i).attr('href')).hide();
			}

			// タブクリック処理
			$tabNav.find('li a').off('click').on('click', function() {

				var $this = $(this);
				var $target = $($this.attr('href'));

				// 表示中のコンテンツを非表示にしてクラスを削除
				var $actived = $tabNav.find('.' + ACTIVE_CLASS);
				$($actived.find('a').attr('href')).hide();
				$actived.removeClass(ACTIVE_CLASS);

				// クリックしたタブにクラスを付与
				$this.parent('li').addClass(ACTIVE_CLASS);
				// 対象のコンテンツを表示
				$target.show();

				return false;
			});

			// 初期表示処理
			if(!$tabNav.find('.' + ACTIVE_CLASS).length) {

				// パラメータ値があればパラメータ値と同じ属性値のコンテンツを表示
				$tabNav.find('a:first').click();
			}

		},

		/**
		 * ソースコードをエディタ風UIに変換
		 */
		sourceEditer: function() {

			var replaceCnt = '';  // インデント文字数
			var commenting = false;  // コメント中かの判定用変数

			/**
			 * HTMLを生成してセット
			 */
			var setSource = function() {

				$('.source').each(function() {

					var $this = $(this);
					var $code = $this.find('code');

					// インデント文字数用変数、コメント中判定変数をリセット
					replaceCnt = '';
					commenting = false;

					// ターゲット要素と同要素が入っていた場合は処理を行わない
					if($this.parent().get(0).tagName == 'CODE') return;

					// HTMLを取得して改行毎に分割
					var code = $code.html().replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').split('\n');

					// ソースを生成
					var source = [];
					source.push('<div class="sourceCode">');
					source.push('	<p class="codeInfo">VIEW SOURCE EDITER</p>');
					source.push('	<ol class="codeBody">');

					// 分解したソースをHTML化するループ処理
					for(var i=0; i<code.length; i++) {

						// 最初、最後が空の場合は削除
						var ifFirstBreak = i==0 && code[i] == '';
						var ifLastBreak = i==code.length-1 && code[i].indexOf('\t') > -1;
						if(!ifFirstBreak && !ifLastBreak) {

							var text = code[i];

							// 1行目のインデントの文字数を取得
							if(replaceCnt == '') {

								replaceCnt = 0;

								// スペース、タブ以外の文字列までをインデントとして数えるループ処理
								forReplaceCnt:
								for(var cnt=0; cnt<text.length; cnt++) {

									var firstText = text[cnt];

									if(firstText == ' ') replaceCnt += 6;  // 半角スペースは「&nbsp;」1コ分
									if(firstText == '　') replaceCnt += 12;  // 半角スペースは「&nbsp;」2コ分
									if(firstText == '	') replaceCnt += 24;  // 半角スペースは「&nbsp;」4コ分

									// 文字列になったらループを抜ける
									if(firstText != ' ' && firstText != '　' && firstText != '	') break forReplaceCnt;
								}
							}

							// テキストをエスケープ
							text = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

							// スペース、タブを半角スペースの特殊文字コードに変換
							text = text.replace(/ /g, '&nbsp;').replace(/　/g, '&nbsp;').replace(/	/g, '&nbsp;&nbsp;&nbsp;&nbsp;');

							// 1行コメントをspanで囲う
							if(text.indexOf('//') > -1 && text.indexOf('&#39;//&#39;') < 0) {
								var cmt = text.split('//');
								text = cmt[0] + '<span class="comment">';
								for(var cnt=1; cnt<cmt.length; cnt++) {
									text += '//' + cmt[cnt];
								}
								text += '</span>';
							}

							/** 複数行コメントをspanで囲う */
							if(text.indexOf('&lt;!--') > -1 || text.indexOf('/*') > -1 || commenting == true) text = commentOut(text);

							// 配列に格納
							source.push('		<li>' + text.slice(replaceCnt) + '</li>');
						}
					}
					source.push('	</ol>');
					source.push('</div>');

					// インデント文字数用変数をリセット
					replaceCnt = '';

					// codeタグを削除して、生成したHTMLをセット
					$code.remove();
					$this.append(source.join('')).promise().done(function() {

						// 奇数、偶数行にクラスを付与
						$this.find('.codeBody li:even').addClass('even');
						$this.find('.codeBody li:odd').addClass('odd');
					});

				});
			};

			/**
			 * 複数行コメントをspanで囲う
			 */
			var commentOut = function(str) {

				var string = str;

				// 含まれる文字列で、コメント開始と終了を変更
				var commentStart = '&lt;!--',
					commentEnd = '--&gt;';
				if(string.indexOf(commentStart) < 0 || string.indexOf(commentEnd) < 0) {
					commentStart = '/*';
					commentEnd = '*/';
				}

				// コメント開始箇所に開始タグを挿入
				if(string.indexOf(commentStart) > -1 && string.indexOf('&#39;' + commentStart + '&#39;') < 0) {

					var cmt = string.split(commentStart);
					string = cmt[0] + '<span class="comment">' + commentStart + cmt[1];

					// 同じ行にコメント終了なければ、行全体をspanで囲う
					if(string.indexOf(commentEnd) < 0) {
						string = string + '</span>';
						commenting = true;
					}

				} else if(commenting == true) {

					// コメント中であれば全文をspanで囲う
					var cmt0 = string.slice(0, replaceCnt);
					var cmt1 = string.slice(replaceCnt);
					string = cmt0 + '<span class="comment">' + cmt1 + '</span>';
				}

				// コメント終了箇所に終了タグを挿入
				if(string.indexOf(commentEnd) > -1 && string.indexOf('&#39;' + commentEnd + '&#39;') < 0) {

					var cmt = string.split(commentEnd);
					string = cmt[0] + commentEnd + '</span>' + cmt[1];
					commenting = false;
				}

				// 変換した文字列を返す
				return string;
			};

			/** HTMLを生成してセット */
			setSource();
		},

		/**
		 * クロスフェード
		 * param@ $node: 対象要素
		 */
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


/*--------------------------------------------------------------------
 データ処理処理関数
----------------------------------------------------------------------*/

	App.conv = {

		/**
		 * ゼロ埋め
		 * param@ num: 数字
		 * param@ len: 出力文字数
		 */
		zeroPadding: function(num, len) {

			// 数字の文字数
			var numLen = String(num).length;

			// 数字の文字数が出力文字数より少なければ処理を実行
			if(numLen < len) {

				// 足りない文字カウント分'0'を追記
				var addZero = '';
				for(var i=0; i<(len - numLen); i++) {
					addZero = addZero + '0';
				}
				num = (addZero + num);
			}

			return num;
		},

		/**
		  * 数値をカンマ区切りする
		  * param@ num: 数値
		 **/
		doNumberDelimite: function(num) {

			return String(num).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
		},

		/**
		 * 年月日の文字列をタイムゾーンに変換
		 * param@ timeData: 文字列
		 */
		formatTimezoon: function(timeData) {

			// 数字以外の文字列が含まれていた場合は文字列をそのまま返す
			if(isNaN(Number(timeData)) == true || timeData == undefined || timeData == 'undefined') return timeData;

			// 文字列に変換
			var getStr = String(timeData);

			// 変換フォーマット
			var timeFormat = 'yyyymmddHHMMSSFFF';

			// 初期値
			var year = 1990, month = 01, date = 01;
			var hour = '00', minute = '00';
			var second = '00', millisecond = '000';

			// 文字列を変換フォーマットに変換
			var set;
			set = timeFormat.indexOf('yyyy');
			if(set > -1) year = getStr.substr(set, 4);

			set = timeFormat.indexOf('mm');
			if(set > -1) month = Number(getStr.substr(set, 2)) - 1;

			set = timeFormat.indexOf('dd');
			if(set > -1) date = getStr.substr(set, 2);

			set = timeFormat.indexOf('HH');
			if(set > -1) hour = getStr.substr(set, 2);

			set = timeFormat.indexOf('MM');
			if(set > -1) minute = getStr.substr(set, 2);

			set = timeFormat.indexOf('SS');
			if(set > -1) second = getStr.substr(set, 2);

			// タイムゾーンに変換して返す
			return new Date(year, month, date, hour, minute, second, millisecond);
		},

		/**
		 * 文字列を年月日のフォーマットに変換
		 * param@ timeData: 文字列
		 */
		timeFormatString: function(timeData) {

			/** 年月日の文字列をタイムゾーンに変換 */
			var newData = App.conv.formatTimezoon(timeData);

			// 曜日の表示文字列を設定
			var week = ['日', '月', '火', '水', '木', '金', '土'];

			// 分解した年月日を結合
			var rtnStr = [];
			rtnStr.push(newData.getFullYear() + '年');
			rtnStr.push((newData.getMonth() + 1) + '月');
			rtnStr.push(newData.getDate() + '日');
			//rtnStr.push('（' + week[newData.getDay()] + '）'); // 曜日

			return rtnStr.join('');
		},

		/**
		 * 現在と最終日の日数差を表示
		 */
		countdown: function(str) {


			var $countdown = $('.countdown');  // 親要素
			var $target = $countdown.find('[date-time]');  // 表示要素
//
//			/** 最終日を取得してタイムゾーンに変換 */
//			var last = App.conv.formatTimezoon($target.attr('date-time').replace(/-/g, ''))

			var last = str.split('-');

			// 現在の日付を取得
			var today = new Date();

//			// 月から1を引いて再定義
//			last = new Date(last.getFullYear(), last.getMonth()-1, last.getDate())
//			today = new Date(today.getFullYear(), today.getMonth()-1, today.getDate());
//
//			// 最終日と現在の差をミリ秒から計算
//			var diffCnt = (last - today) / ((24*60)*60*1000);
//
//			// 残り日数に置き換え
//			$target.text(diffCnt).removeAttr('date-time');


		}

	};


/*--------------------------------------------------------------------
 即時実行処理
----------------------------------------------------------------------*/

	/**
	 * 初期実行処理
	 */
	var init = function() {

		/** ソースコードをエディタ風UIに変換 */
		if(!!$('.source').length) App.ui.sourceEditer();

		/** アコーディオン */
		if(!!$('.acdHead').length && !!$('.acdBody').length) App.ui.accordion();

		/** タブ連動コンテンツ */
		App.ui.tabContents();

		/** 現在と最終日の日数差を表示 */
		if(!!$('.countdown').length) App.conv.countdown('2015-06-20');

		/** クロスフェード */
		App.ui.crossfade($('.crossfade'));

		/** 画像マウスオーバー時の画像ファイル名変換 */
		$('.btn').hover(function() {
			App.ui.imageRollover($(this));
		}, function() {
			App.ui.imageRollover($(this));
		});

		/** スムーススクロール */
		$('a[href^="#"]').on('click', function() {
			if($(this).parents('ul').hasClass('tabNav') == false) App.ui.smoothScroll($(this).attr('href'));
		});

	};

	/** 初期実行処理 */
	init();

})(jQuery);
