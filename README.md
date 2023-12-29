# Functional Web Components

This is a Proof of Concept for creating Custom Elements in a declarative and
functional fashion.

```js
import { customElement, h1 } from 'functional-web-components';

const Greeting = customElement(({ name = 'World' }) => h1(`Hello, ${name}!`));

customElements.define('app-greeting', Greeting);
```

```html
<body>
  <app-greeting name="Functional Web Components"></app-greeting>
</body>
```

Result:

```html
<body>
  <h1>Hello, Functional Web Components!</h1>
</body>
```

## Introduction

<https://dev.to/hybrids/from-classes-to-plain-objects-and-pure-functions-2gip>

> The only way to create a custom element is to use a class, which extends
> `HTMLElement` and then define it with Custom Elements API.

```js
class Greeting extends HTMLElement {
  constructor() {
    super();
    const name = this.getAttribute('name') || 'World';
    this.innerHTML = `<h1>Hello, ${name}</h1>`;
  }
}
```

In contrast, the proposed `customElement` syntax is much more succinct and
declarative, improving its readability.

```js
const Greeting = customElement(({ name = 'World' }) => h1(`Hello, ${name}!`));
```

## Getting Started

Let's see how to create a simple web component with the default class syntax.

`src/getting-started/dom-api/hello-world.js`

```js
export class HelloWorld extends HTMLElement {
  connectedCallback() {
    this.innerHTML = '<h1>Hello, World!</h1>';
  }
}
```

### Shadow DOM

`src/getting-started/shadow-dom/hello-world.js`

```js
export class HelloWorld extends HTMLElement {
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.innerHTML = '<h1>Hello, World!</h1>';
  }
}
```

### Constructors & Prototypes

<https://stackoverflow.com/questions/45747646/what-is-the-es5-way-of-writing-web-component-classes>

> To simulate the default ES6 constructor that calls `super()`, we can use
> `Reflect.construct` to invoke the `HTMLElement` constructor but using the
> prototype from our `HelloWorld` consutrctor.
>
> For inheritance, you need to set the prototype of the `HelloWorld` constructor
> to an instance of `HTMLElement` and define methods and properties on that.
> It's conventional to use use `Object.create()` to create a non-functional
> dummy instance without invoking the constructor here.

<https://github.com/WICG/webcomponents/issues/423>

> `HTMLElement.call(this)` would not work but `Reflect.construct` would.
>
> All browsers that support custom elements v1 API would support
> `Reflect.construct`.

`src/getting-started/constructors-and-prototypes/hello-world.js`

```js
export function HelloWorld() {
  return Reflect.construct(HTMLElement, [], HelloWorld);
}

HelloWorld.prototype = Object.create(HTMLElement.prototype);

HelloWorld.prototype.connectedCallback = function () {
  this.innerHTML = '<h1>Hello, World!</h1>';
};
```

### Class expressions

<https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/class>

Class expressions allows us to create classes dynamically reducing the
complexity of the "constructor & prototype" approach.

`src/getting-started/class-expressions/hello-world.js`

```js
export const HelloWorld = class extends HTMLElement {
  connectedCallback() {
    this.innerHTML = '<h1>Hello, World!</h1>';
  }
};
```

### Render function

Once we have the basics to build custom elements without using the `class`
keyword we can create an abstraction to build them in a functional style.

The initial step is to provide an API to declare presentational Web Components
emulating the React functional components API.

`src/getting-started/render-function/custom-element.js`

```js
export const customElement = (render) => {
  return class extends HTMLElement {
    constructor() {
      super();
      this.innerHTML = render();
    }
  };
};
```

`src/getting-started/render-function/hello-world.js`

```js
import { customElement } from './custom-element.js';

export const HelloWorld = customElement(() => '<h1>Hello, World!</h1>');
```

## Features

Now that we have a basic functional `customElement` implementation we can build
other features on top.

### Attributes

We can reflect attribute values by iterating `this.attributes` from the
`constructor`.

