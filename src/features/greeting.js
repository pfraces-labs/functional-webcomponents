import { customElement } from './custom-element-string-attrs.js';

export const Greeting = customElement(function (attrs) {
  return `<h1>Hello, ${attrs.name}!</h1>`;
});
