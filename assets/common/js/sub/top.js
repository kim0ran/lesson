/*--------------------------------------------------------------------
 top.js
----------------------------------------------------------------------*/

(function() {

    var global = APP.global;
    var fn = APP.fn;
    var utils = APP.utils;
    var views = APP.views;

    /**
     * 初期処理
     */
    var pageInit = function() {

        /* トップ */
        var topView = new TopView();
        topView.init('#TopView');

    };

    /**
     * トップ
     */
    var TopView = (function() {
        var constructor = function() {
            return this;
        };
        var proto = constructor.prototype = new views.PageView();
        proto.render = function() {
            views.PageView.prototype.render.apply(this);

            /* カルーセル */
            var topVisual = new bxCarousel();
            topVisual.init({
                el: '.js-topVisual',
                slideSpeed: 500,
                intervalTime: 3000,
                autoSlide: true
            });

            /* GoogleMap表示 *//*
            var accessMap = new viewGoogleMap();
            accessMap.init({
                el: '.js-googleMap',
                x: 139.7620948,
                y: 35.6908479,
                zoom: 17
            });*/

            return this;
        };
        return constructor;
    })();

    /**
     * カルーセル
     */
    var bxCarousel = function() {
        var $el = {};
        var options = {
            slideSpeed: 500,
            intervalTime: 3000,
            autoSlide: true
        };
        var init = function(args) {
            options = {
                slideSpeed: args.slideSpeed || options.slideSpeed,
                intervalTime: args.intervalTime || options.intervalTime,
                autoSlide: args.autoSlide !== undefined ? args.autoSlide : options.autoSlide
            };
            setEl(args.el);
            render();
            return this;
        };
        var setEl = function(el) {
            $el = $(el);
            return this;
        };
        var render = function() {
            setBxSlider();
            return this;
        };
        var setBxSlider = function() {
            $el.bxSlider({
                speed: options.slideSpeed,
                pause: options.intervalTime,
                auto: options.autoSlide
            });
            return this;
        };
        return { init: init };
    };

    /**
     * GoogleMap表示
     */
    var viewGoogleMap = function() {
        var $el = {};
        var map = {};
        var options = {};
        var init = function(args) {
            options = {
                x: args.x,
                y: args.y,
                zoom: args.zoom
            };
            setEl(args.el);
            render();
            return this;
        };
        var setEl = function(el) {
            $el = $(el);
            return this;
        };
        var render = function() {
            var setOptions = {
              zoom: options.zoom,
              center: new google.maps.LatLng(options.y, options.x),
              mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            map = new google.maps.Map($el.get(0), setOptions);
            return this;
        };
        return { init: init };
    };


    /* 初期処理 */
    pageInit();

})();
