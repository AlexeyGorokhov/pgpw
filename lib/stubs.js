'use strict';

module.exports = function stubs ({
  execFunc = () => Promise.resolve(null),
  transaction = () => Promise.resolve(null)
} = {}) {
  return () => ({
    execFunc,
    transaction
  });
};
