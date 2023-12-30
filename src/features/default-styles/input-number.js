import { customElement } from './custom-element.js';
import { h1, span, button } from './hyperscript.js';

export const InputNumber = customElement(({ value, dispatch }) => [
  h1('Input Number'),
  span(`Value: ${value} `),
  button('+').on('click', () => {
    dispatch('increment');
  }),
  button('-').on('click', () => {
    dispatch('decrement');
  })
]);
