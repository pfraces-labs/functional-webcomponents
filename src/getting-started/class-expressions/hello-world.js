export const HelloWorld = class extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = '<h1>Hello, World!</h1>';
  }
};
