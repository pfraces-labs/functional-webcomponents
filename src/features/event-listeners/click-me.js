import { customElement } from './custom-element.js';
import { h1, p, button } from './hyperscript.js';

export const ClickMe = customElement(({ title }) => [
  h1(`Hello, ${title}!`),
  p(
    [
      'You can attach event listeners with the `on` method',
      'which is a context-free version of `addEvenListener`',
      'and supports chaining.'
    ].join(' ')
  ),
  button('Click me').on('click', () => {
    console.log('clicked');
  })
]);
