import { customElement } from './custom-element.js';
import { h1, ol, li, button } from './hyperscript.js';

export const OrderedList = customElement(({ items, dispatch }) => [
  h1('Ordered List'),
  ol(
    items.map((item) =>
      li(
        button(item).on('click', () => {
          dispatch('item-click', item);
        })
      )
    )
  )
]);
