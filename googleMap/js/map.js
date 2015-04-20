/* ===================================================================

 * map.js - Google Maps
 *
 * jQuery 1.11.0
 * Google Maps JavaScript API V3

======================================================================*/

$(function() {

	var map;

	/**
	 * 初期処理
	 */
	var init = function() {

		/** Mapクラスを設定 */
		loadMap();

		/**
		 * ボタンクリック時の処理
		 */
		$('.btnMove').on('click', function() {

			var $this = $(this);

			/** 指定座標への移動 */
			panMap($this.attr('data-x'), $this.attr('data-y'), $this.text());
		});

	};

	/**
	 * Mapクラスを設定
	 * param@ x: 中心X座標
	 * param@ y: 中心Y座標
	 */
	var loadMap = function(x, y, str) {

		// 各引数に何も入っていない場合
		if(str == '' || str == undefined) {

			// 最初の要素から取得
			var $target = $('.btnArea button:first-child');
			str = $target.text();

			// 引数x、yに各座標が入っていない場合
			if((x == '' || x == undefined) && (y == '' || y == undefined)) {
				x = $target.attr('data-x');
				y = $target.attr('data-y');
			}
		}

		// 表示オプション設定
		var opts = {
			zoom: 16,
			navigationControl: false,
			center: new google.maps.LatLng(y, x),
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			mapTypeControl: false
		}

		// GoogleMapを要素内に表示
		var $mapArea = $('#mapViewArea .mapView');
		map = new google.maps.Map($mapArea.get(0), opts);

		/** 吹き出し表示 */
		setBalloon(x, y, str);
		setMarker(x, y);
	};

	/**
	 * 指定座標への移動
	 * param@ x: X座標
	 * param@ y: Y座標
	 */
	var panMap = function(x, y, str) {

		/** Mapクラスを設定 */
		loadMap(x, y, str);

		// 座標の移動
		map.panTo(new google.maps.LatLng(y, x));

	}

	/**
	 * 吹き出し表示
	 */
	var setBalloon = function(x, y, str) {

		// マーカー分を調整
		y = String(Number(y) + 0.00056);

		// 吹き出し情報をセット
		var infowindow = new google.maps.InfoWindow({
			content: str,
			position: new google.maps.LatLng(y, x)
		});

		// 吹き出しを表示
		infowindow.open(map);

	};

	/**
	 * マーカー表示
	 */
	var setMarker = function(x, y) {

		// マーカー情報をセット
		var marker = new google.maps.Marker({
			position: new google.maps.LatLng(y, x),
			map: map
		});
	};

	/** 初期処理 */
	init();

});
