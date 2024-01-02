import { customElement } from './custom-element.js';
import { h1, p } from './hyperscript.js';

export const LifecycleLogger = customElement(({ onConnected }) => {
  onConnected(() => {
    console.log('1st `onConnected`: Connected');

    return () => {
      console.log('1st `onConnected`: Disconnected');
    };
  });

  onConnected(() => {
    console.log('2nd `onConnected`: Connected');

    return () => {
      console.log('2nd `onConnected`: Disconnected');
    };
  });

  onConnected(() => {
    console.log('3rd `onConnected`: Connected');

    return () => {
      console.log('3rd `onConnected`: Disconnected');
    };
  });

  return [
    h1('Lyfecycle Logger'),
    p('Multiple lifecycle callbacks declared. Check out the console output.')
  ];
});
