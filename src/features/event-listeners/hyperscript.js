const isString = (value) => typeof value === 'string';
const isPlainObject = (value) => value?.constructor === Object;
const isArray = Array.isArray;

const createTextNode = (content) => document.createTextNode(content);

export const createElement = ({ tagName, props = {}, children = [] }) => {
  const element = document.createElement(tagName);
  Object.assign(element, props);

  element.on = (...args) => {
    element.addEventListener(...args);
    return element;
  };

  children.forEach((child) => {
    element.appendChild(isString(child) ? createTextNode(child) : child);
  });

  return element;
};

const createElementConfig = (tagName, ...options) => {
  return options.reduce(
    (acc, option) => {
      if (isPlainObject(option)) {
        return { ...acc, props: option };
      }

      if (isArray(option)) {
        return { ...acc, children: option };
      }

      return { ...acc, children: [option] };
    },
    { tagName }
  );
};

export const createElementPartial = (tagName) => {
  return (...options) => {
    return createElement(createElementConfig(tagName, ...options));
  };
};

export const h1 = createElementPartial('h1');
export const p = createElementPartial('p');
export const button = createElementPartial('button');
