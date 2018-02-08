'use strict';

module.exports = function stubs ({
  execFunc = () => Promise.resolve(null),
  transaction = () => Promise.resolve(null)
} = {}) {
  return () => ({
    execFunc: Array.isArray(execFunc) ? createMultipleCalls(execFunc) : execFunc,
    transaction: Array.isArray(transaction) ? createMultipleCalls(transaction) : transaction
  });
};

function createMultipleCalls (fns) {
  let counter = 0;

  return () => {
    if (counter === fns.length) {
      return fns[counter - 1].call(null);
    }

    return fns[counter++].call(null);
  };
}
