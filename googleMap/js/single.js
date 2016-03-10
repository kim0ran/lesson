/* ===================================================================

 * map.js - Google Maps
 *
 * jQuery 1.11.0
 * Google Maps JavaScript API V3
 * http://www.ajaxtower.jp/googlemaps/

======================================================================*/

(function($) {

	var pageinit = function() {

		viewMap.init('.areaCassette');

	};

	var viewMap = (function() {
		var $el = {};
		var $canvas = {};
		var options = {};
		var init = function(el) {
			setEl(el);
			setOptions();
			render();
			return this;
		};
		var setEl = function(el) {
			$el = $(el);
			$canvas = $el.find('#mapCanvas');
			return this;
		};
		var setOptions = function() {
			options = {
				x: $el.data('x'),
				y: $el.data('y')
			};
			return this;
		};
		var render = function() {
			var opts = {
			  zoom: 13,
			  center: new google.maps.LatLng(options.y, options.x),
			  mapTypeId: google.maps.MapTypeId.ROADMAP
			};
			var map = new google.maps.Map($canvas.get(0), opts);
			return this;
		};
		return { init: init };
	})();


	pageinit();

})(jQuery);
