VERSION="$(node server/version)"
BRANCH="$VERSION-release"
ZIP="alpaca-$VERSION.zip"

echo Deploying version $VERSION

rm -r deploy.log

#
# SETUP
#

# switch to master branch
# create a local branch <version>-release
git checkout master
git checkout -b $BRANCH

# initial clean
rm -r build
rm -r npm
rm -r lib
mkdir -p build
rm -r package.json.npm


#
# STEP 1: BUILD ALPACA, WEB SITE JSDOCS
#

./node_modules/.bin/bower install

# build alpaca
# build web site
# copy to dist (for bower)
./node_modules/.bin/gulp _deploy

# build jsdoc
./node_modules/.bin/grunt jsdoc

# add the ./dist directory to the commit
git add dist -f

# commit changes to local branch
git commit -m "alpaca release build $VERSION"




#
# STEP 2: PUBLISH DISTRIBUTION FILES TO CDN
#

# publish alpaca to CDN
grunt publish




#
# STEP 3: TAG REPO FOR BOWER
#

# create a tag
git tag $VERSION

# push the tag
#git push origin $BRANCH --tags
git push origin $VERSION



#
# STEP 4: NPM
# This copies essentials into a new directory.
# And then publishes that directory.
#
rm -r npm
mkdir npm
cp README.md npm
cp bower.json npm
cp -r dist npm
cp license.txt npm
cp package.json.npm npm/package.json
cp -r src npm
cp -r tests npm
cp -r thirdparty npm
cd npm
npm publish --force
cd ..
rm -r npm
rm -r package.json.npm



#
# STEP 5: PUBLISH WEB SITE
#

rm -R build/$ZIP
cd build/web
zip -r ../$ZIP *
cd ../..
echo Copying ZIP file to web server
scp -i ~/keys/gitana.pem -r build/$ZIP ec2-user@alpacajs.org:/web/code/alpaca
echo Unzipping to latest directory, writing to deploy.log
CMD2="cd /web/code/alpaca; rm -r /web/code/alpaca/latest; unzip -o /web/code/alpaca/$ZIP -d /web/code/alpaca/latest"
echo $CMD2
ssh -i ~/keys/gitana.pem ec2-user@alpacajs.org $CMD2 >> deploy.log




#
# TEARDOWN
#

# delete local branch
git checkout master
git branch -D $BRANCH
