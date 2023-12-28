export const customElement = function (render) {
  const CustomElement = function () {
    return Reflect.construct(HTMLElement, [], CustomElement);
  };

  CustomElement.prototype = Object.create(HTMLElement.prototype);

  CustomElement.prototype.connectedCallback = function () {
    this.innerHTML = render();
  };

  return CustomElement;
};
