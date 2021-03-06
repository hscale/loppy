define(function(require, exports, module) {
	// load modules
	var widget = require('core/widget/widget');
	var globals = require('core/globals');
	require('css!core/toolbar/toolbar.css');

	// set params
	globals.set('offsetTop', 40);

	//
	var activeItem = null;
	var activeParam = null;
	var listeners = {};

	// load process
	require(['text!core/toolbar/toolbar.html'], function(html) {
		globals.get('controlElement').insertAdjacentHTML('beforeend', html);

		Array.from(document.querySelectorAll('.toolbar__item')).forEach(function(item) {
			if (typeof(item.dataset.target) === undefined) {
				return;
			}

			item.addEventListener('click', function(event) {
				exports.toggle(this);
			});
		});

		var addItems = Array.from(document.querySelectorAll('#toolbar__param_add .toolbar__param_item'));

		addItems.forEach(function(item) {
			item.addEventListener('click', function(event) {
				var widgetType = item.dataset.widget;

				exports.trigger('add', widgetType);
			});
		});
	});

	// functions
	exports.getActiveItem = function() {
		return activeItem;
	}

	exports.getActiveParam = function() {
		return activeParam;
	}

	exports.close = function() {
		if (activeItem !== null) {
			activeItem.classList.remove('toolbar__active');
			activeItem = null;
		}

		if (activeParam !== null) {
			activeParam.style.display = 'none';
			activeParam = null;
		}
	}

	exports.toggle = function(element) {
		var target = document.getElementById(element.dataset.target);

		if (target === null) {
			return;
		}

		if (element === activeItem) {
			activeItem.classList.remove('toolbar__active');
			activeItem = null;
		} else {
			if (activeItem !== null) {
				activeItem.classList.remove('toolbar__active');
				activeItem = null;
			}

			activeItem = element;
			activeItem.classList.add('toolbar__active');
		}

		if (target === activeParam) {
			activeParam.style.display = 'none';
			activeParam = null;
		} else {
			if (activeParam !== null) {
				activeParam.style.display = 'none';
				activeParam = null;
			}

			activeParam = target;
			activeParam.style.display = 'block';
		}
	}

	// event system
	exports.on = function(type, func) {
		if (!listeners.hasOwnProperty(type)) {
			listeners[type] = [];
		}

		listeners[type].push(func);
	};

	exports.off = function(type, func) {
		if (!listeners.hasOwnProperty(type)) {
			return 0;
		}

		var index = listeners[type].indexOf(func);
		if (index === -1) {
			return 0;
		}

		listeners[type].splice(index, 1);
		return 1;
	};

	exports.trigger = function(type, args) {
		if (!listeners.hasOwnProperty(type)) {
			return 0;
		}

		listeners[type].forEach(function(func, pos) {
			func(args);
		});
		return 1;
	};
});
