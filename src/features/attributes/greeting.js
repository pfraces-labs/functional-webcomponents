import { customElement } from './custom-element-attrs.js';

export const Greeting = customElement(({ name }) => `<h1>Hello, ${name}!</h1>`);
