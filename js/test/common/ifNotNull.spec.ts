import callIfNotNull from '../../src/common/callIfNotNull';

describe('ifNotNull', () => {
  it('should execute the callback if the element is not null', () => {
    const callback = jest.fn();
    callIfNotNull({}, callback);

    expect(callback).toHaveBeenCalledWith({});
  });

  it('should not execute the callback if the element is null', () => {
    const callback = jest.fn();
    callIfNotNull(null, callback);

    expect(callback).not.toHaveBeenCalled();
  });
});
