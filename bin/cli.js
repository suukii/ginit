#! /usr/bin/env node

'use strict';

const minimist = require('minimist');
const help = require('../lib/help');
const { run } = require('../lib/run');

const argv = minimist(process.argv.slice(2));
const init = argv._[0] === 'init';
const dirname = argv._[1] || '';

if (argv.help) {
    help.print();
    return;
}

if (!init) {
    console.log(
        'Invalid usage. Please type "ginit --help" to get usage information.',
    );
    process.exit(1);
}

run({ dirname });
