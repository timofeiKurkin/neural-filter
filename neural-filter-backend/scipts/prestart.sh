#! /usr/bin/env bash

python ./neural_filter/manage.py migrate

python ./neural_filter/manage.py create_superuser
