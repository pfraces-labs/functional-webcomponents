const attrsMap = (attributes) => {
  return [...attributes].reduce(
    (acc, attribute) => ({ ...acc, [attribute.name]: attribute.value }),
    {}
  );
};

export const customElement = (render) => {
  return class extends HTMLElement {
    constructor() {
      super();
      this.innerHTML = render(attrsMap(this.attributes));
    }
  };
};
