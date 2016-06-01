define(function(require) {
	// load modules
	var widget = require('core/widget/widget');
	var globals = require('core/globals');
	var move = require('core/move/move');
	var active = require('core/active/active');
	var resize = require('core/resize/resize');
	var guide = require('core/guide/guide');
	var toolbar = require('core/toolbar/toolbar');
	var editbar = require('core/editbar/editbar');
	var headlineEditbar = require('widget/button/editbar/editbar');
	require('css!widget/headline/headline.css');

	// resize params
	var resizeParams = {
		minWidth: 100,
		type: 'side'
	};

	document.addEventListener('widgetAdd', function(event) {
		var w = event.detail.widget;

		if (w.type !== 'headline') {
			return;
		}

		move.enable(w);
		resize.enable(w, resizeParams);
		active.enable(w);
		guide.enable(w);
		editbar.enable(w);

		w.element.addEventListener('widgetActiveRemove', function() {
			this.classList.remove('widget__active');
		});

		w.element.addEventListener('widgetActiveSet', function() {
			this.classList.add('widget__active');
		});
	});

	document.addEventListener('clickWidgetAdd', function(event) {
		var type = event.detail.type;

		if (type !== 'headline') {
			return;
		}

		require(['text!widget/headline/headline.html'], function(html) {
			var blockElement = document.querySelector('.block__item');
			blockElement.insertAdjacentHTML('beforeend', html);

			var w = {
				element: blockElement.querySelector('.widget:last-child'),
				type: 'headline'
			};

			widget.add(w);

			toolbar.close();
			resize.resize(w, {
				top: blockElement.offsetHeight / 2,
				left: blockElement.offsetWidth / 2,
				width: resizeParams.minWidth
			}, resizeParams);
			active.set(w);
		});
	});
});
