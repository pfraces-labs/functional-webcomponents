export class HelloWorld extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.innerHTML = '<h1>Hello, World!</h1>';
  }
}
