#!/bin/sh

echo "Building..."
npm run build > /dev/null 2>&1

cp -r build/ /var/www/zabzabdoda.com/

systemctl reload apache2

systemctl restart express.service

echo "Finished!"

