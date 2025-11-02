#!/usr/bin/env bash

set -e
set -x

python neural_filter/manage.py migrate

python neural_filter/manage.py create_superuser
