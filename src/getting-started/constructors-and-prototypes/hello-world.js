export function HelloWorld() {
  const self = Reflect.construct(HTMLElement, [], this.constructor);
  self.innerHTML = '<h1>Hello, World!</h1>';
  return self;
}

HelloWorld.prototype = Object.create(HTMLElement.prototype);
HelloWorld.prototype.constructor = HelloWorld;
Object.setPrototypeOf(HelloWorld, HTMLElement);
