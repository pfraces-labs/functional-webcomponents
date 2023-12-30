import { customElement } from './custom-element.js';
import { h1, p } from './hyperscript.js';

export const SecondsCounter = customElement(({ onMount }) => {
  onMount(() => {
    let counter = 0;

    const intervalId = setInterval(() => {
      console.log(counter++);
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  });

  return [
    h1('Seconds Counter'),
    p(
      [
        'This component implements an internal counter that increments its',
        'value every second logging its updated value to the console.'
      ].join(' ')
    ),
    p(
      [
        'The counter is activated when the component mounts, and deactivated',
        'when unmounts.'
      ].join(' ')
    )
  ];
});
