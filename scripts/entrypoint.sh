#!/bin/sh
set -e

mkdir -p /app/data/uploads

node /app/scripts/init-db.mjs

exec node /app/server.js
