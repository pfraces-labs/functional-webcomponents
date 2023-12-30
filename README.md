# Functional Web Components

This is a Proof of Concept for creating Custom Elements in a declarative and
functional fashion.

```js
import { customElement, h1 } from 'functional-web-components';

const GreetMe = customElement(({ name = 'World' }) => h1(`Hello, ${name}!`));

customElements.define('greet-me', GreetMe);
```

```html
<body>
  <greet-me name="Functional Web Components"></greet-me>
</body>
```

Result:

```html
<body>
  <h1>Hello, Functional Web Components!</h1>
</body>
```

## Introduction

[From classes to plain objects and pure functions](https://dev.to/hybrids/from-classes-to-plain-objects-and-pure-functions-2gip)

> The only way to create a custom element is to use a class, which extends
> `HTMLElement` and then define it with Custom Elements API.

```js
class GreetMe extends HTMLElement {
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
const GreetMe = customElement(({ name = 'World' }) => h1(`Hello, ${name}!`));
```

## Getting Started

Let's see how to create a simple web component with the default class syntax.

[src/getting-started/dom-api/hello-world.js](src/getting-started/dom-api/hello-world.js)

```js
export class HelloWorld extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = '<h1>Hello, World!</h1>';
  }
}
```

### Constructors & Prototypes

[What is the ES5 way of writing web component classes?](https://stackoverflow.com/questions/45747646/what-is-the-es5-way-of-writing-web-component-classes)

> To simulate the default ES6 constructor that calls `super()`, we can use
> `Reflect.construct` to invoke the `HTMLElement` constructor but using the
> prototype from our `HelloWorld` consutrctor.
>
> For inheritance, you need to set the prototype of the `HelloWorld` constructor
> to an instance of `HTMLElement` and define methods and properties on that.
> It's conventional to use use `Object.create()` to create a non-functional
> dummy instance without invoking the constructor here.

[ES5 consideration for custom elements](https://github.com/WICG/webcomponents/issues/423#issuecomment-199628425)

> `HTMLElement.call(this)` would not work but `Reflect.construct` would.
>
> All browsers that support custom elements v1 API would support
> `Reflect.construct`.

[Non-class based example of customElement.define()](https://github.com/WICG/webcomponents/issues/587#issuecomment-378684197)

```js
function MyEl() {
  return Reflect.construct(HTMLElement, [], this.constructor);
}

MyEl.prototype = Object.create(HTMLElement.prototype);
MyEl.prototype.constructor = MyEl;
Object.setPrototypeOf(MyEl, HTMLElement);
```

[src/getting-started/constructors-and-prototypes/hello-world.js](src/getting-started/constructors-and-prototypes/hello-world.js)

```js
export function HelloWorld() {
  const self = Reflect.construct(HTMLElement, [], this.constructor);
  self.innerHTML = '<h1>Hello, World!</h1>';
  return self;
}

HelloWorld.prototype = Object.create(HTMLElement.prototype);
HelloWorld.prototype.constructor = HelloWorld;
Object.setPrototypeOf(HelloWorld, HTMLElement);
```

### Class expressions

[Class expression](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/class)

Class expressions allows us to create classes dynamically reducing the
complexity of the "constructor & prototype" approach.

[src/getting-started/class-expressions/hello-world.js](src/getting-started/class-expressions/hello-world.js)

```js
export const HelloWorld = class extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = '<h1>Hello, World!</h1>';
  }
};
```

### Shadow DOM

[Using shadow DOM](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM)

> An important aspect of custom elements is encapsulation, because a custom
> element, by definition, is a piece of reusable functionality: it might be
> dropped into any web page and be expected to work. So it's important that code
> running in the page should not be able to accidentally break a custom element
> by modifying its internal implementation. Shadow DOM enables you to attach a
> DOM tree to an element, and have the internals of this tree hidden from
> JavaScript and CSS running in the page.

[src/getting-started/shadow-dom/hello-world.js](src/getting-started/shadow-dom/hello-world.js)

```js
export class HelloWorld extends HTMLElement {
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.innerHTML = '<h1>Hello, World!</h1>';
  }
}
```

### Render function

Once we have the basics to build custom elements without using the `class`
keyword we can create an abstraction to build them in a functional style.

The initial step is to provide an API to declare presentational Web Components
emulating the React functional components API.

[src/getting-started/render-function/custom-element.js](src/getting-started/render-function/custom-element.js)

```js
export const customElement = (render) => {
  return class extends HTMLElement {
    constructor() {
      super();
      const shadowRoot = this.attachShadow({ mode: 'open' });
      shadowRoot.innerHTML = render();
    }
  };
};
```

[src/getting-started/render-function/hello-world.js](src/getting-started/render-function/hello-world.js)

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
<greet-me name="World"></greet-me>
```

[src/features/attributes/custom-element.js](src/features/attributes/custom-element.js)

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
      const shadowRoot = this.attachShadow({ mode: 'open' });
      shadowRoot.innerHTML = render(attrsMap(this.attributes));
    }
  };
};
```

[src/features/attributes/greet-me.js](src/features/attributes/greet-me.js)

```js
import { customElement } from './custom-element.js';

export const GreetMe = customElement(({ name }) => `<h1>Hello, ${name}!</h1>`);
```

### HyperScript

Current frontend frameworks using a render function to define component contents
from JavaScript use one of the following approaches to declare the markup:

- [JSX](https://react.dev/learn/writing-markup-with-jsx)
- [Tagged Templates](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#tagged_templates)
- A [HyperScript](https://github.com/hyperhype/hyperscript)-like syntax

Let's implement our own HyperScript-like syntax.

[src/features/hyperscript/hyperscript.js](src/features/hyperscript/hyperscript.js)

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

[src/features/hyperscript/hyperscript.js](src/features/hyperscript/hyperscript.js)

```js
export const div = createElementPartial('div');
export const h1 = createElementPartial('h1');
export const p = createElementPartial('p');
```

We can declare as many element creators as we need, then we will use them to
build the component markup.

[src/features/hyperscript/greet-me.js](src/features/hyperscript/greet-me.js)

```js
import { customElement } from './custom-element.js';
import { h1, p } from './create-element.js';

export const GreetMe = customElement(({ name }) => [
  h1(`Hello, ${name}!`),
  p('No fragments needed'),
  p({ style: 'background-color: grey; padding: 10px;' }, 'Optional parameters'),
]);
```

The `customElement` function has been updated to receive either a DOM tree or an
array of DOM trees.

[src/features/hyperscript/custom-element.js](src/features/hyperscript/custom-element.js)

```js
export const customElement = (render) => {
  return class extends HTMLElement {
    constructor() {
      super();
      const shadowRoot = this.attachShadow({ mode: 'open' });
      const children = render(attrsMap(this.attributes));

      [].concat(children).forEach((child) => {
        shadowRoot.appendChild(child);
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

[src/features/event-listeners/hyperscript.js](src/features/event-listeners/hyperscript.js)

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

[src/features/event-listeners/click-me.js](src/features/event-listeners/click-me.js)

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

### Custom Events

JSX-based frameworks tend to pass callbacks through props from parent to child
to accomplish child to parent communication.

In contrast, with native DOM APIs, we add event listeners via `addEventListener`
to accomplish the same. This is a more intuitive abstraction if we consider
component events as its outputs.

We are going to provide a `dispatch` function through the component props which
will dispatch custom events.

[src/features/custom-events/custom-element.js](src/features/custom-events/custom-element.js)

```js
const customEventDispatcher = (element) => {
  return (eventName, detail) => {
    element.dispatchEvent(
      new CustomEvent(eventName, {
        bubbles: true,
        detail,
      }),
    );
  };
};

export const customElement = (render) => {
  return class extends HTMLElement {
    constructor() {
      super();
      const shadowRoot = this.attachShadow({ mode: 'open' });

      const children = render({
        dispatch: customEventDispatcher(this),
        ...attrsMap(this.attributes),
      });

      [].concat(children).forEach((child) => {
        shadowRoot.appendChild(child);
      });
    }
  };
};
```

[src/features/custom-events/input-number.js](src/features/custom-events/input-number.js)

```js
import { customElement } from './custom-element.js';
import { h1, span, button } from './hyperscript.js';

export const InputNumber = customElement(({ value, dispatch }) => [
  h1('Input Number'),
  span(`Value: ${value} `),
  button('+').on('click', () => {
    dispatch('increment');
  }),
  button('-').on('click', () => {
    dispatch('decrement');
  }),
]);
```

To match the default DOM events behavior, dispatched custom events will bubble
up through the parent nodes so we can listen to the component events from any of
its parents. This behavior also allows for implementing
[event delegation](https://davidwalsh.name/event-delegate).

[src/features/custom-events/index.html](src/features/custom-events/index.html)

```html
<body>
  <div id="container">
    <input-number value="0"></input-number>
  </div>

  <script>
    const container = document.getElementById('container');

    container.addEventListener('increment', (event) => {
      console.log({ event: 'increment', payload: event });
    });

    container.addEventListener('decrement', (event) => {
      console.log({ event: 'decrement', payload: event });
    });
  </script>
</body>
```

### Default Styles

[Style custom elements in HTML5](https://stackoverflow.com/a/40082136/1815446)

> HTML Custom Elements by default are defined as an undefined element, similar
> to a span. As an undefined element which the browser has never seen before,
> they have no default user agent styling and will be given inherited values and
> will be seen as an inline element which is the default for all elements apart
> from when a user agent stylesheet overrides it due to conforming with the W3C
> Recommendated defaults.

With the previous implementations, if we added a background color to a component
it only be applied to the text nodes. To apply styles to the whole component, we
need to declare the component as `display: block;`.

[src/features/default-styles/custom-element.js](src/features/default-styles/custom-element.js)

```js
const defaultStyleSheet = new CSSStyleSheet();
defaultStyleSheet.replaceSync(':host { display: block; }');

export const customElement = (render) => {
  return class extends HTMLElement {
    constructor() {
      super();
      const shadowRoot = this.attachShadow({ mode: 'open' });
      shadowRoot.adoptedStyleSheets = [defaultStyleSheet];

      const children = render({
        dispatch: customEventDispatcher(this),
        ...attrsMap(this.attributes),
      });

      [].concat(children).forEach((child) => {
        shadowRoot.appendChild(child);
      });
    }
  };
};
```

[src/features/default-styles/index.html](src/features/default-styles/index.html)

```html
<input-number value="0" style="background-color: lightgrey"></input-number>
```

At first, having `display: block;` applied to components seems a good default,
but it has its drawbacks:

- It adds more computation to the creation of new components which could mean a
  performance penalty when creating lots of them
- It changes the default behavior defined in the standard

For those reasons we are going to do without this feature and keep it just in
the default styles example for reference.

## References

- <https://developer.mozilla.org/en-US/docs/Web/Web_Components>
