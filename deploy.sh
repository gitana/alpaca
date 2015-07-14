VERSION="$(node server/version)"
BRANCH="$VERSION-release"
ZIP="alpaca-$VERSION.zip"

echo Deploying version $VERSION


#
# SETUP
#

# switch to master branch
# create a local branch <version>-release
git checkout master
git checkout -b $BRANCH




#
# STEP 1: BUILD ALPACA, WEB SITE JSDOCS AND DEPLOY TO CDN
#

# build alpaca
# build web site
# copy to dist (for bower)
gulp default site dist

# build jsdoc
grunt jsdoc

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
# STEP 3: PUBLISH WEB SITE
#

rm build/$ZIP
cd build/web
zip -r ../$ZIP *
cd ../..
scp -i ~/keys/gitana.pem -r build/$ZIP ec2-user@alpacajs.org:/web/code/alpaca
CMD1="cd /web/code/alpaca; rm /web/code/alpaca/$VERSION; unzip -o /web/code/alpaca/$ZIP -d /web/code/alpaca/$VERSION"
echo $CMD1
ssh -i ~/keys/gitana.pem ec2-user@alpacajs.org $CMD1
CMD2="cd /web/code/alpaca; rm -r /web/code/alpaca/latest; unzip -o /web/code/alpaca/$ZIP -d /web/code/alpaca/latest"
echo $CMD2
ssh -i ~/keys/gitana.pem ec2-user@alpacajs.org $CMD2




#
# STEP 4: TAG REPO FOR BOWER
#

# create a tag
git tag $VERSION

# push the tag
#git push origin $BRANCH --tags
git push origin $VERSION



#
# STEP 5: NPM
#

npm publish



#
# TEARDOWN
#

# delete local branch
git checkout master
git branch -D $BRANCH
