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
			var scrollSpeed = {};
			var init = function(el, speed) {
				$el = $(el);
				scrollSpeed = speed;
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

		//sidebar: function(sidevar, nav, btn){
		sidebar: {

			$sidebar: {},
			$nav: {},
			$btn: {},

			init: function(sidebar, btn, nav) {
				this.$sidebar = $(sidebar);
				this.$nav = $(nav);
				this.$btn = $(btn);
				this.Accordion();
				this.ScrollFixed();
				this.setEvents();
				return this;
			},

			setEvents: function() {
				var that = this;
				this.$btn.off('click').on('click', function() {
					that.Accordion.AnimateView();
				});
				$(window).scroll(function() {
					that.scrollFixed();
				});
				return this;
			},

			// サイドバー表示・非表示
			Accordion: function(){
				var that = this;
				var sidebarWidth = {};
				var isOpened = true;
				var init = (function() {
					this.sidebarWidth = that.$sidebar.outerWidth();
					that.$sidebar.css('right', -this.sidebarWidth);
					this.isOpened = false;
				})();
				AnimateView = function() {
					that.$sidebar.animate({ right: isOpened ? -this.sidebarWidth : 0 });
					isOpened = isOpened ? false : true;
					return this;
				};
				return this;
			},

			// スクロール時にナビゲーションの位置を固定
			ScrollFixed: function() {
				var that = this;
				var scrollTop = {};
				var defaultOffsetTop = {};
				var sidebarHeight = {};
				var init = (function() {
					this.defaultOffsetTop = that.$nav.offset().top;
					this.sidebarHeight = that.$sidebar.outerHeight() + this.defaultOffsetTop;
					return this;
				})();
				var scrollFixed = function() {
					scrollTop = $('body').scrollTop();
					var inRanged = (scrollTop > this.defaultOffsetTop && scrollTop < this.sidebarHeight) ? true : false;
					that.$nav.css('top', inRanged ? scrollTop - this.defaultOffsetTop : 0);
					return this;
				};
			}

		}

	};

})(APP, window, document);
/*--------------------------------------------------------------------
 common_utils.js
----------------------------------------------------------------------*/
(function(App, window, decument, undefined) {

	App.utils = {


	};

})(APP, window, document);
