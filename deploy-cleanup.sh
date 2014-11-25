VERSION="$(node server/version)"
BRANCH="$VERSION-release"
ZIP="alpaca-$VERSION.zip"

#
# TEARDOWN
#

# delete local branch
git checkout master
git branch -D $BRANCH
