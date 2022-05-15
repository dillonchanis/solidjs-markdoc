# solidjs-markdoc

Render [Markdoc](https://markdoc.io/) syntax with SolidJS.

## Install

```bash
npm install solidjs-markdoc
```

## Usage

### Simple Markdown

You can provide simple markdown strings to the renderer to render Markdoc.

```js
import Markdoc from "@markdoc/markdoc";
import render from "solidjs-markdoc";

function App() {
  const md = `
    # Hello World

    We can render markdown.
  `;
  const ast = Markdoc.parse(md);
  const content = Markdoc.transform(ast);

  return render(content);
}
```

### Markdoc Schema and SolidJS Components

Setup a Markdoc schema.

```
schema/
└── Alert.markdoc.ts
```

```js
// schema/Alert.markdoc.ts

export default {
  render: "Alert",
  description: "Display the enclosed content in an alert box",
  children: ["paragraph", "tag", "list"],
  attributes: {
    type: {
      type: String,
      default: "default",
      matches: ["default", "info", "warning", "error", "success"],
    },
  },
};
```

Create your Solid component.

```js
function Alert({ type, children }) {
  return (
    <div class={`alert alert--${type}`}>
      {children}
    </div>
  );
}
```

Import the renderer and schema into your component.

```js
import Markdoc from "@markdoc/markdoc";
import render from "solidjs-markdoc";
import alert from "./schema/Alert.markdoc";

function Alert({ type, children }) {
  return (
    <div class={`alert alert--${type}`}>
      {children}
    </div>
  );
}

function App() {
  //...
}
```

Create the `config` to pass into your `Markdoc.transform` call.

```js
function App() {
  const md = `
    # Getting started

    You can run SolidJS components in here.

    Check this alert:

    {% alert type="info" %}
      Hey there! Something to look at!
    {% /alert %}
  `;

  const config = {
    tags: {
      alert,
    },
  };

  const ast = Markdoc.parse(md);
  const content = Markdoc.transform(ast, config);

  //...
}
```

Finally, return the result of the `render` function making sure to supply your custom component to the render function's `components` object.


```js
function App() {
  // ...

  return render(content, {
    components: {
      Alert,
    },
  });
}
```

## Full Example

```js
const alert = {
  render: "Alert",
  description: "Display the enclosed content in an alert box",
  children: ["paragraph", "tag", "list"],
  attributes: {
    type: {
      type: String,
      default: "default",
      matches: ["default", "info", "warning", "error", "success"],
    },
  },
};

function Alert({ type, children }) {
  return (
    <div class={`alert alert--${type}`}>
      {children}
    </div>
  );
}

function App() {
  const md = `
    # Getting started

    You can run SolidJS components in here.

    Check this alert:

    {% alert type="info" %}
      Hey there! Something to look at!
    {% /alert %}
  `;

  const config = {
    tags: {
      alert,
    },
  };

  const ast = Markdoc.parse(md);
  const content = Markdoc.transform(ast, config);

  return render(content, {
    components: {
      Alert,
    },
  });
}
```
