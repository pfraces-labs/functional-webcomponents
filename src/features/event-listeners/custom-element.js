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
      const children = [].concat(render(attrsMap(this.attributes)));

      children.forEach((child) => {
        this.appendChild(child);
      });
    }
  };
};
