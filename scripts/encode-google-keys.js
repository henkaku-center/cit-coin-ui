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

readFile(filename, (err, data) => {
  // removing unnecessary whitespaces
  let key_trimmed = JSON.stringify(JSON.parse(data.toString()));
  let key_base64 = new Buffer.from(key_trimmed).toString('base64');
  console.log('\n', key_base64, '\n');

  writeFile(filename.replace('.json', '.txt'), key_base64, (err) => {
    if (err) {
      console.log('Could not write to the file');
      process.exit(1);
    } else {
      console.log(`successfully wrote key to ${path.resolve(filename)}.txt`);
      process.exit(0);
    }
  });
});