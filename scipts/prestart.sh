#! /usr/bin/env bash

export $(grep -v "^#" ../../.env | xargs)

python ./neural_filter/manage.py createsuperuser <<EOF
$SUPERUSER_NAME
$SUPERUSER_EMAIL
$SUPERUSER_PASSWORD
$SUPERUSER_PASSWORD
EOF