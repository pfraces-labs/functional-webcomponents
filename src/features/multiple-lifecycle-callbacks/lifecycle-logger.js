import { customElement } from './custom-element.js';
import { h1, p } from './hyperscript.js';

export const LifecycleLogger = customElement(({ onMount }) => {
  onMount(() => {
    console.log('1st `unMount`: Mounted');

    return () => {
      console.log('1st `unMount`: Unmounted');
    };
  });

  onMount(() => {
    console.log('2nd `unMount`: Mounted');

    return () => {
      console.log('2nd `unMount`: Unmounted');
    };
  });

  onMount(() => {
    console.log('3rd `unMount`: Mounted');

    return () => {
      console.log('3rd `unMount`: Unmounted');
    };
  });

  return [
    h1('Lyfecycle Logger'),
    p('Multiple lifecycle callbacks declared. Check out the console output.')
  ];
});
