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
git add ./dist

# commit changes to local branch
git commit -m "alpaca release build $VERSION"




#
# STEP 2: PUBLISH DISTRIBUTION FILES TO CDN
#

# publish alpaca to CDN
grunt publish_dist



#
# STEP 3: PUBLISH WEB SITE
#

rm build/$ZIP
cd build/site
zip -r ../$ZIP *
cd ../..
scp -i ~/keys/gitana.pem -r build/$ZIP ec2-user@alpacajs.org:/web/code/alpaca
ssh -i ~/keys/gitana.pem ec2-user@alpacajs.org 'cd /web/code/alpaca; rm /web/code/alpaca/$VERSION; unzip /web/code/alpaca/$ZIP -d /web/code/alpaca/$VERSION'
ssh -i ~/keys/gitana.pem ec2-user@alpacajs.org 'cd /web/code/alpaca; rm -r /web/code/alpaca/latest; unzip /web/code/alpaca/$ZIP -d /web/code/alpaca/latest'




#
# STEP 4: TAG REPO FOR BOWER
#

# create a tag
#git tag $VERSION

# push the tag
#git push remote $BRANCH --tags




#
# TEARDOWN
#

# delete local branch
git checkout master
git branch -D $BRANCH
