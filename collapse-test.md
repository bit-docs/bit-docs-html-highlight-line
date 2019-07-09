Instead of connecting to a real backend API or web service, we’ll use [can-fixture fixtures]
to “mock” an API. Whenever an [AJAX](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest)
request is made, the fixture will “capture” the request and instead respond with mock data.

> **Note:** if you open your browser’s Network panel, you will *not* see any network requests.
> You can see the fixture requests and responses in your browser’s Console panel.

How fixtures work is outside the scope of this tutorial and not necessary to understand to continue,
but you can learn more in the [can-fixture] documentation.

## Defining a custom element with CanJS

We mentioned above that CanJS helps you define custom elements. We call these [can-component components].

Add the following to the **JS** tab in your CodePen:

```js
// Creates a mock backend with 3 todos
import { todoFixture } from "//unpkg.com/can-demo-models@5";
todoFixture(3);

import { Component } from "//unpkg.com/can@5/core.mjs";

Component.extend({
	tag: "todos-app",
	view: `
		<h1>Today’s to-dos</h1>
	`,
	ViewModel: {
	}
});
```
<span line-highlight='2-7,9-14,only'/>