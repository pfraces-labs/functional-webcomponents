const noop = () => {};

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

const mountListener = (element) => {
  return (onMount) => {
    element.onMount = () => {
      element.onUnmount = onMount();
    };
  };
};

export const customElement = (render) => {
  return class extends HTMLElement {
    constructor() {
      super();
      const shadowRoot = this.attachShadow({ mode: 'open' });
      this.onMount = noop;
      this.onUnmount = noop;

      const children = render({
        ...attrsMap([...this.attributes]),
        ...this.data,
        dispatch: customEventDispatcher(this),
        onMount: mountListener(this)
      });

      [].concat(children).forEach((child) => {
        shadowRoot.appendChild(child);
      });
    }

    connectedCallback() {
      this.onMount();
    }

    disconnectedCallback() {
      this.onUnmount();
    }
  };
};
