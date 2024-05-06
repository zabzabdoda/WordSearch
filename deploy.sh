#!/bin/sh

echo "Building..."
npm run build > /dev/null 2>&1

cp -r build/ /var/www/zabzabdoda.com/

systemctl reload apache2

echo "Finished!"

