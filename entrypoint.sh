#!/bin/sh

set -e

BASE_DIR=/usr/src/app

cd "${BASE_DIR}"

exec npm run start
