#!/bin/bash
set -e # stop on error

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR
cd ..

npm run configGradle -- -p # passing -p as first argument to set to production

cd android
./gradlew assembleRelease
cd ..

echo "apk generated"

# copy to project root?
read -r -p "copy apk to home directory? [Y/n] " response
response=${response,,}    # tolower
if [[ $response =~ ^(yes|y|'')$ ]]; then
  NAME=$(cat package.json | python3 -c "import sys, json; print(json.load(sys.stdin)['name'])")
  VERSION=$(cat package.json | python3 -c "import sys, json; print(json.load(sys.stdin)['version'])")
  cp ./android/app/build/outputs/apk/app-release.apk ./"${NAME}"-release-"${VERSION}".apk
  echo "apk copied to project root directory"
fi

# config back for DEV?
read -r -p "config app for DEV? [Y/n] " response
response=${response,,}    # tolower
if [[ $response =~ ^(yes|y|'')$ ]]; then
  npm run configGradle
fi

exit 0
