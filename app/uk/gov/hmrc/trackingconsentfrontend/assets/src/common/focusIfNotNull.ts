import callIfNotNull from './callIfNotNull';

const focusIfNotNull = (element: HTMLElement | null) => {
  callIfNotNull(element, (notNullElement) => notNullElement.focus());
};

export default focusIfNotNull;
