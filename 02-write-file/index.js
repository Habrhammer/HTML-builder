const fs = require('fs');
const readline = require('readline');

const stream = fs.createWriteStream(`${__dirname}/text.txt`);

const readlineInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

process.stdout.write('Hello! Write something...');

readlineInterface.on('line', (input) => {
  if (input === 'exit') {
    readlineInterface.close();
    stream.end()
  } else {
    stream.write(input + '\n');
  }
});

process.on('exit', () => {
  process.stdout.write("Goodbye!");
});