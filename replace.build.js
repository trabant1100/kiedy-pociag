var replace = require('replace-in-file');
var buildVersion = process.argv[2].replace(/(\r\n\t|\n|\r\t|\r)/gm, "");
const options = {
  files: 'src/environments/environment.prod.ts',
  from: /timestamp\: \'.*\'/g,
  to: "timestamp: '" + buildVersion + "'",
  allowEmptyPaths: false,
};

try {
  let changedFiles = replace.sync(options);
  console.log('Build version set: ' + buildVersion);
}
catch (error) {
  console.error('Error occurred:', error);
}