import { customElement } from './custom-element.js';
import { h1, p } from './create-element.js';

export const Greeting = customElement(({ name }) => [
  h1(`Hello, ${name}!`),
  p('No fragments needed'),
  p(
    { style: 'background-color: lightblue; padding: 10px;' },
    'Optional parameters',
  ),
]);
