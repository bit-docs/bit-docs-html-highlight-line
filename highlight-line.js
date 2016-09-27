var $ = require("jquery");

var getLines = function(lineString) {
	var lineArray = lineString.split(',');
	var result = {};

	for (var i = 0; i < lineArray.length; i++) {
		var val = lineArray[i];

		// Matches any string with 1+ digits dash 1+ digits
		// will ignore non matching strings
		if (/^([\d]+-[\d]+)$/.test(val)) {
			var values = val.split('-'),
				start = (values[0] - 1),
				finish = (values[1] - 1);

			for (var j = start; finish >= j; j++) {
				result[j] = true;
			}
			//matches one or more digits
		} else if (/^[\d]+$/.test(val)) {
			result[val - 1] = true;
		} else {
			result[val] = true;
		}

	}
	return result;
};

function addHighlights() {

	$('span[line-highlight]').each(function(i, el) {
		var $el = $(el);
		var lines = getLines($el.attr('line-highlight'));
		var codeBlock = $el.parent().prev('pre').children('code');
		codeBlock.addClass("line-highlight");

		var lineMap = [[]];
		var k = 0;
		codeBlock.children().each(function(i, el) {
			var nodeText = $(el).text();
			if (/\n/.test(nodeText)) {

				var cNames = $(el).attr('class');
				var str = nodeText.split('\n');
				var l = str.length;

				for (var j = 0; j < l; j++) {
					var text = j === (l - 1) ? str[j] : str[j] + '\n';
					var newNode = document.createElement('span');
					newNode.className = cNames;
					$(newNode).text(text);
					lineMap[k].push(newNode);

					if (j !== (l - 1)) {
						k++;
						lineMap[k] = [];
					}
				}
			} else {
				lineMap[k].push(el);
			}
		});

		codeBlock.empty();
		if(lines.only) {
			var segments = [];
			lineMap.forEach(function(lineNodes, lineNumber){
				var visible = lines[lineNumber];
				var lineNode = document.createElement('span');
				$(lineNode).append(lineNodes);
				lineNode.className = lines[lineNumber] ? 'line highlight line-'+lineNumber: 'line line-'+lineNumber ;

				var lastSegment = segments[segments.length - 1];
				if(!lastSegment || lastSegment.visible !== visible) {
					segments.push(lastSegment = {visible: visible, lines: []});
				}
				lastSegment.lines.push(lineNode);


			});
			segments.forEach(function(segment, index){
				var next = segments[index+1];

				if(segment.visible) {
					// take 3 lines from next if possible
					if(next) {
						var first = next.lines.splice(0,3);
						segment.lines = segment.lines.concat(first);
					}
					codeBlock.append(segment.lines);
				} else {
					// move 3 lines to next if possible
					if(next) {
						var last = segment.lines.splice(segment.lines.length-3);
						next.lines = last.concat(next.lines);
					}
					if(segment.lines.length > 2) {
						var expander = document.createElement('div');
						expander.className = "expand";
						expander.addEventListener("click", function(){
							$(expander).replaceWith(segment.lines);
						});
						codeBlock.append(expander);
					} else {
						codeBlock.append(segment.lines);
					}
				}
			});


		} else {
			lineMap.forEach(function(lineNodes, lineNumber){
				var newNode = document.createElement('span');
				newNode.className = lines[lineNumber] ? 'line highlight': 'line' ;
				$(newNode).append(lineNodes);
				codeBlock.append(newNode);
			});
		}

	});
}

module.exports = addHighlights;
