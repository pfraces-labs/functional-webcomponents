import { customElement } from './custom-element.js';

export const GreetMe = customElement(({ name }) => `<h1>Hello, ${name}!</h1>`);
