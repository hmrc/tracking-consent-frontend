import '@testing-library/jest-dom/extend-expect';
import removeElement from '../../src/common/removeElement';

describe('removeElement', () => {
  const element = {
    remove: jest.fn(),
    parentNode: {
      removeChild: jest.fn(),
    },
  };

  const ie10Element = {
    parentNode: {
      removeChild: jest.fn(),
    },
  };

  const ie10ElementNoParent = {};

  it('should execute the remove method on the element if it exists', () => {
    removeElement(element);

    expect(element.remove).toHaveBeenCalled();
    expect(element.parentNode.removeChild).not.toHaveBeenCalledWith();
  });

  it('should otherwise execute the parent element removeChild if element.remove does not exist', () => {
    removeElement(ie10Element);

    expect(ie10Element.parentNode.removeChild).toHaveBeenCalledWith(ie10Element);
  });

  it('if no parent element exists  nor a remove method, then it should execute without error', () => {
    removeElement(ie10ElementNoParent);
  });
});
