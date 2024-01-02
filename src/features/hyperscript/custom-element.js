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
      const shadowRootChildren = render(attrs([...this.attributes]));

      [].concat(shadowRootChildren).forEach((child) => {
        shadowRoot.appendChild(child);
      });
    }
  };
};
