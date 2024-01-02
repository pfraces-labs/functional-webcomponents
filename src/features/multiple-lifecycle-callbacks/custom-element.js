const isFunction = (value) => typeof value === 'function';

const attrs = (attributes) => {
  return attributes.reduce(
    (acc, attribute) => ({ ...acc, [attribute.name]: attribute.value }),
    {}
  );
};

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
      super();
      const shadowRoot = this.attachShadow({ mode: 'open' });
      this.connectedListeners = [];
      this.disconnectedListeners = [];

      const shadowRootChildren = render({
        ...attrs([...this.attributes]),
        ...this.data,
        dispatch: bindDispatch(this),
        onConnected: bindOnConnected(this)
      });

      [].concat(shadowRootChildren).forEach((child) => {
        shadowRoot.appendChild(child);
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
