const attrs = function (attributes) {
  return [...attributes].reduce(function (acc, attribute) {
    acc[attribute.name] = attribute.value;
    return acc;
  }, {});
};

export const customElement = function (render) {
  return class extends HTMLElement {
    constructor() {
      super();
      this.innerHTML = render(attrs(this.attributes));
    }
  };
};
