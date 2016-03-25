define(['core/widget/widget', 'core/active/active', 'core/resize/resize_control'], function(widget, active, resizeControl) {
	widget.getAll().forEach(function(w) {
		w.element.addEventListener('mousedown', function(event) {
			var isNotLeftClick = event.which !== 1;
			if (isNotLeftClick) {
				return;
			}

			if (!active.isEnabled(w)) {
				return;
			}

			if (active.isValid(w)) {
				return;
			}

			active.set(w);
		});
	});

	document.addEventListener('mousedown', function(event) {
		if (widget.isValid(event.target)) {
			return;
		}

		active.remove();
	});
});