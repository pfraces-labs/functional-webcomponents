export const HelloWorld = class extends HTMLElement {
  connectedCallback() {
    this.innerHTML = '<h1>Hello, World!</h1>';
  }
};
