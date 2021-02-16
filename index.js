const fs = require('fs');
const { get } = require('http');
const fetch = require('node-fetch');

const fileToRead = process.argv[2];
const fileContent = fs.readFileSync(fileToRead, 'utf-8');
const tokens = fileContent.replace(/[\s\n\t\r]+/g, ' ').trim().split(' ');

const memory = {};

const program = async (input) => {
  await statement_list(input);
}

const statement_list = async (input) => {
  const statementFound = await statement(input)
  if (statementFound) {
    await statement_list(input)
  }
}

const statement = async (input) => {
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
    await loop(input);
    return true;
  } else if (token === 'GET') {
    await GET(input);
    return true;
  }
  input.unshift(token);
  return false;
}

const loop = async (input) => {
  const amount = parseInt(input.shift());

  let i = 0;
  while (i++ < amount) {
    if (i === amount) {
      await statement_list(input)
    } else {
      await statement_list([...input])
    }
    if (input[0] === 'STOP') {
      input.shift();
    }
  }
}

const GET = async (input) => {
  const url = input.shift();
  input.shift();
  variableName = input.shift();
  await fetch(url)
    .then(response => response.text())
    .then(text => memory[variableName] = text);
}

program(tokens);