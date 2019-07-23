```html
<div id="mocha"></div>
<link rel="stylesheet" href="//unpkg.com/mocha@5.2.0/mocha.css">
<script src="//unpkg.com/mocha@5.2.0/mocha.js" type="text/javascript"></script>
<script src="//unpkg.com/chai@4.1.2/chai.js" type="text/javascript"></script>
<script type="module">
import { Component, route, value, DefineMap } from "can";

// Mocha / Chai Setup
mocha.setup("bdd")
var assert = chai.assert;

const HomePage = Component.extend({
	tag: "home-page",

	view: `
		<h2>Home Page</h2>
	`,

	ViewModel: {}
});

const ListPage = Component.extend({
	tag: "list-page",

	view: `
		<h2>List Page</h2>
		<p>{{ id }}</p>
	`,

	ViewModel: {
		id: "number"
	}
});

const Application = Component.extend({
    tag: "app-component",

    ViewModel: {
		routeData: {
			default() {
				route.register("{page}", { page: "home" });
				route.register("list/{id}", { page: "list" });
				route.start();
				return route.data;
			}
        },

        get pageComponentViewModel() {
			const vmData = {};

			if (this.routeData.page === "list") {
				vmData.id = value.bind(this.routeData, "id");
			}

			return vmData;
		},

        get pageComponent() {
			if (this.routeData.page === "home") {
				return new HomePage();
			} else if (this.routeData.page === "list") {
				return new ListPage({
					viewModel: this.pageComponentViewModel
				});
			}
		}
    },

    view: `
		{{ pageComponent }}
	`
});

describe("Application", () => {
    it("pageComponent viewModel", () => {
        const routeData = new DefineMap({
            page: "home",
            id: null
        });

        const vm = new Application.ViewModel({
            routeData: routeData
		});

		assert.deepEqual(vm.pageComponentViewModel, {}, "viewModelData defaults to empty object");

		routeData.update({
			page: "list",
			id: 10
		});

		const viewModelId = vm.pageComponentViewModel.id;
		assert.equal(viewModelId.value, 10, "routeData.id is passed to pageComponent viewModel");

		routeData.id = 20;

		assert.equal(viewModelId.value, 20, "setting routeData.id updates the pageComponentViewModel.id");

		viewModelId.value = 30;
		assert.equal(routeData.id, 30, "setting pageComponentViewModel.id updates routeData.id");
    });
});

// start Mocha
mocha.run();
</script>
```
<span line-highlight='97-100,only'/>
