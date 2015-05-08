/* ===================================================================

 * map.js - Google Maps
 *
 * jQuery 1.11.0
 * Google Maps JavaScript API V3
 * http://www.ajaxtower.jp/googlemaps/

======================================================================*/

$(function() {

	var gmap = {};
	var fn = {};

/*--------------------------------------------------------------------
 グローバル変数
----------------------------------------------------------------------*/

	var map;
	var mapOffsetTop;
	var nowAreaCnt;
	var infowindow;
	var areaArray = [];


/*--------------------------------------------------------------------
 地図処理関数
----------------------------------------------------------------------*/

	gmap = {

		/**
		 * Mapクラスを設定
		 * param@ x: 中心X座標
		 * param@ y: 中心Y座標
		 */
		loadMap: function(x, y, str) {

			// 各引数に何も入っていない場合
			if(typeof str == 'undefined') {

				// 最初の要素から取得
				var $target = $('#contents section:first-child');
				str = $target.find('h2').text();

				// 引数x、yに各座標が入っていない場合
				if((x == '' || x == undefined) && (y == '' || y == undefined)) {
					x = $target.attr('data-x');
					y = $target.attr('data-y');
				}
			}

			// 表示オプション設定
			var opts = {
				zoom: 12,
				navigationControl: false,
				center: new google.maps.LatLng(y, x),
				mapTypeId: google.maps.MapTypeId.ROADMAP,
				mapTypeControl: false
			};

			// GoogleMapを要素内に表示
			var $mapArea = $('#mapViewArea .mapView');
			map = new google.maps.Map($mapArea.get(0), opts);

			/** 吹き出し表示 */
			gmap.setBalloon(x, y, str);
			gmap.setMarker(x, y);
		},

		/**
		 * 指定座標への移動
		 * param@ x: X座標
		 * param@ y: Y座標
		 */
		panMap: function(x, y, str) {

			// 座標の移動
			map.panTo(new google.maps.LatLng(y, x));

			/** 吹き出し表示 */
			gmap.setBalloon(x, y, str);
			gmap.setMarker(x, y);

		},

		/**
		 * 吹き出し表示
		 */
		setBalloon: function(x, y, str) {

			// 表示中の吹き出しを閉じる
			if(infowindow !== undefined) infowindow.close();

			// マーカー分を調整
			y = String(Number(y) + 0.00056);

			// 吹き出し情報をセット
			infowindow = new google.maps.InfoWindow({
				content: str,
				position: new google.maps.LatLng(y, x)
			});

			// 吹き出しを表示
			infowindow.open(map);

		},

		/**
		 * マーカー表示
		 */
		setMarker: function(x, y) {

			// マーカー情報をセット
			var marker = new google.maps.Marker({
				position: new google.maps.LatLng(y, x),
				map: map
			});
		}

	};


/*--------------------------------------------------------------------
 その他処理関数
----------------------------------------------------------------------*/

	fn = {

		/**
		 * スムーススクロール
		 */
		smoothScroll: function(targetHref) {

			var href = targetHref;

			// 遷移先URLが#のみまたは空であれば先頭に
			var target = $(href === '#' || href === '' ? 'html' : href);
			var position = target.offset().top;

			// スクロール処理
			$('html, body').animate({
				scrollTop: position
			}, 500, 'swing');
		},

		/**
		 * スクロール時に地図の位置を固定
		 */
		doMapFixed: function(scrollTop) {

			var $this = $('#sidebar');
			var mapPosition = (scrollTop > mapOffsetTop) ? (scrollTop - mapOffsetTop +30) : 0;

			// top値
			$this.css('top', mapPosition);
		},

		/**
		 * 表示エリアに合わせて地図を移動
		 */
		doMoveMap: function(scrollTop) {

// ★スクロール時に一番上のカセットより上にいくとエラー


			var cnt;

			// 表示カセットが何番目かを検索するループ処理
			for(var i=0; i<areaArray.length; i++) {
				if(scrollTop > areaArray[i] && scrollTop < areaArray[i+1]) cnt = i;
			}

			// 表示カセット番号がスクロール前のカセット番号と別であれば地図移動の処理を行う
			if(nowAreaCnt != cnt) {

				var $nowArea = $('.areaCassette').eq(cnt);

				/** 指定座標への移動 */
				gmap.panMap($nowArea.attr('data-x'), $nowArea.attr('data-y'), $nowArea.find('h2').text());

				nowAreaCnt = cnt;
			}

		}

	};


/*--------------------------------------------------------------------
 即時実行処理
----------------------------------------------------------------------*/

	/**
	 * 初期処理
	 */
	var init = function() {

		// 各カセットのy座標を配列に格納
		var $areaCassette = $('.areaCassette');
		for(var i=0; i<$areaCassette.length; i++) {

			var offsetTop = (i>0) ? $areaCassette.eq(i).offset().top : 0;
			areaArray.push(offsetTop);

			// 最後に一番したのbodyの高さを格納
			if(i==$areaCassette.length-1) areaArray.push(offsetTop + $('body').outerHeight());
		}

		// 地図の初期位置
		mapOffsetTop = $('#sidebar').offset().top;

		/** Mapクラスを設定 */
		gmap.loadMap();

		// スクロール時の処理
		$(window).scroll(function() {

			var scrollTop = $('body').scrollTop();

			/** スクロール時に地図の位置を固定 */
			fn.doMapFixed(scrollTop);

			/** 表示エリアに合わせて地図を移動 */
			fn.doMoveMap(scrollTop);
		});

		/** スムーススクロール */
		$('a[href^="#"]').on('click', function() {
			fn.smoothScroll($(this).attr('href'));
		});

	};

	/** 初期処理 */
	init();

});
