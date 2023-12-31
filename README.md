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
const attrs = (attributes) => {
  return attributes.reduce(
    (acc, attribute) => ({ ...acc, [attribute.name]: attribute.value }),
    {}
  );
};

export const customElement = (render) => {
  return class extends HTMLElement {
    constructor() {
      super();
      const shadowRoot = this.attachShadow({ mode: 'open' });
      shadowRoot.innerHTML = render(attrs([...this.attributes]));
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

Current frontend frameworks use one of the following approaches to declare the
markup from JavaScript:

- [JSX](https://react.dev/learn/writing-markup-with-jsx)
- [Tagged Templates](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#tagged_templates)
- A [HyperScript](https://github.com/hyperhype/hyperscript)-like syntax

Let's implement our own HyperScript engine since it is the simpler approach.

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

Let's write a wrapper on top of `createElement` to use a cleaner API for
building DOM elements.

[src/features/hyperscript/hyperscript.js](src/features/hyperscript/hyperscript.js)

```js
const createElementConfig = (tagName, ...options) => {
  return options.reduce(
    (acc, option) => {
      if (isPlainObject(option)) {
        return { ...acc, props: option };
      }

      if (isArray(option)) {
        return { ...acc, children: option };
      }

      return { ...acc, children: [option] };
    },
    { tagName }
  );
};

export const createElementPartial = (tagName) => {
  return (...options) => {
    return createElement(createElementConfig(tagName, ...options));
  };
};

export const h1 = createElementPartial('h1');
export const p = createElementPartial('p');
```

We can define as many element creators as we need to be used from our components
to declare the markup.

[src/features/hyperscript/greet-me.js](src/features/hyperscript/greet-me.js)

```js
import { customElement } from './custom-element.js';
import { h1, p } from './create-element.js';

export const GreetMe = customElement(({ name }) => [
  h1(`Hello, ${name}!`),
  p('No fragments needed'),
  p({ style: 'background-color: grey; padding: 10px;' }, 'Optional parameters')
]);
```

The `customElement` function has been updated to receive either a DOM node or an
array of DOM nodes.

[src/features/hyperscript/custom-element.js](src/features/hyperscript/custom-element.js)

```js
export const customElement = (render) => {
  return class extends HTMLElement {
    constructor() {
      super();
      const shadowRoot = this.attachShadow({ mode: 'open' });
      const shadowRootChildren = render(attrs([...this.attributes]));

      [].concat(shadowRootChildren).forEach((child) => {
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
  element.on = (...args) => {
    element.addEventListener(...args);
    return element;
  };
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
      'and supports chaining.'
    ].join(' ')
  ),
  button('Click me').on('click', () => {
    console.log('clicked');
  })
]);
```

### Custom Events

JSX-based frameworks tend to pass callbacks through props from parent to child
to accomplish child-to-parent communication.

In contrast, with native DOM APIs, we add event listeners via `addEventListener`
to accomplish the same. This is a more intuitive abstraction if we consider
component events as its outputs.

We are going to provide a `dispatch` function through the component props to
dispatch custom events.

[src/features/custom-events/custom-element.js](src/features/custom-events/custom-element.js)

```js
const bindDispatch = (target) => {
  return (eventName, detail) => {
    target.dispatchEvent(
      new CustomEvent(eventName, {
        bubbles: true,
        detail
      })
    );
  };
};

export const customElement = (render) => {
  return class extends HTMLElement {
    constructor() {
      const shadowRootChildren = render({
        ...attrs([...this.attributes])
        dispatch: bindDispatch(this),
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
  })
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
    }
  };
};
```

[src/features/default-styles/index.html](src/features/default-styles/index.html)

```html
<input-number value="0" style="background-color: lightgrey"></input-number>
```

Having `display: block;` applied to components seems a good default, but it
changes the default behavior defined in the standard

For now, we are going to do without this feature and keep it just in the default
styles example for reference.

## Complex Data

By using attributes, we can only pass string values to the components. To pass
any kind of data we need to make use of the component properties.

We are already passing data through properties when using our HyperScript
functions.

[src/features/complex-data/hyperscript.js](src/features/complex-data/hyperscript.js)

```js
export const createElement = ({ tagName, props = {}, children = [] }) => {
  Object.assign(element, props);
};
```

What is lacking is the ability to read those properties from the component
definition.

We want both attributes and properties as inputs of our components. We will use
attributes when using the component from HTML and properties when using the
component from another component through HyperScript.

Also, we want to provide only explicitly declared properties, hiding away the
ones provided by the DOM. For this reason we are going to use a custom `data`
property to pass complex data to components.

[src/features/complex-data/custom-element.js](src/features/complex-data/custom-element.js)

```js
export const customElement = (render) => {
  return class extends HTMLElement {
    constructor() {
      const shadowRootChildren = render({
        ...attrs([...this.attributes]),
        ...this.data,
        dispatch: bindDispatch(this)
      });
    }
  };
};
```

[src/features/complex-data/ordered-list.js](src/features/complex-data/ordered-list.js)

```js
import { customElement } from './custom-element.js';
import { h1, ol, li, button } from './hyperscript.js';

export const OrderedList = customElement(({ items, dispatch }) => [
  h1('Ordered List'),
  ol(
    items.map((item) =>
      li(
        button(item).on('click', () => {
          dispatch('item-click', item);
        })
      )
    )
  )
]);
```

[src/features/complex-data/index.html](src/features/complex-data/index.html)

```html
<body>
  <ordered-list></ordered-list>

  <script>
    const orderedList = document.querySelector('ordered-list');
    orderedList.data = { items: ['Foo', 'Bar', 'Qux'] };

    orderedList.addEventListener('item-click', ({ detail }) => {
      console.log(detail);
    });
  </script>
</body>
```

`OrderList` component can access the attached `data` property since the inline
script code is executed before the component `constructor`.

### Lifecycle Callbacks

[Custom element lifecycle callbacks](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements#custom_element_lifecycle_callbacks)

> Once your custom element is registered, the browser will call certain methods
> of your class when code in the page interacts with your custom element in
> certain ways. By providing an implementation of these methods, which the
> specification calls lifecycle callbacks, you can run code in response to these
> events.

Custom element lifecycle callbacks:

- `connectedCallback()`: called each time the element is added to the document.
- `disconnectedCallback()`: called each time the element is removed from the
  document.
- `adoptedCallback()`: called each time the element is moved to a new document.
- `attributeChangedCallback()`: called when attributes are changed, added,
  removed, or replaced.

  For now, we are going to implement a wrapper for `connectedCallback` and
  `disconnectedCallback`.

```js
class MyCustomElement extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    console.log('Custom element added to page.');
  }

  disconnectedCallback() {
    console.log('Custom element removed from page.');
  }
}
```

We are going to provide a `onConnected` function through the component props
which will let us use the `connectedCallback` and `disconnectedCallback`
lifecycle callbacks with a syntax similar to React's `useEffect`:

```js
onConnected(() => function onDisconnected() {});
```

[src/features/lifecycle-callbacks/custom-element.js](src/features/lifecycle-callbacks/custom-element.js)

```js
const bindOnConnected = (target) => {
  return (connectedListener) => {
    target.connectedListener = () => {
      target.disconnectedListener = connectedListener();
    };
  };
};

export const customElement = (render) => {
  return class extends HTMLElement {
    constructor() {
      this.connectedListener = noop;
      this.disconnectedListener = noop;

      const shadowRootChildren = render({
        onMount: bindOnConnected(this)
      });
    }

    connectedCallback() {
      this.connectedListener();
    }

    disconnectedCallback() {
      this.disconnectedListener();
    }
  };
};
```

[src/features/lifecycle-callbacks/seconds-counter.js](src/features/lifecycle-callbacks/seconds-counter.js)

```js
import { customElement } from './custom-element.js';
import { h1, p } from './hyperscript.js';

export const SecondsCounter = customElement(({ onConnected }) => {
  onConnected(() => {
    let counter = 0;

    const intervalId = setInterval(() => {
      console.log(counter++);
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  });

  return [
    h1('Seconds Counter'),
    p(
      [
        'This component implements an internal counter that increments its',
        'value every second logging its updated value to the console.'
      ].join(' ')
    ),
    p(
      [
        'The counter is activated when the component is connected to the DOM,',
        'and deactivated when it is disconnected.'
      ].join(' ')
    )
  ];
});
```

[src/features/lifecycle-callbacks/index.html](src/features/lifecycle-callbacks/index.html)

```html
<body>
  <button id="mount-toggler">Unmount</button>

  <div id="container">
    <seconds-counter id="seconds-counter"></seconds-counter>
  </div>

  <script type="module">
    const container = document.getElementById('container');
    const secondsCounter = document.getElementById('seconds-counter');
    const mountToggler = document.getElementById('mount-toggler');

    mountToggler.addEventListener('click', () => {
      if (mountToggler.textContent === 'Unmount') {
        secondsCounter.remove();
        mountToggler.textContent = 'Mount';
        return;
      }

      container.appendChild(secondsCounter);
      mountToggler.textContent = 'Unmount';
    });
  </script>
</body>
```

### Multiple LifeCycle Callbacks

With the previous implementation, if we call `onConnected` more than once, each
call will overwrite the previous one. The last `onConnected` call will be the
only one being executed.

[src/features/multiple-lifecycle-callbacks/lifecycle-logger.js](src/features/multiple-lifecycle-callbacks/lifecycle-logger.js)

```js
import { customElement } from './custom-element.js';
import { h1, p } from './hyperscript.js';

export const LifecycleLogger = customElement(({ onConnected }) => {
  onConnected(() => {
    console.log('1st `onConnected`: Connected');

    return () => {
      console.log('1st `onConnected`: Disconnected');
    };
  });

  onConnected(() => {
    console.log('2nd `onConnected`: Connected');

    return () => {
      console.log('2nd `onConnected`: Disconnected');
    };
  });

  onConnected(() => {
    console.log('3rd `onConnected`: Connected');

    return () => {
      console.log('3rd `onConnected`: Disconnected');
    };
  });

  return [
    h1('Lyfecycle Logger'),
    p('Multiple lifecycle callbacks declared. Check out the console output.')
  ];
});
```

Console output after unmounting:

```text
3rd `onConnected`: Connected
3rd `onConnected`: Disconnected
```

What we want is to be able to declare lifecycle callbacks multiple times so we
can separate concerns.

Desired output after unmounting:

```text
1st `onConnected`: Connected
2nd `onConnected`: Connected
3rd `onConnected`: Connected
1st `onConnected`: Disconnected
2nd `onConnected`: Disconnected
3rd `onConnected`: Disconnected
```

[src/features/multiple-lifecycle-callbacks/custom-element.js](src/features/multiple-lifecycle-callbacks/custom-element.js)

```js
const bindOnConnected = (target) => {
  return (connectedListener) => {
    target.connectedListeners.push(() => {
      const disconnectedListener = connectedListener();

      if (isFunction(disconnectedListener)) {
        target.disconnectedListeners.push(disconnectedListener);
      }
    });
  };
};

export const customElement = (render) => {
  return class extends HTMLElement {
    constructor() {
      this.connectedListeners = [];
      this.disconnectedListeners = [];

      const shadowRootChildren = render({
        onConnected: bindOnConnected(this)
      });
    }

    connectedCallback() {
      this.connectedListeners.forEach((connectedListener) => {
        connectedListener();
      });
    }

    disconnectedCallback() {
      this.disconnectedListeners.forEach((disconnectedListener) => {
        disconnectedListener();
      });

      this.disconnectedListeners = [];
    }
  };
};
```

Replacing `disconnectedListeners` with an empty array at the end of
`disconnectedCallback` is needed, otherwise subsequent `connectedListener` calls
would cause undesired `disconnectedListener` duplication.

### Component Composition

[Content Projection](https://angular.io/guide/content-projection)

> Content projection is a pattern in which you insert, or project, the content
> you want to use inside another component. For example, you could have a Card
> component that accepts content provided by another component.

```html
<card-component>
  <another-component></another-component>
</card-component>
```

[Composition and slots](https://www.webcomponents.org/specs#composition-and-slots)

> By default, if an element has shadow DOM, the shadow tree is rendered instead
> of the element's children. To allow children to render, you need to add
> placeholders for them in your shadow tree.
>
> Consider the following shadow tree for `<my-header>`:

```html
<header>
  <h1><slot></slot></h1>
  <button>Menu</button>
</header>
```

> The user can add children like this:

```html
<my-header>Shadow DOM</my-header>
```

Let's use slots from the HTML spec to accomplish content projection.

[Using templates and slots](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_templates_and_slots)

> An unnamed slot will be filled with all of the custom element's top-level
> child nodes that do not have the slot attribute. This includes text nodes.

Although not specified in the documentation, it seems that slots can already be
used outside the template element.

Thanks to HTML slots, we don't need to code any specific behavior in our
`customElement` implementation to accomplish content projection.

[src/features/component-composition/html-elements.js](src/features/component-composition/html-elements.js)

```js
export const style = createElementPartial('style');
export const slot = createElementPartial('slot');
```

[src/features/component-composition/app-layout.js](src/features/component-composition/app-layout.js)

```js
import { customElement } from './custom-element.js';
import { style, h1, slot } from './html-elements.js';

export const AppLayout = customElement(() => [
  style(`
    .header {
      margin: 0;
      padding: 5px 10px;
      background-color: #0079bf;
      color: white;
      font-size: 1.8rem;
    }
  `),
  h1({ className: 'header' }, slot({ name: 'app-name' }, 'App Name')),
  slot()
]);
```

[src/features/component-composition/landing-page.js](src/features/component-composition/landing-page.js)

```js
import { customElement } from './custom-element.js';
import { style, h2, p } from './html-elements.js';

export const LandingPage = customElement(() => [
  style(`
    :host {
      display: block;
      background-color: lightgray;
      padding: 10px;
    }
  `),
  h2('Landing Page'),
  p('This is the content of the landing page')
]);
```

[src/features/component-composition/index.html](src/features/component-composition/index.html)

```html
<body>
  <style>
    body {
      margin: 0;
      font-family: sans-serif;
    }
  </style>

  <app-layout>
    <span slot="app-name">Functional Web Components</span>

    <landing-page></landing-page>

    <p>Children without a slot attribute are added to the unnamed slot</p>

    <ul>
      <li>Foo</li>
      <li>Bar</li>
      <li>Qux</li>
    </ul>
  </app-layout>
</body>
```

## References

- [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components)
- [Web components Series' Articles](https://dev.to/joanllenas/series/20725)
- [Custom Element Best Practices](https://web.dev/articles/custom-elements-best-practices)
- [Handling data with Web Components](https://itnext.io/handling-data-with-web-components-9e7e4a452e6e)
