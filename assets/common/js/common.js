/*--------------------------------------------------------------------
 common.js
----------------------------------------------------------------------*/

(function(window, undefined) {

	var App = {
		global: {},
		fn: {},
		ui: {},
		utils: {},
		views: {}
	};
	window.APP = App;

})(window);

(function(App, window, decument, undefined) {


/* global
------------------------------------------------------------*/

	App.global = {

		isScroll: false,  // スクロール中判定
		contentsOffsetArray: []  // 各セクションの縦位置

	};


/* fn
------------------------------------------------------------*/

	App.fn = {

	};


/* ui
------------------------------------------------------------*/

	App.ui = {

	};


/* utils
------------------------------------------------------------*/

	App.utils = {

	};


/* views
------------------------------------------------------------*/

	App.views = {

		/**
		 * ページ
		 */
		PageView: (function() {
			var constructor = function() {
				this.$el = {};
				this.$anchor = {};
				this.$imgBtn = {};
				this.scrollSpeed = 500;
				return this;
			};
			var proto = constructor.prototype;
			proto.init = function(el) {
				this.setEl(el);
				this.render();
				this.setEvents();
				return this;
			};
			proto.setEl = function(el) {
				this.$el = $(el);
				this.$anchor = this.$el.find('a[href^="#"]');
				this.$imgBtn = this.$el.find('.btn');
				return this;
			};
			proto.render = function() {

				/* ヘッダ */
				var headerView = new App.views.HeaderView();
				headerView.init({
					el: '#HeaderView'
				});

				/* メイン */
				var mainView = new App.views.MainView();
				mainView.init({
					el: '#MainView',
					scrollAdjust: 100
				});

				/* フッタ */
				var footerView = new App.views.FooterView();
				footerView.init({
					el: '#FooterView'
				});

				return this;
			};
			proto.setEvents = function() {
				var that = this;
				$(window).resize(function() {
					that.render();
				});
				this.$anchor.off('click').on('click', function() {
					if(!App.global.isScroll) {
						that.smoothScroll($(this).attr('href'));
						App.global.isScroll = false;
					}
					return false;
				});
				this.$imgBtn.hover(function() {
					that.imageRollover(this);
				}, function() {
					that.imageRollover(this);
				});
				return this;
			};
			proto.smoothScroll = function(href) {
				App.global.isScroll = true;
				var $target = $(href === '#' || href === '' ? 'html' : href);
				var position = $target.offset().top;
				$('html, body').animate({
					scrollTop: position
				}, this.scrollSpeed, 'swing');
				return this;
			};
			proto.imageRollover = function(that) {
				var $that = $(that);
				var imgSrc = $that.attr('src');
				var imgPath = imgSrc.split('/');
				var imgFile = imgPath[imgPath.length -1];
				$that.attr('src', (imgFile.indexOf('_on') == -1) ? imgSrc.replace(/(\.)(gif|jpg|png)/i, '_on$1$2') : imgSrc.replace(/(\_on)(.)(gif|jpg|png)/i, '$2$3'));
				return this;
			};
			return constructor;
		})(),

		/**
		 * ヘッダ
		 */
		HeaderView: (function() {
			var constructor = function() {
				this.$el = {};
				return this;
			};
			var proto = constructor.prototype;
			proto.init = function(args) {
				this.setEl(args.el);
				this.render();
				this.setEvents();
				return this;
			};
			proto.setEl = function(el) {
				this.$el = $(el);
				this.$nav = this.$el.find('#GlobalNavView');
				return this;
			};
			proto.render = function() {
				this.adjustViewHeight();

				/* グローバルナビ */
				var globalNavView = new App.views.GlobalNavView();
				globalNavView.init({
					el: '#GlobalNavView'
				});

				return this;
			};
			proto.adjustViewHeight = function() {
				var navHeight = this.$nav.outerHeight();
				this.$el.css({
					height: $(window).height() - navHeight,
					paddingBottom: navHeight
				});
				return this;
			};
			proto.setEvents = function() {
				return this;
			};
			return constructor;
		})(),

		/**
		 * グローバルナビ
		 */
		GlobalNavView: (function() {
			var constructor = function() {
				this.$el = {};
				this.$nav = {};
				this.$child = {};
				this.currentNum = 0;
				this.defaultPosition = 0;
				return this;
			};
			var proto = constructor.prototype;
			proto.init = function(args) {
				this.setEl(args.el);
				this.render();
				this.setEvents();
				return this;
			};
			proto.setEl = function(el) {
				this.$el = $(el);
				this.$nav = this.$el.find('ul');
				this.$child = this.$nav.children();
				return this;
			};
			proto.render = function() {
				this.defaultPosition = this.$el.offset().top;
				return this;
			};
			proto.setEvents = function() {
				var that = this;
				$(window).scroll(function() {
					if(!App.global.isScroll) {
						that.onScrollRender($(window).scrollTop());
					}
				});
				return this;
			};
			proto.onScrollRender = function(scrollTop) {
				this.getContentNum(scrollTop);
				this.setStylePosition(scrollTop);
				this.setCurrentClass();
				return this;
			};
			proto.getContentNum = function(scrollTop) {
				for(var i=0; i<App.global.contentsOffsetArray.length; i++) {
					if(scrollTop > App.global.contentsOffsetArray[i] && scrollTop < App.global.contentsOffsetArray[i+1]) {
						this.currentNum = i;
						break;
					}
				}
				return this;
			};
			proto.setCurrentClass = function() {
				this.$child.removeClass('current');
				if(this.currentNum > 0) {
					this.$child.eq(this.currentNum-1).addClass('current');
				}
				return this;
			};
			proto.setStylePosition = function(scrollTop) {
				if(scrollTop > this.defaultPosition) {
					this.$el.addClass('fixed');
				} else {
					this.$el.removeClass('fixed');
				}
				return this;
			};
			return constructor;
		})(),

		/**
		 * メイン
		 */
		MainView: (function() {
			var constructor = function() {
				this.$el = {};
				this.$section = {};
				this.scrollAdjust = 0;
				return this;
			};
			var proto = constructor.prototype;
			proto.init = function(args) {
				this.scrollAdjust = args.scrollAdjust;
				this.setEl(args.el);
				this.render();
				this.setEvents();
				return this;
			};
			proto.setEl = function(el) {
				this.$el = $(el);
				this.$section = this.$el.find('.section');
				return this;
			};
			proto.render = function() {
				this.getContentsOffsetArray();
				return this;
			};
			proto.getContentsOffsetArray = function() {
				var that = this;
				var offsetArray = [];
				offsetArray.push(0);
				this.$section.each(function() {
					offsetArray.push($(this).offset().top - that.scrollAdjust);
				});
				offsetArray.push(offsetArray[offsetArray.length-1]+this.$el.outerHeight());
				App.global.contentsOffsetArray = offsetArray;
				return this;
			};
			proto.setEvents = function() {
				return this;
			};
			return constructor;
		})(),

		/**
		 * フッタ
		 */
		FooterView: (function() {
			var constructor = function() {
				this.$el = {};
				return this;
			};
			var proto = constructor.prototype;
			proto.init = function(args) {
				this.setEl(args.el);
				this.render();
				this.setEvents();
				return this;
			};
			proto.setEl = function(el) {
				this.$el = $(el);
				return this;
			};
			proto.render = function() {
				return this;
			};
			proto.setEvents = function() {
				return this;
			};
			return constructor;
		})()

	};

})(APP, window, document);
