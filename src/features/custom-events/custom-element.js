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

export const customElement = (render) => {
  return class extends HTMLElement {
    constructor() {
      super();
      const shadowRoot = this.attachShadow({ mode: 'open' });

      const shadowRootChildren = render({
        ...attrs([...this.attributes]),
        dispatch: bindDispatch(this)
      });

      [].concat(shadowRootChildren).forEach((child) => {
        shadowRoot.appendChild(child);
      });
    }
  };
};
