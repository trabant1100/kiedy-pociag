npm run updateBuild -- "`git log -1 --date=iso --pretty=format:%cd`"
ng build --prod --base-href "https://trabant1100.github.io/kiedy-pociag/"
angular-cli-ghpages --branch=master --dir=dist/kiedy-pociag --no-silent