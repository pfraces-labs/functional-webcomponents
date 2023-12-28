export const HelloWorld = function () {
  return Reflect.construct(HTMLElement, [], HelloWorld);
};

HelloWorld.prototype = Object.create(HTMLElement.prototype);

HelloWorld.prototype.connectedCallback = function () {
  this.innerHTML = 'Hello world!';
};
