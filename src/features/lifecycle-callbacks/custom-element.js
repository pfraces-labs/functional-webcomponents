const noop = () => {};

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
    target.connectedListener = () => {
      target.disconnectedListener = connectedListener();
    };
  };
};

export const customElement = (render) => {
  return class extends HTMLElement {
    constructor() {
      super();
      const shadowRoot = this.attachShadow({ mode: 'open' });
      this.connectedListener = noop;
      this.disconnectedListener = noop;

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
      this.connectedListener();
    }

    disconnectedCallback() {
      this.disconnectedListener();
    }
  };
};
