npm run updateBuild -- "$(git log -1 --date=format:'%Y-%m-%dT%H:%M:%S' --pretty=format:%cd)"
ng build --prod --base-href "https://trabant1100.github.io/kiedy-pociag/"
angular-cli-ghpages --branch=master --dir=dist/kiedy-pociag --no-silent