#!/bin/sh
envsubst < /usr/share/nginx/html/index.tmpl.html > /usr/share/nginx/html/index.html && nginx -g 'daemon off;' || cat /usr/share/nginx/html/index.html