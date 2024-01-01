import { customElement } from './custom-element.js';
import { style, h2, p } from './html-elements.js';

export const LandingPage = customElement(() => [
  style(`
    :host {
      display: block;
      background-color: lightgray;
      padding: 10px;
    }
  `),
  h2('Landing Page'),
  p('This is the content of the landing page')
]);
