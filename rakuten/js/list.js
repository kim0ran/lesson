/* ===================================================================

 * ui.js - UI処理
 *
 * jQuery 2.1.1

======================================================================*/

$(function() {

	/**
	  * 実行処理
	 **/
	var uiInit = function() {

		// 「検索」ボタンクリック時の処理
		$('#btnSubmit').on('click', function() {

			var $searchText = $('#searchText');
			var searchTextVal = $searchText.val();

			// 「お米」以外はアラート表示
			if(searchTextVal != 'お米') {

				// フォーム内の入力テキストが「お米」以外であれば、alert表示とフォームのリセット
				alert('「お米」と入力してください');
				$searchText.val('');

			} else {

				/** APIを取得してコンテンツ情報を表示 */
				var settingContentsData = {
					url: 'https://app.rakuten.co.jp/services/api/IchibaItem/Search/20140222',
					callback: getApiContents,
					data: {
						applicationId: '1041754297982614111',
						affiliateId: '137136a4.202ac704.137136a5.671eec25',
						keyword: searchTextVal,
						page: 1
					}
				};
				js.fn.doCallApi(settingContentsData);

			}

			return false;
		});

	};

/*--------------------------------------------------------------------
 実行関数
----------------------------------------------------------------------*/

	/**
	  * コンテンツ情報表示のコールバック処理
	  * param@ data: 取得したJSONデータ
	 **/
	var getApiContents = function(data) {

		// 既に一覧がある場合は削除
		if(!!$('.itemList').length) {
			$('.list').find('.listHeader, .itemList, .pager').remove();
			if($('#searchText').val() == 'お米') alert('何回同じ単語で検索すんねん');
		}

		var viewCnt = data.hits;	// 表示件数
		var startCnt = data.first;	// 最初の件数
		var lastCnt = data.last;	// 最初の件数
		var allCnt = data.count;	// 全ての件数
		var pageIndex = data.page;	// ページ目

		// ページ情報を出力
		var itemListPager = [];
		itemListPager.push('<header class="listHeader">');
		itemListPager.push('	<h1>「' + $('#searchText').val() + '」の検索結果</h1>');
		itemListPager.push('	<p class="searchResult"><span>' + startCnt + '～' + lastCnt + '</span>件を表示（' + js.data.doNumberDelimite(allCnt) + '件中）</p>');
		itemListPager.push('</header>');
		$('.list').prepend(itemListPager.join(''));

		// 商品一覧データを出力
		var itemListTemp = [];
		itemListTemp.push('			<ul class="itemList">');
		$.each(data.Items, function(i, items) {

			// 表示カウントを超えたら離脱
			if(i >= viewCnt) return false;

			var $item = items.Item;

			itemListTemp.push('				<li class="item">');
			itemListTemp.push('					<h1>' + js.data.trimDescription($item.itemName, 50, false) + '</h1>');
			itemListTemp.push('					<div class="itemInfo">');
			itemListTemp.push('						<p class="catchCopy">' + js.data.trimDescription($item.catchcopy, 55, false) + '</p>');

			$($item.mediumImageUrls).each(function() {

				itemListTemp.push('						<figure class="imageThumb"><img src="' + this.imageUrl + '" /></figure>');

				// 画像は1枚のみで離脱
				return false;
			});

			itemListTemp.push('						<p class="itemPrice"><span>' + js.data.doNumberDelimite($item.itemPrice) + '</span>円</p>');
			itemListTemp.push('						<dl class="shopName">');
			itemListTemp.push('							<dt>取扱店</dt>');
			itemListTemp.push('							<dd><a href="' + $item.shopUrl + '">' + $item.shopName + '</a></dd>');
			itemListTemp.push('						</dl>');
			itemListTemp.push('						<div class="btnItemDetails"><a href="' + $item.itemUrl + '" target="_blank">詳細を見る</a></div>');
			itemListTemp.push('					</div>');
			itemListTemp.push('				</li>');

		});
		itemListTemp.push('			</ul>');

		// ページャーを出力
		var pagerListCnt = 10;

		// 現在のページャー位置
		var startIndex = Math.ceil(startCnt/viewCnt);

		var pagerTemplate = [];
		itemListTemp.push('<div class="pager">');
		itemListTemp.push('	<p>&lt;&lt; <a href="javascript:void(0)" data-page="1">最初</a></p>');
		itemListTemp.push('	<p>&lt; <a href="javascript:void(0)" data-page="1">前へ</a></p>');
		itemListTemp.push('	<ol>');
		for(var i=startIndex; startIndex+pagerListCnt > i; i++) {
			itemListTemp.push('		<li><a href="javascript:void(0)" data-page="' + i + '">' + i + '</a></li>');
		}
		itemListTemp.push('	</ol>');
		itemListTemp.push('	<p><a href="javascript:void(0)" data-page="1">次へ</a> &gt;</p>');
		itemListTemp.push('	<p><a href="javascript:void(0)" data-page="1">最後</a> &gt;&gt;</p>');
		itemListTemp.push('</div>');


		// 出力したデータを結合して表示
		$('.list').append(itemListTemp.join('')).promise().done(function() {

			// カセットクリック時のアンカー処理
			var $cassette = $('.itemList').children('.item');
			$cassette.on('click', function() {

				// アンカー情報を取得する要素
				var $getAnchorTarget = $(this).find('.btnItemDetails a');

				// URLとtarget属性を取得
				var getUrl = $getAnchorTarget.attr('href');
				var getTarget = $getAnchorTarget.attr('target');

				// 取得したアンカー情報を実行
				if(getTarget != undefined) {

				  // target属性があれば引き継いで、取得したURLに遷移
				  window.open(getUrl, getTarget)
				} else {

				  // target属性がなければ、取得したURLにパラメータを付与して遷移
				  location.href = getUrl;
				}

				return false;
			});
			// カセット内のアンカークリック時はカセット自体のリンクを無効
			$cassette.find('a').on('click', function() {
				$(this).parents('.list').off('click');
			});

			// 表示中のページャーにカレントクラスを付与
			$('.pager a[data-page="' + startIndex + '"]').parent('li').addClass('current');

			if($('.pager > ol li:first-child a').text() == 1) {
				$('.pager p:first-child, .pager p:first-child + p').addClass('desable');
			}

			// ページャーの各リンククリック時の処理
			$('.pager a').on('click', function() {

				// desalbeクラスが付与されていればリンク無効
				if($(this).parent('p').hasClass('desable')) return false;

				alert('まだ出来てないから移動しないよ');  // ★ページャー処理未作成
			});

		});

	};

	/** 初期処理 */
	uiInit();

});
