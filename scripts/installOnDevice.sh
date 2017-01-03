#!/bin/bash
set -e # stop on error

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR
cd ..

npm run configGradle -- $1 # pass -p as first argument to set to production

if [ "$1" = '-p' ]; then
  cd android
  ./gradlew assembleRelease
  cd ..
fi

if [ "$1" = '-p' ]; then
  react-native run-android --variant=release
else
  react-native run-android
fi

if [ "$1" = '-p' ]; then
  read -r -p "configure gradlew back to DEV? [Y/n] " response
  response=${response,,}    # tolower
  if [[ $response =~ ^(yes|y|'')$ ]]; then
    npm run configGradle
  fi
fi

exit 0
