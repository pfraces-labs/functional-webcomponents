import { customElement } from './custom-element.js';
import { style, h1, slot } from './html-elements.js';

export const AppLayout = customElement(() => [
  style(`
    .header {
      margin: 0;
      padding: 5px 10px;
      background-color: #0079bf;
      color: white;
      font-size: 1.8rem;
    }
  `),
  h1({ className: 'header' }, slot({ name: 'app-name' }, 'App Name')),
  slot()
]);
