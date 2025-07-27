#!/bin/bash

command=${1:-"db:seed:all"}

for envfile in $(find . -name '.*.env' | sort); do
  echo "Seeding ${envfile} | Command: ${command}"
  echo
  ENV_FILE=${envfile} npx sequelize ${command}
  echo '-----'
  echo ''
done
