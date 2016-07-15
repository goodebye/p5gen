#!/usr/bin/env node

const fs = require('fs');
const program = require('commander');
const createProject = require('./create');

program
  .version('0.0.1')

program
  .command('create [sketch-name]')
  .action(createProject)

program.parse(process.argv);
