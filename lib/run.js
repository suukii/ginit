'use strict';

const github = require('./github');
const repo = require('./repo');
const files = require('./files');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');

async function run({ dirname }) {
    const baseDir = path.resolve(dirname);

    if (!files.directoryExists(baseDir)) {
        fs.mkdirSync(baseDir);
    }

    // Get the current direcotry as a default repo name.
    dirname = dirname || files.getCurrentDirecotryBase();

    try {
        if (files.directoryExists(path.resolve(baseDir, '.git'))) {
            throw new Error('Already a Git repository!');
        }

        // Get GitHub token
        const token = await github.getGitHubToken();
        github.auth(token);

        // Create remote repo
        const url = await github.createRemoteRepo(dirname);

        // Initialize local git repo and push it to the remote repo.
        repo.createGitignore({ baseDir });
        repo.setupRepo({
            baseDir,
            url,
        });
    } catch (error) {
        switch (error.status) {
            case 401:
                console.log(chalk.red('HttpError: Bad credentials. Please try again.'));
                github.clearStoredGitHubToken()
                break;
            case 422:
                console.log(
                    chalk.red(
                        'Repository with the same name already exists on this account.',
                    ),
                );
                break;

            default:
                console.log(chalk.red(error));
        }
    }
}

module.exports = {
    run,
};
