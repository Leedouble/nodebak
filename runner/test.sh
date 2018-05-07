#!/bin/sh
npm_path=/usr/local/nodejs/bin/npm
pm2_path=/usr/local/nodejs/bin/pm2
project_path=/home/www/server/api.com

cd ${project_path}
/usr/bin/git pull
/bin/rm -rf app
/bin/chown -R nobody:nobody ${project_path}/src
${npm_path} run compile
/bin/chown -R nobody:nobody ${project_path}/app
${pm2_path} startOrReload pm2_test.json