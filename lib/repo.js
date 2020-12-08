const simpleGit = require('simple-git');
const fs = require('fs');
const path = require('path');
const ora = require('ora');

function createGitignore({ baseDir }) {
    const ignoreFiles = [
        '.DS_Store',
        '/**/node_modules/*',
        'dist',
        '**.local.**',
        'yarn.lock',
        'package-lock.json',
    ];

    const spinner = ora('Creating .gitignore file...');
    spinner.start();
    try {
        fs.writeFileSync(
            path.resolve(baseDir, '.gitignore'),
            ignoreFiles.join('\n'),
        );
    } finally {
        spinner.stop();
    }
}

async function setupRepo({ baseDir, url }) {
    const git = simpleGit({ baseDir, binary: 'git' });
    const spinner = ora('Initailizing git repository...');
    spinner.start();
    try {
        await git.init();
        await git.add('.gitignore');
        await git.add('./*');
        await git.commit('Initial Commit');

        await git.addRemote('origin', url);
        spinner.text = 'Pushing to remote repository...';
        await git.push(['-u', 'origin', 'master']);

        spinner.text = `Pushed to remote repository. Check out ${url}`;
        spinner.succeed();
        process.exit(0);
    } finally {
        spinner.stop();
    }
}

module.exports = {
    createGitignore,
    setupRepo,
};