```html
<app-greeting name="World"></app-greeting>
```

`src/features/attributes/custom-element.js`

```js
const attrsMap = (attributes) => {
  return [...attributes].reduce(
    (acc, attribute) => ({ ...acc, [attribute.name]: attribute.value }),
    {},
  );
};

export const customElement = (render) => {
  return class extends HTMLElement {
    constructor() {
      super();
      this.innerHTML = render(attrsMap(this.attributes));
    }
  };
};
```

`src/features/attributes/greeting.js`

```js
import { customElement } from './custom-element-attrs.js';

export const Greeting = customElement(({ name }) => `<h1>Hello, ${name}!</h1>`);
```

### HyperScript

Current frontend frameworks using a render function to define component contents
from JavaScript use one of the following approaches to declare the markup:

- [JSX](https://react.dev/learn/writing-markup-with-jsx)
- [Tagged Templates](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#tagged_templates)
- A [HyperScript](https://github.com/hyperhype/hyperscript)-like syntax

Let's implement our own HyperScript-like syntax.

`src/features/hyperscript/hyperscript.js`

```js
const isString = (value) => typeof value === 'string';
const createTextNode = (content) => document.createTextNode(content);

export const createElement = ({ tagName, props = {}, children = [] }) => {
  const element = document.createElement(tagName);
  Object.assign(element, props);

  children.forEach((child) => {
    element.appendChild(isString(child) ? createTextNode(child) : child);
  });

  return element;
};
```

With the `createElement` function and a little bit of JavaScript magic, we can
create a clean API for building DOM elements.

`src/features/hyperscript/hyperscript.js`

```js
export const div = createElementPartial('div');
export const h1 = createElementPartial('h1');
export const p = createElementPartial('p');
```

We can declare as many element creators as we need, then we will use them to
build the component markup.

`src/features/hyperscript/greeting.js`

```js
import { customElement } from './custom-element.js';
import { h1, p } from './create-element.js';

export const Greeting = customElement(({ name }) => [
  h1(`Hello, ${name}!`),
  p('No fragments needed'),
  p({ style: 'background-color: grey; padding: 10px;' }, 'Optional parameters'),
]);
```

The `customElement` function has been updated to receive either a DOM tree or an
array of DOM trees.

`src/features/hyperscript/custom-element.js`

```js
export const customElement = (render) => {
  return class extends HTMLElement {
    constructor() {
      super();
      const children = [].concat(render(attrsMap(this.attributes)));

      children.forEach((child) => {
        this.appendChild(child);
      });
    }
  };
};
```

### Event Listeners

Let's add an `on` method to our HyperScript-created elements so we can attach
event listeners with ease.

The `on` method will be a context-free wrapper of `addEventListener`, meaning it
will be bound to the host element no matter where it is called from.

Also, the `on` method will support chaining, meaning each invocation will return
the host element.

`src/features/event-listeners/hyperscript.js`

```js
export const createElement = ({ tagName, props = {}, children = [] }) => {
  const element = document.createElement(tagName);

  element.on = (...args) => {
    element.addEventListener(...args);
    return element;
  };

  Object.assign(element, props);

  children.forEach((child) => {
    element.appendChild(isString(child) ? createTextNode(child) : child);
  });

  return element;
};
```

`src/features/event-listeners/click-me.js`

```js
import { customElement } from './custom-element.js';
import { h1, p, button } from './create-element.js';

export const ClickMe = customElement(({ title }) => [
  h1(`Hello, ${title}!`),
  p(
    [
      'You can attach event listeners with the `on` method',
      'which is a context-free version of `addEvenListener`',
      'and supports chaining.',
    ].join(' '),
  ),
  button('Click me').on('click', () => {
    console.log('clicked');
  }),
]);
```

## References

- <https://developer.mozilla.org/en-US/docs/Web/Web_Components>
- <https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements>
- <https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM>
- <https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_templates_and_slots>
