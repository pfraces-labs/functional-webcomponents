export const customElement = function (render) {
  return class extends HTMLElement {
    constructor() {
      super();
      this.innerHTML = render();
    }
  };
};
