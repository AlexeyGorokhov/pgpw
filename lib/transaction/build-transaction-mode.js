'use strict';

const pgp = require('pg-promise');

/**
 * Build an instance of TransactionMode
 *
 * @param {Object} transactionMode
 *
 * @return {TransactionMode}
 */
module.exports = function buildTransactionMode (transactionMode) {
  const { isolationLevel, TransactionMode } = pgp.txMode;

  const {
    isolationLevel: userDefinedIsolationLevel,
    isReadOnly,
    isDeferrable
  } = transactionMode;

  return new TransactionMode({
    tiLevel: isolationLevel[userDefinedIsolationLevel] || isolationLevel.none,
    ...(isReadOnly === true || isReadOnly === false ? { readOnly: isReadOnly } : {}),
    ...(isDeferrable === true || isDeferrable === false ? { deferrable: isDeferrable } : {})
  });
};
