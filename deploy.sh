VERSION="$(node -p "require('./package.json').version")"
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
rm -rf build dist


#
# STEP 1: BUILD ALPACA, WEB SITE JSDOCS
#

npm install

# build alpaca into dist and run the tests
npm test || exit 1

# build web site (installs the site's libraries from site/package.json)
npm run site

# build jsdoc
npm run docs:api

# add the alpaca distribution (dist/alpaca) to the commit - not the web site (dist/site)
git add dist/alpaca -f

# commit changes to local branch
git commit -m "alpaca release build $VERSION"




#
# STEP 2: PUBLISH DISTRIBUTION FILES TO CDN
#

# jsDelivr serves the npm package directly (see STEP 4)




#
# STEP 3: TAG REPO
#

# create a tag
git tag $VERSION

# push the tag
#git push origin $BRANCH --tags
git push origin $VERSION



#
# STEP 4: NPM
# The "files" field in package.json controls what gets published.
#
npm publish



#
# STEP 5: PUBLISH WEB SITE
#

rm -f dist/$ZIP
cd dist/site
zip -r ../$ZIP *
cd ../..
echo Copying ZIP file to web server
scp -i ~/keys/alpaca.pem -r dist/$ZIP ec2-user@alpacajs.org:~
echo Unzipping to latest directory, writing to deploy.log
CMD2="cd ~; rm -r ./latest; unzip -o $ZIP -d ./latest"
echo $CMD2
ssh -i ~/keys/alpaca.pem ec2-user@alpacajs.org $CMD2 >> deploy.log




#
# TEARDOWN
#

# delete local branch
git checkout master
git branch -D $BRANCH
