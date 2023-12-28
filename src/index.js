import { HelloWorld } from './functional-custom-elements/hello-world.js';
import { Greeting } from './features/greeting.js';

customElements.define('hello-world', HelloWorld);
customElements.define('app-greeting', Greeting);
