const fs = require('fs');
const sqlFormatter = require('./lib/sqlFormatter');
const target = process.argv[2];

if (target === undefined) {
  console.error('Please provide file/dir to format');
  process.exit(1);
}

const isDir = fs.lstatSync(target).isDirectory();

const files = [];
if (isDir) {
  const filesInDir = fs
    .readdirSync(target, { withFileTypes: true })
    .filter(dirent => {
      return dirent.name.match(/\.sql$/u);
    })
    .map(({ name }) => name);
  files.push(...filesInDir);
} else {
  files.push(target);
}

if (files.length === 0) {
  console.error('Empty files list!');
} else {
  console.log('Files:', files);
  for (const filePath of files) {
    const content = fs.readFileSync(filePath).toString();
    const formatted = sqlFormatter.format(content);
    fs.writeFileSync(filePath, formatted);
  }
}
