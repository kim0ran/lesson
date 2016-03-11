/*--------------------------------------------------------------------
 common.js
----------------------------------------------------------------------*/

(function(window, undefined) {

	var App = {
		global: {},
		fn: {},
		utils: {},
		views: {}
	};
	window.APP = App;

})(window);

(function(App, window, decument, undefined) {


/* global
------------------------------------------------------------*/

	App.global = {

	};


/* fn
------------------------------------------------------------*/

	App.fn = {

	};


/* utils
------------------------------------------------------------*/

	App.utils = {

		/**
		 * 子要素の高さを合わせる
		 */
		matchHeight: function() {
			var $el = {};
			var $child = {};
			var maxHeight = 0;
			var init = function(el) {
				setEl(el);
				render();
				return this;
			};
			var setEl = function(el) {
				$el = $(el);
				$child = $el.children();
				return this;
			};
			var render = function() {
				getHeight();
				$child.height(maxHeight);
				return this;
			};
			var getHeight = function() {
				var array = [];
				$child.each(function() {
					var $this = $(this);
					array.push($(this).outerHeight());
				});
				array.sort(function(a, b) {
					if(a > b) return -1;
					if(a < b) return 1;
					return 0;
				});
				maxHeight = array[0];
				return this;
			};
			return { init: init };
		}

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
				this.isScroll = false;
				this.globalNavView = {};
				return this;
			};
			var proto = constructor.prototype;
			proto.init = function(el) {
				this.setEl(el);
				this.render();
				this.setEvents();
				this.setCustumEvents();
				return this;
			};
			proto.setEl = function(el) {
				this.$el = $(el);
				this.$anchor = this.$el.find('a[href^="#"]');
				this.$imgBtn = this.$el.find('.btn');
				return this;
			};
			proto.render = function() {

				/* グローバルナビ */
				this.globalNavView = new App.views.GlobalNavView();
				this.globalNavView.parentViewEl = this.$el;
				this.globalNavView.init({
					el: '.globalNav',
					navCurrent: '.current',
					slideSpeed: 300
				});

				/* 子要素の高さを合わせる */
				//var contentsList = App.utils.matchHeight();
				//contentsList.init('.js-height');

				return this;
			};
			proto.setEvents = function() {
				var that = this;
				this.$anchor.off('click').on('click', function() {
					if(!that.isScroll) {
						that.smoothScroll($(this).attr('href'));
						that.isScroll = false;
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
				this.isScroll = true;
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
			proto.setCustumEvents = function() {
				var that = this;
				this.$el.on('onAnimateGlobalNav', function(e, isOpen){
					that.onAnimateGlobalNav(isOpen);
				});
				return this;
			};
			proto.onAnimateGlobalNav = function(isOpen) {
				this.$el.animate({
					left: isOpen ? 0 : '-80%'
				});
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
				this.$btn = {};
				this.$list = {};
				this.slideSpeed = 500;
				this.isOpen = false;
				this.isAnimate = false;
				return this;
			};
			var proto = constructor.prototype;
			proto.init = function(args) {
				this.slideSpeed = args.slideSpeed || this.slideSpeed;
				this.setEl(args.el);
				this.render();
				this.setEvents();
				return this;
			};
			proto.setEl = function(el) {
				this.$el = $(el);
				this.$btn = this.$el.find('.js-gNavBtn');
				this.$list = this.$el.find('.js-gNavList');
				return this;
			};
			proto.render = function() {
				this.parentViewEl.wrap('<div style="overflow: hidden;"></div>').css('left', 0);
				return this;
			};
			proto.setEvents = function() {
				var that = this;
				this.$btn.off('click').on('click', function() {
					if(!this.isAnimate) {
						that.animateSlideNav();
						that.isOpen = that.isOpen ? false : true;
						that.isAnimate = false;
					}
				});
				return this;
			};
			proto.animateSlideNav = function() {
				this.isAnimate = true;
				this.parentViewEl.trigger('onAnimateGlobalNav', this.isOpen);
				return this;
			};
			return constructor;
		})()

	};

})(APP, window, document);
