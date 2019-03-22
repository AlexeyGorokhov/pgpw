#!/bin/bash

set -u

OVERALL_EXIT_CODE=0

# Run tests with retries in parallel shells

  echo "--- Function tests with retries ---"
  (
    ./node_modules/.bin/tape 'test/integration/func-retries.test.js' | \
      ./node_modules/.bin/tap-summary
  ) &

  echo "--- Transaction tests with retries ---"
  (
    ./node_modules/.bin/tape 'test/integration/transaction-retries.test.js' | \
      ./node_modules/.bin/tap-summary
  ) &

# Start db
  cd "${0%/*}"
  # Allow operations without retries in tests with retries to fail
  sleep 3
  docker-compose up -d
  sleep 5
  node create-db.js

# Wait parallel shells to finish
wait %1 || OVERALL_EXIT_CODE=1
wait %2 || OVERALL_EXIT_CODE=1

# Run test without retries
  echo "--- Tests without retries ---"
  cd -
  ./node_modules/.bin/tape 'test/integration/basic.test.js' | \
    ./node_modules/.bin/tap-summary

  if [ "$?" -ne 0 ]; then
    OVERALL_EXIT_CODE=1
  fi

cd "${0%/*}"
docker-compose down -v

if [ $OVERALL_EXIT_CODE -ne 0 ]; then
  echo "Tests FAILED";
fi

exit $OVERALL_EXIT_CODE
