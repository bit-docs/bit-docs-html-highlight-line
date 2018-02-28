var $ = require("jquery");

var getConfig = function(lineString) {
	var lines = lineString
		.split(',')
		.map(function(data) {
			return data.trim();
		});

	var only = false;
	var index = lines.indexOf('only');
	if (index > -1) {
		only = true;
		lines.splice(index, 1);
	}

	return {
		lines: lines.join(','),
		collapse: false,
	};
};

module.exports = function() {
	$('span[line-highlight]').each(function(i, el) {
		var $el = $(el);
		var config = getConfig($el.attr('line-highlight'));
		var preBlock = $el.parent().prev('pre');
		var codeBlock = preBlock.children('code');

		if (preBlock) {
			preBlock.attr('data-line', config.lines);

			if (config.collapse) {
				preBlock.attr('data-collapse', config.collapse);
			}
		}
	});
};
