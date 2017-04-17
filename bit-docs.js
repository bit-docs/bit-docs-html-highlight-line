var tags = require("./tags");

/**
 * @module {function} bit-docs-html-highlight-line
 * @parent plugins
 *
 * @description Adds a `@highlight` tag.  Needs to be used after `bit-docs-prettify`.
 *
 * @body
 *
 * TBD
 */
module.exports = function(bitDocs){
	var pkg = require("./package.json");
	var deps = {};

	deps[pkg.name] = 'file:' + __dirname;

	bitDocs.register("html", {
		dependencies: deps
	});

	bitDocs.register("tags", tags);
};
