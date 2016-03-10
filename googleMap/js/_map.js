/* ===================================================================
 * 
 * 
 * 
 * 
 * ===================================================================*/


$(function() {

	/**
	  * 初期処理
	 **/
	var init = function() {

		/** GoogleMap API呼び出し */
		initialize();

	}

	/**
	  * GoogleMap API呼び出し
	 **/
	var initialize = function() {

/*--------------------------------------------------------------------
 各オプション値を設定
----------------------------------------------------------------------*/

		// 地図の中心位置の座標
		var centerXVal = 139.828603;
		var centerYVal = 35.764784;
		var centerVal = new google.maps.LatLng(centerYVal, centerXVal);


		// 地図の移動先座標
		var mapMoveXVal = 139.844400;
		var mapMoveYVal = 35.763500;
		var mapMoveVal = new google.maps.LatLng(mapMoveYVal, mapMoveXVal);

		// 表示縮尺の設定値
		var zoomVal = 16;

		// 表示縮尺とかコントロールするボタンの表示非表示
		var navigationControlVal = false;

		// 
		var mapTypeIdVal = google.maps.MapTypeId.ROADMAP;

		// 航空写真とかに切り替えるボタンの表示非表示
		var mapTypeControlVal = false;


/* 表示オプションを設定
------------------------------------------------------------*/

		var viewOptions = {

			center: centerVal,
			zoom: zoomVal,
			navigationControl: navigationControlVal,
			mapTypeId: mapTypeIdVal,
			mapTypeControl: mapTypeControlVal

		};


/*--------------------------------------------------------------------
 地図を表示
----------------------------------------------------------------------*/

		// GoogleMapを指定した要素内に表示
		var $viewArea = $('#mapViewArea .mapView');
		var map = new google.maps.Map($viewArea.get(0), viewOptions);


/* 吹き出し情報の設定
------------------------------------------------------------*/

		// 吹き出し表示位置の微調整
		var pixelOffsetVal = new google.maps.Size(0, -35);

		// 初期の吹き出し内の情報
		var infoWindowVal = {

			content: 'おれん家',
			position: centerVal,
			pixelOffset: pixelOffsetVal

		}

		// 変更後の吹き出し内の更新情報
		var newInfoWindowVal = {

			content: '前のおれん家',
			position: mapMoveVal,
			pixelOffset: pixelOffsetVal

		}

		var infoWindow = new google.maps.InfoWindow(infoWindowVal);


/* マーカー情報の設定
------------------------------------------------------------*/

		// 1コ目のマーカー情報
		var markerOptions1 = {
			position: centerVal
		}

		// 2コ目のマーカー情報
		var markerOptions2 = {
			position: mapMoveVal
		}

		// 3コ目のマーカー情報
		var markerOptions3 = {
			position: new google.maps.LatLng(35.764784, 139.838603)
		}

		var marker1 = new google.maps.Marker(markerOptions1);
		var marker2 = new google.maps.Marker(markerOptions2);
		var marker3 = new google.maps.Marker(markerOptions3);

		// マーカーを地図上に配置
		marker1.setMap(map);
		marker2.setMap(map);
		marker3.setMap(map);


/* ポリラインの設定
------------------------------------------------------------*/

		var polylineVal = [
			new google.maps.LatLng(centerXVal, centerYVal),
			new google.maps.LatLng(mapMoveXVal, mapMoveYVal)
		];

		var setPolyline = new google.maps.Polyline({
			path: polylineVal,
			strokeColor: "#003399",
			strokeOpacity: 1.0,
			strokeWeight: 2
		});

		setPolyline.setMap(map);


/*--------------------------------------------------------------------
 イベント処理
----------------------------------------------------------------------*/

		// ボタンhover時に吹き出しが表示
		$('button').hover(function() {

			infoWindow.open(map);

		}, function() {

			infoWindow.close();

		});

		// ボタンクリック時に移動
		$('button').on('click', function() {

			// 表示中心座標を移動
			map.panTo(mapMoveVal);

			// 吹き出し情報を変更
			infoWindow.setOptions(newInfoWindowVal);

			// 前の中心座標のマーカーを非表示
			marker1.setVisible(false);

		});

	};


	/** 初期処理 */
	init();

});
