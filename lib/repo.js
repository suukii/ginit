const simpleGit = require('simple-git');
const fs = require('fs');
const path = require('path');
const ora = require('ora')

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

function setupRepo({ baseDir, url }) {
    const git = simpleGit({ baseDir, binary: 'git' });
    const spinner = ora('Initailizing git repository...');
    spinner.start();
    try {
        git.init()
            .then(() => git.add('.gitignore'))
            .then(() => git.add('./*'))
            .then(() => git.commit('Initial Commit'))
            .then(() => git.addRemote('origin', url))
            .then(() => {
                spinner.text = 'Pushing to remote repository...';
                git.push('origin', 'master');
            })
            .then(() => {
                spinner.text = `Pushed to remote repository. Check out ${url}`;
                spinner.succeed();
            });
    } finally {
        spinner.stop();
    }
}

module.exports = {
    createGitignore,
    setupRepo,
};
