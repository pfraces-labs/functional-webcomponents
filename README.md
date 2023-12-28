# Functional WebComponents

<https://hybrids.js.org/#/getting-started/concepts>

> The only way to create a custom element is to use a class, which extends
> `HTMLElement` and then define it with Custom Elements API:

```js
class MyElement extends HTMLElement {
  // ...
}

customElements.define('my-element', MyElement);
```

> However, the class syntax is only a sugar on top of the constructors and
> prototypes.

## Getting Started

We are going to try several approaches for creating web components.

Each approach will be placed on its own file and imported to the main
`index.js` script which will load the custom component within the `hello-world` tag.

**src/index.js**

```js
import { HelloWorld } from './src/getting-started/hello-world.js';

customElements.define('hello-world', HelloWorld);
```

In the previous example we are importing the basic approach from the
`hello-world.js` script.

All approaches will export a `HelloWorld` class, so in order to test them we
just have to change the imported file name to match the desired approach.

```js
// Shadow DOM approach
import { HelloWorld } from './src/getting-started/hello-world-shadow-dom.js';
```

### Basic approach

Let's see how to create a simple web component with the default class syntax.

**src/getting-started/hello-world.js**

```js
export class HelloWorld extends HTMLElement {
  connectedCallback() {
    this.innerHTML = 'Hello world!';
  }
}
```

### Basic approach with Shadow DOM

**src/getting-started/hello-world-shadow-dom.js**

```js
export class HelloWorld extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.innerHTML = 'Hello world!';
  }
}
```

### No `class` approach

<https://stackoverflow.com/questions/45747646/what-is-the-es5-way-of-writing-web-component-classes>

To simulate the default ES6 constructor that calls `super()`, we can use
`Reflect.construct` to invoke the `HTMLElement` constructor but using the
prototype from our `HelloWorld` consutrctor.

For inheritance, you need to set the prototype of the `HelloWorld` constructor
to an instance of `HTMLElement` and define methods and properties on that. It's
conventional to use use `Object.create()` to create a non-functional dummy
instance without invoking the constructor here.

<https://github.com/WICG/webcomponents/issues/423>

`HTMLElement.call(this)` would not work but `Reflect.construct` would.

All browsers that support custom elements v1 API would support
`Reflect.construct`.

**src/getting-started/hello-world-noclass.js**

```js
export const HelloWorld = function () {
  return Reflect.construct(HTMLElement, [], HelloWorld);
};

HelloWorld.prototype = Object.create(HTMLElement.prototype);

HelloWorld.prototype.connectedCallback = function () {
  this.innerHTML = 'Hello world!';
};
```

## Functional custom elements

Once we have the basics to build components without using the `class` keyword
we can create an abstraction to build them in a functional style.

The initial step is to provide an API to declare presentational Web Components
emulating the React functional components API.

**src/functional-custom-elements/custom-element-noclass.js**

```js
export const customElement = function (render) {
  const CustomElement = function () {
    return Reflect.construct(HTMLElement, [], CustomElement);
  };

  CustomElement.prototype = Object.create(HTMLElement.prototype);

  CustomElement.prototype.connectedCallback = function () {
    this.innerHTML = render();
  };

  return CustomElement;
};
```

**src/functional-custom-elements/hello-world.js**

```js
import { customElement } from './custom-element.js';

export const HelloWorld = customElement(function () {
  return 'Hello World';
});
```

### Class expressions

<https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/class>

I didn't know about class expressions which allow to create classes dynamically
reducing the complexity of the `customElement` implementation:

**src/functional-custom-elements/custom-element.js**

```js
export const customElement = function (render) {
  return class extends HTMLElement {
    constructor() {
      super();
      this.innerHTML = render();
    }
  };
};
```

## Features

Once we have a basic functional custom element implementation we can build other
features on top

### Get string data from element attributes

We can reflect attribute values by iterating `this.attributes` from the
`constructor`.

**src/features/custom-element-string-attrs.js**

```js
const attrs = function (attributes) {
  return [...attributes].reduce(function (acc, attribute) {
    acc[attribute.name] = attribute.value;
    return acc;
  }, {});
};

export const customElement = function (render) {
  return class extends HTMLElement {
    constructor() {
      super();
      this.innerHTML = render(attrs(this.attributes));
    }
  };
};
```

**src/features/greeting.js**

```js
import { customElement } from './custom-element-string-attrs.js';

export const Greeting = customElement(function (attrs) {
  return `<h1>Hello, ${attrs.name}!</h1>`;
});
```

**src/index.html**

```html
<app-greeting name="World"></app-greeting>
```

## References

- <https://developer.mozilla.org/en-US/docs/Web/Web_Components>
- <https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements>
- <https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM>
- <https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_templates_and_slots>
