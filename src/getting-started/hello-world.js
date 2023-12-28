export class HelloWorld extends HTMLElement {
  connectedCallback() {
    this.innerHTML = 'Hello world!';
  }
}
