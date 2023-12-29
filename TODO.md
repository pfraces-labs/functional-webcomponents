# To Do

## Project

- [x] Format Markdown with Prettier: 80-characters print width
- [x] Live reload
- [x] Standalone examples
- [ ] ESLint: Unused and undeclared variables

## Getting Started

- [x] DOM API
- [x] Shadow DOM
- [x] Constructors & Prototypes
- [x] Class expressions
- [x] Render function (`render(state) => dom`)

## Features

- [x] Attributes
- [x] HyperScript
- [x] Event listeners
- [x] Custom events
- [ ] Display block (`:host { display: block; }`)
- [ ] Complex data (element props)
- [ ] Children rendering (slots?)
- [ ] Lifecycle hooks (`onMount() => onUnmount`)
- [ ] Conditional rendering
- [ ] React to state changes
- [ ] Pure and Stateful components
- [ ] Fine-grained reactivity (re-render only what is needed)

## Research

- [x] Benefits and drawbacks of using Shadow DOM
- [ ] Component contents: `constructor` vs `connectedCallback`
  - <https://stackoverflow.com/questions/63066330/create-webcomponent-through-createelement>
- [ ] Benefits and drawbacks of using `<template>` clones
- [ ] Template interpolation (slots?)
- [ ] Are `document.createElement`-created elements innert?
- [ ] How to theme Shadow DOM CSS (CSS vars?)
- [ ] Change detection (`Proxy`, `MutationObserver`, getters/setters, signals)
