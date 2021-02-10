const fs = require('fs');

const fileToRead = process.argv[2];
const fileContent = fs.readFileSync(fileToRead, 'utf-8');
const tokens = fileContent.replace(/[\s\n\t\r]+/g, ' ').trim().split(' ');

const memory = {};

const program = (input) => {
  statement_list(input);
}

const statement_list = (input) => {
  const statementFound = statement(input)
  if (statementFound) {
    statement_list(input)
  }
}

const statement = (input) => {
  const token = input.shift();
  if (token === 'PRINT') {
    const next = input.shift();
    console.log(memory[next]);
    return true;
  } else if (token === 'LOAD') {
    const fileName = input.shift();
    input.shift();
    const variableName = input.shift();
    const fileRead = fs.readFileSync(fileName, 'utf-8');
    memory[variableName] = fileRead;
    return true;
  } else if (token === 'FIND_LINES_IN') {
    const variableName = input.shift();
    const filterType = input.shift();
    const filter = input.shift();
    input.shift();
    const into = input.shift();
    const splitByLine = memory[variableName].split('\n');
    const filtered = splitByLine.filter(line => line.indexOf(filter) !== -1);
    const joined = filtered.join('\n');
    memory[into] = joined;
    return true;
  } else if (token === 'LOOP') {
    loop(input);
    return true;
  }
  input.unshift(token);
  return false;
}

const loop = (input) => {
  const amount = parseInt(input.shift());

  const block = [];
  let token = input.shift();

  while (token !== 'STOP') {
    block.push(token);
    token = input.shift();
  }

  for (let i = 0; i < amount; i++) {
    statement_list([...block]);
  }
}

program(tokens);