/* ===================================================================

 * map.js - Google Maps
 *
 * jQuery 1.11.0
 * Google Maps JavaScript API V3

======================================================================*/

$(function() {

	/**
	 * 初期処理
	 */
	var init = function() {

		/** 地図表示 */
		loadMap();

	};

	/**
	 * 地図表示
	 */
	var loadMap = function() {

		// 地図の中心座標
		var x = 139.828603;
		var y = 35.764784;

		// 表示オプション設定
		var opts = {
			zoom: 16,
			navigationControl: false,
			center: new google.maps.LatLng(y, x),
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			mapTypeControl: false
		}

		// GoogleMapを要素内に表示
		var $viewArea = $('#mapViewArea .mapView');
		var map = new google.maps.Map($viewArea.get(0), opts);

	};

	/**
	 * 
	 */
	var marker = function() {

	};

	/** 初期処理 */
	init();

});
