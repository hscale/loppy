define(function(require) {
	// load modules
	var widget = require('core/widget/widget');
	var module = require('core/module');
	var globals = require('core/globals');
	var scroll = require('helper/scrollpos');
	var move = require('core/move/move');
	require('css!core/guide/guide.css');

	// create module
	var guide = module('Guide');

	// create variables
	var anchorTypes = ['vertical', 'horizontal'];
	var allAnchors = {
		vertical: [],
		horizontal: []
	};
	var currentAnchors = {
		vertical: [],
		horizontal: []
	};
	var isShowed = {
		vertical: false,
		horizontal: false
	};
	var isLoopEnded = {
		vertical: false,
		horizontal: false
	};
	var guideElement = {
		vertical: null,
		horizontal: null
	};

	// load and insert html
	require(['text!core/guide/guide.html'], function(html) {
		globals.get('controlElement').insertAdjacentHTML('beforeend', html);

		anchorTypes.forEach(function(type) {
			guideElement[type] = document.querySelector('.guide__' + type);
		});
	});

	// add event handlers to widgets
	widget.on('add', function(w) {
		move.on(w, 'set', function() {
			if (!guide.isEnabled(w)) {
				return;
			}

			widget.getAll().forEach(function(w2) {
				if (w === w2) {
					return;
				}

				if (!guide.isEnabled(w2)) {
					return;
				}

				allAnchors.vertical.push(
					w2.element.offsetLeft,
					w2.element.offsetLeft + w2.element.offsetWidth / 2,
					w2.element.offsetLeft + w2.element.offsetWidth
				);

				allAnchors.horizontal.push(
					w2.element.offsetTop,
					w2.element.offsetTop + w2.element.offsetHeight / 2,
					w2.element.offsetTop + w2.element.offsetHeight
				);
			});
		});

		move.on(w, 'remove', function() {
			if (!guide.isEnabled(w)) {
				return;
			}

			anchorTypes.forEach(function(type) {
				allAnchors[type] = [];
				guideHide(type, w);
			});
		});

		move.on(w, 'process', function() {
			if (!guide.isEnabled(w)) {
				return;
			}

			currentAnchors.vertical = [
				w.element.offsetLeft,
				w.element.offsetLeft + w.element.offsetWidth / 2,
				w.element.offsetLeft + w.element.offsetWidth
			];

			currentAnchors.horizontal = [
				w.element.offsetTop,
				w.element.offsetTop + w.element.offsetHeight / 2,
				w.element.offsetTop + w.element.offsetHeight
			];

			anchorTypes.forEach(function(type) {
				allAnchors[type].forEach(function(anchorPos) {
					currentAnchors[type].forEach(function(currentAnchorPos) {
						if (currentAnchorPos > anchorPos - 2 && currentAnchorPos < anchorPos + 2) {
							guideShow(type, w, anchorPos);

							isLoopEnded[type] = true;
							return;
						} else if (isShowed[type] && !isLoopEnded[type]) {
							guideHide(type, w);

							isLoopEnded[type] = true;
						}
					});

					if (isLoopEnded[type]) {
						return;
					}
				});

				isLoopEnded[type] = false;
			});
		});
	});

	function guideHide(type, widget) {
		isShowed[type] = false;
		guideElement[type].style.display = 'none';

		guide.remove(widget);
	}

	function guideShow(type, widget, pos) {
		isShowed[type] = true;
		guideElement[type].style.display = 'block';

		if (type === 'vertical') {
			guideElement.vertical.style.left = pos + 'px';
		} else if (type === 'horizontal') {
			guideElement.horizontal.style.top = pos - scroll.getTop() + 'px';
		}

		guide.set(widget);
	}

	return guide;
});
