export const customElement = (render) => {
  return class extends HTMLElement {
    constructor() {
      super();
      this.innerHTML = render();
    }
  };
};
