var assert = require("assert");
var generate = require("bit-docs-generate-html/generate");
var path = require("path");
var fs = require("fs");

var Browser = require("zombie");
var connect = require("connect");

var open = function(url, callback, done) {
	var server = connect().use(connect.static(path.join(__dirname, "temp"))).listen(8081);
	var browser = new Browser();
	browser.visit("http://localhost:8081/" + url)
		.then(function() {
			callback(browser, function() {
				server.close();
			});
		}).catch(function(e) {
			server.close();
			done(e);
		});
};

describe("bit-docs-html-highlight-line", function() {
	it("basics works", function(done) {
		this.timeout(60000);

		var docMap = Promise.resolve({
			index: {
				name: "index",
				demo: "path/to/demo.html",
				body: fs.readFileSync(__dirname+"/test-demo.md", "utf8")
			}
		});

		generate(docMap, {
			html: {
				dependencies: {
					"bit-docs-html-highlight-line": __dirname
				}
			},
			dest: path.join(__dirname, "temp"),
			parent: "index",
			forceBuild: true,
			debug: true,
			minifyBuild: false
		}).then(function() {
			open("index.html",function(browser, close) {
				var doc = browser.window.document;

				var lineCodes = doc.querySelectorAll('pre[data-line] code');
				var collapseCodes = doc.querySelectorAll('pre[data-collapse] code');

				assert.ok(lineCodes.length, "there are code blocks with data-line");
				assert.ok(collapseCodes.length, "there are code blocks with data-collapse");

				close();
				done();
			}, done);
		}, done);
	});

	it("dosen't show expand button for one line code", function(done) {
		this.timeout(60000);

		var docMap = Promise.resolve({
			index: {
				name: "index",
				demo: "path/to/demo.html",
				body: fs.readFileSync(__dirname+"/collapse-test.md", "utf8")
			}
		});

		generate(docMap, {
			html: {
				dependencies: {
					"bit-docs-html-highlight-line": __dirname
				}
			},
			dest: path.join(__dirname, "temp"),
			parent: "index",
			forceBuild: true,
			debug: true,
			minifyBuild: false
		}).then(function() {
			open("index.html",function(browser, close) {
				var doc = browser.window.document;
				var collapseCodes = doc.querySelectorAll('pre[data-collapse] code');
				assert.equal(collapseCodes.length, 0);
				close();
				done();
			}, done);
		}, done);

	});

	it("Collapse last line", function(done) {
		this.timeout(60000);

		var docMap = Promise.resolve({
			index: {
				name: "index",
				demo: "path/to/demo.html",
				body: fs.readFileSync(__dirname+"/test-collapse-last-line.md", "utf8")
			}
		});

		generate(docMap, {
			html: {
				dependencies: {
					"bit-docs-html-highlight-line": __dirname
				}
			},
			dest: path.join(__dirname, "temp"),
			parent: "index",
			forceBuild: true,
			debug: true,
			minifyBuild: false
		}).then(function() {
			open("index.html",function(browser, close) {
				var doc = browser.window.document;
				var collapseCode = doc.querySelectorAll('pre[data-collapse="11-12"]');
				assert.ok(collapseCode);
				close();
				done();
			}, done);
		}, done);
	});
});
