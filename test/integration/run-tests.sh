#!/bin/bash

cd "${0%/*}"
#echo $PWD

docker-compose up -d

sleep 5

node create-db.js

cd -

./node_modules/.bin/tape 'test/integration/**/*.test.js' | ./node_modules/.bin/tap-summary

cd "${0%/*}"

docker-compose down -v
