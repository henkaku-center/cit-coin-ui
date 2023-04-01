const { readFile, writeFile } = require('fs');
const path = require('path');
// process.argv
// let filename = fs.open(process.argv([1]))

// console.log(process.argv);
// console.log(process.argv.indexOf('--file'))
const path_idx = process.argv.indexOf('--file') + 1;

if (path_idx < 1 || process.argv.length < path_idx) {
  console.log(`
  invalid arguments supplied !!
  
  please try with arguments:
   
  --file [ path_of_the_file ]
  
  
  `);
  process.exit(1);
}

const filename = process.argv[path_idx];

let file = readFile(filename, (err, data) => {
  let content = data.toString('base64');

  console.log(content, '\n');

  writeFile(`${filename}.txt`, content, (err) => {
    if (err) {
      console.log('Could not write to the file');
      process.exit(1);
    } else {
      console.log(`successfully wrote key to ${path.resolve(filename)}.txt`);
      process.exit(0);
    }
  });
});