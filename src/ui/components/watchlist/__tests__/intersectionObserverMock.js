global.IntersectionObserver = class IntersectionObserver {
  constructor(func, options) {
    this.func = func;
    this.options = options;
  }

  observe(element) {
    this.func([{ isIntersecting: true, target: element }]);
  }

  disconnect() {
    return null;
  }

  unobserve() {
    return null;
  }
};
