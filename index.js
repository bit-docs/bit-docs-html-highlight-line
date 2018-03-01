var $ = require("jquery");
var padding = 3;

var getConfig = function(lineString, lineCount) {
	var lines = lineString
		.split(',')
		.map(function(data) {
			return data.trim();
		})
		.filter(function(data) {
			return data;
		})
	;

	var collapse = [];
	var index = lines.indexOf('only');
	if (index > -1) {
		lines.splice(index, 1);

		var current = 1;
		for (var i = 0; i < lines.length; i++) {
			var range = lines[i]
				.split('-')
				.map(function(val) {
					return parseInt(val);
				})
				.filter(function(val) {
					return typeof val === 'number' && !isNaN(val);
				})
			;

			if (range[0] > current + padding) {
				collapse.push(current + '-' + (range[0] - 1 - padding));
			}

			current = (range[1] || range[0]) + padding + 1;
		}

		if (current < lineCount) {
			collapse.push(current + '-' + lineCount);
		}
	}

	return {
		lines: lines.length ? lines.join(',') : false,
		collapse: collapse.length ? collapse.join(',') : false,
	};
};

module.exports = function() {
	$('span[line-highlight]').each(function(i, el) {
		var $el = $(el);
		var preBlock = $el.parent().prev('pre');
		var codeBlock = preBlock.children('code');

		var total = codeBlock.text().split('\n').length - 1;
		var config = getConfig($el.attr('line-highlight'), total);

		if (preBlock) {
			preBlock.attr('data-line', config.lines);

			if (config.collapse) {
				preBlock.attr('data-collapse', config.collapse);
			}
		}
	});
};
