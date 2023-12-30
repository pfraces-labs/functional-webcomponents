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

export const customElement = (render) => {
  return class extends HTMLElement {
    constructor() {
      super();
      const shadowRoot = this.attachShadow({ mode: 'open' });

      const children = render({
        ...attrsMap([...this.attributes]),
        ...this.data,
        dispatch: customEventDispatcher(this)
      });

      [].concat(children).forEach((child) => {
        shadowRoot.appendChild(child);
      });
    }
  };
};
