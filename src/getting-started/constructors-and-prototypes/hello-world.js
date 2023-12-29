export function HelloWorld() {
  return Reflect.construct(HTMLElement, [], HelloWorld);
}

HelloWorld.prototype = Object.create(HTMLElement.prototype);

HelloWorld.prototype.connectedCallback = function () {
  this.innerHTML = '<h1>Hello, World!</h1>';
};
