if (typeof self === 'undefined' || !self.Prism || !self.document || !document.querySelector) {
	throw new Error('Prism must be loaded before prism-collapse');
}

function hasClass(element, className) {
  className = " " + className + " ";
  return (" " + element.className + " ").replace(/[\n\t]/g, " ").indexOf(className) > -1
}

function adjustHighlights(pre, collapseRange, visible) {
	collapseRange = collapseRange.split('-').map(function(value) {
		return parseInt(value);
	});

	var highlights = pre.querySelectorAll('.line-highlight');
	var lineHeight = getLineHeight(highlights);

	for (var i = 0; i < highlights.length; i++) {
		var highlight = highlights[i];

		var range = highlight.getAttribute('data-range').split('-').map(function(value) {
			return parseInt(value);
		});

		if (range.length === 1) {
			var line = range[0];
			if (line < collapseRange[0]) {
				return;
			}

			if (line > collapseRange[1]) {
				var top = parseFloat(highlight.style.top.slice(0, -2));
				var offset = (collapseRange[1] - collapseRange[0]) * lineHeight;

				highlight.style.top = top + (visible ? offset : -offset);
				return;
			}

			highlight.style.display = visible ? 'block' : 'none';
			return;
		}

		if (range.length === 2) {
			if (range[1] < collapseRange[0]) {
				return;
			}

			if (range[0] > collapseRange[1]) {
				var top = parseFloat(highlight.style.top.slice(0, -2));
				var offset = (collapseRange[1] - collapseRange[0]) * lineHeight;

				highlight.style.top = top + (visible ? offset : -offset);
				return;
			}

			highlight.style.display = visible ? 'block' : 'none';
			return;
		}
	};

	function getLineHeight(highlights) {
		var highlight = highlights[0];
		var height = parseFloat(highlight.css('height').slice(0, -2));

		var range = highlight.getAttribute('data-range').split('-').map(function(value) {
			return parseInt(value);
		});

		if (range.length === 1) {
			return height;
		}

		return height / (range[1] - range[0] + 1);
	}
}

function collapseLines(pre, config, hasLineNumbers) {
	var inserts = [];

	var ranges = config.split(',');
	for (var i = 0; i < ranges.length; i++) {
		var range = ranges[i];
		var parts = range.split('-');

		var wrapper = '<div class="collapse collapsed" data-index="' + i + '" data-range="' + range + '">';
		inserts.push([
			+parts[0],
			wrapper + '<div class="collapse-code">',
			wrapper + '<div class="collapse-lines">'
		]);

		inserts.push([
			+parts[1] + 1,
			'</div></div>',
			'</div></div>'
		]);

		adjustHighlights(pre, range, false);
	}

	inserts.sort(function (a, b) {
		return b[0] - a[0];
	});


	var codeContainer = pre.children[0];

	var numbersContainer = null;
	var numbers = null;
	if (hasLineNumbers) {
		numbersContainer = codeContainer.lastChild;
		numbersContainer.remove();

		numbers = numbersContainer.innerHTML.split('<span></span>');
	}

	var code = codeContainer.innerHTML.split('\n');
	code = code.map(function(line, index) {
		if (index === code.length - 1) {
			return line;
		}

		return line + '\n';
	});

	for (var i = 0; i < inserts.length; i++) {
		var line = Math.min(code.length - 1, inserts[i][0] - 1);

		code.splice(line, 0, inserts[i][1]);
		numbers[line] += inserts[i][2];
	}

	codeContainer.innerHTML = code.join('');

	if (hasLineNumbers) {
		numbersContainer.innerHTML = numbers.join('<span></span>');
		codeContainer.appendChild(numbersContainer);
	}
}

Prism.hooks.add('complete', function completeHook(env) {
	var pre = env.element.parentNode;
	var config = pre && pre.getAttribute('data-collapse');

	if (!pre || !config || !/pre/i.test(pre.nodeName)) {
		return;
	}

	var hasLineNumbers = Prism.plugins.lineNumbers;
	var isLineNumbersLoaded = env.plugins && env.plugins.lineNumbers;

	if (hasClass(pre, 'line-numbers') && hasLineNumbers && !isLineNumbersLoaded) {
		Prism.hooks.add('line-numbers', completeHook);
	} else {
		collapseLines(pre, config, hasLineNumbers);
	}
});

document.body.addEventListener('click', function(event) {
	var collapse = event.target;
	if (!collapse.classList.contains('collapse') || !collapse.classList.contains('collapsed')) {
		return;
	}

	var index = collapse.getAttribute('data-index');
	var code = collapse.parentElement;
	var pre = code.parentElement;

	var line = code.querySelectorAll('.collapse[data-index=' + index + ']');
	line.classList.remove('collapsed');

	adjustHighlights(pre, collapse.getAttribute('data-range'), true);
}, false);
