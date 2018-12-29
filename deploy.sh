npm run updateBuild -- "`git log -1 --date=iso --pretty=format:%cd`"
ng build --prod --base-href "https://GH_TOKEN.github.io/kiedy-pociag/" --name="Deploy" --email=komelanczuk@live.com
angular-cli-ghpages --branch=master --dir=dist/kiedy-pociag --no-silent