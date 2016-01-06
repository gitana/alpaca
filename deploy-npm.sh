rm -r npm
mkdir npm
cp README.md npm
cp bower.json npm
cp -r dist npm
cp license.txt npm
cp package.json npm
cp -r src npm
cp -r tests npm
cp -r thirdparty npm
cd npm
npm publish --force
cd ..

