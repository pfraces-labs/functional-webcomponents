const isString = (value) => typeof value === 'string';
const isObject = (value) => value?.constructor === Object;
const isArray = Array.isArray;

const createTextNode = (content) => document.createTextNode(content);

export const createElement = ({ tagName, props = {}, children = [] }) => {
  const element = document.createElement(tagName);
  Object.assign(element, props);

  children.forEach((child) => {
    element.appendChild(isString(child) ? createTextNode(child) : child);
  });

  return element;
};

const createElementConfig = (tagName, ...options) => {
  return options.reduce(
    (acc, option) => {
      if (isObject(option)) {
        return { ...acc, props: option };
      }

      if (isArray(option)) {
        return { ...acc, children: option };
      }

      if (isString(option)) {
        return { ...acc, children: [option] };
      }

      return acc;
    },
    { tagName }
  );
};

export const createElementPartial = (tagName) => {
  return (...options) => {
    return createElement(createElementConfig(tagName, ...options));
  };
};

export const template = createElementPartial('template');
export const div = createElementPartial('div');
export const h1 = createElementPartial('h1');
export const p = createElementPartial('p');
