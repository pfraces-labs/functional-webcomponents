const isFunction = (value) => typeof value === 'function';

const attrsMap = (attributes) => {
  return attributes.reduce(
    (acc, attribute) => ({ ...acc, [attribute.name]: attribute.value }),
    {}
  );
};

const customEventDispatcher = (element) => {
  return (eventName, detail) => {
    element.dispatchEvent(
      new CustomEvent(eventName, {
        bubbles: true,
        detail
      })
    );
  };
};

const addMountListener = (element) => {
  return (mountListener) => {
    element.mountListeners.push(() => {
      const unmountListener = mountListener();

      if (isFunction(unmountListener)) {
        element.unmountListeners.push(unmountListener);
      }
    });
  };
};

export const customElement = (render) => {
  return class extends HTMLElement {
    constructor() {
      super();
      const shadowRoot = this.attachShadow({ mode: 'open' });
      this.mountListeners = [];
      this.unmountListeners = [];

      const shadowRootChildren = render({
        ...attrsMap([...this.attributes]),
        ...this.data,
        dispatch: customEventDispatcher(this),
        onMount: addMountListener(this)
      });

      [].concat(shadowRootChildren).forEach((child) => {
        shadowRoot.appendChild(child);
      });
    }

    connectedCallback() {
      this.mountListeners.forEach((listener) => {
        listener();
      });
    }

    disconnectedCallback() {
      const unmountListeners = this.unmountListeners;
      this.unmountListeners = [];

      unmountListeners.forEach((listener) => {
        listener();
      });
    }
  };
};
