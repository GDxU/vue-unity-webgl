#!/bin/sh
# Accepts a version string and prints it incremented by one.
# Usage: increment_version <version> [<position>] [<leftmost>]
increment_version() {
  declare -a part=( ${1//\./ } )
  declare    new
  declare -i carry=1

  for (( CNTR=${#part[@]}-1; CNTR>=0; CNTR-=1 )); do
    len=${#part[CNTR]}
    new=$((part[CNTR]+carry))
    [ ${#new} -gt $len ] && carry=1 || carry=0
    [ $CNTR -gt 0 ] && part[CNTR]=${new: -len} || part[CNTR]=${new}
  done
  new="${part[*]}"
   if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        echo -e "${new// /.}"
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        echo "${new// /.}"
    elif [[ "$OSTYPE" == "cygwin" ]]; then
        echo "not correct system - cygwin detected"
        exit
    fi
}
preinstall(){
    npm install -g dts-gen
    npm install typescript --save-dev
    pip3 install git+git://github.com/psf/black
}
mod_package_json() {
    param_chan=$(echo "$1 = \"$2\"")
    echo "$param_chan"
    cat $NODEPFILE | jq "$param_chan" $NODEPFILE | sponge $NODEPFILE
}
auto_install_nvm(){
    if (( AUTO_INSTALL==1 )); then
        $CMD_FINAL
    else
        echo "no install"
    fi
}
npmdeploy(){
    echo "npm deploy starts here.."
    npm config set proxy=null
    npm config set registry https://registry.npmjs.org/
    username=$(npm whoami)
    if [[ $username == "jrhess" ]]; then
      echo "You have login the npm platform and it is ready to publish"
      npm publish --dry-run
      echo "dry run is done.."
      npm publish --access=public
    fi
    npm config set registry=https://registry.npm.taobao.org/
    auto_install_nvm
}
gitpush(){
    local gitcheck=$(git diff --shortstat)
    git add .
    #git remote add gitee https://gitee.com/jjhoc/vue-animation-counter.git
    git commit -m "Please check! $gitcheck"
    git push origin
    git push gitee
    echo "♻️ You can open ${GIT_LOC} or git clone ${GIT_LOC}.git to copy to the local"
}

taobao(){
  cnpm sync $PROJECT_NAME
  cnpm info $PROJECT_NAME
}
GIT_LOC=https://github.com/GDxU/vue-unity-webgl.git
AUTO_INSTALL=0
#tsc -b
PROJECT_NAME="vue-unity-web3-webgl"
VERSION=$(cat version)
increment_version $VERSION > version
VERSION=$(cat version)
CMD_FINAL="npm i -g $PROJECT_NAME@$VERSION"
NODEPFILE="package.json"
mod_package_json ".version" $VERSION
mod_package_json ".name" $PROJECT_NAME
mod_package_json ".author" "Goldman Sagg & Oyen"
mod_package_json ".repository" "git@github.com:GDxU/vue-unity-webgl.git"
mod_package_json ".bugs.url" "https://github.com/GDxU/vue-unity-webgl/issues"
mod_package_json ".homepage" "https://github.com/GDxU/vue-unity-webgl"
echo "==== done ====="
cnpm run build
gitpush
#npmdeploy
#taobao
