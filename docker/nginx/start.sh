#!/bin/sh
set -eu

HTTP_TEMPLATE="/etc/nginx/templates/default.http.conf.template"
HTTPS_TEMPLATE="/etc/nginx/templates/default.https.conf.template"
TARGET_CONF="/etc/nginx/conf.d/default.conf"

CERT_PATH="/etc/letsencrypt/live/${SERVER_NAME}/fullchain.pem"
KEY_PATH="/etc/letsencrypt/live/${SERVER_NAME}/privkey.pem"

if [ -f "$CERT_PATH" ] && [ -f "$KEY_PATH" ]; then
  envsubst '${SERVER_NAME}' < "$HTTPS_TEMPLATE" > "$TARGET_CONF"
else
  envsubst '${SERVER_NAME}' < "$HTTP_TEMPLATE" > "$TARGET_CONF"
fi

exec nginx -g 'daemon off;'
