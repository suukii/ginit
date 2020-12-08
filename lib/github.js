const inquirer = require('inquirer');
const configstore = require('./configstore');
const { Octokit } = require('@octokit/rest');
const { createTokenAuth } = require('@octokit/auth-token');
const pkg = require('../package.json');
const ora = require('ora');

let octokit = null;
configstore.initCof(pkg.name);

function auth(auth) {
    octokit = new Octokit({
        auth,
    });
}

function askGithubCredentials() {
    const questions = [
        {
            name: 'accessToken',
            type: 'input',
            message: 'Enter your GitHub personal access token:',
            validate: function (value) {
                if (value.length) {
                    return true;
                } else {
                    return 'Please enter your personal access token. Learn more about creating a personal access token at https://docs.github.com/en/free-pro-team@latest/github/authenticating-to-github/creating-a-personal-access-token';
                }
            },
        },
    ];
    return inquirer.prompt(questions);
}

async function getPersonalAccessToken() {
    const { accessToken } = await askGithubCredentials();
    const spinner = ora('Authorizing...');
    spinner.start();

    try {
        const auth = createTokenAuth(accessToken);
        const { token } = await auth();
        configstore.setConf('github.token', token);
        return token;
    } finally {
        spinner.stop();
    }
}

async function getGitHubToken() {
    let token = getStoredGitHubToken();
    if (token) return token;

    token = await getPersonalAccessToken();
    return token;
}

function getStoredGitHubToken() {
    return configstore.getConf('github.token');
}

function clearStoredGitHubToken() {
    configstore.delConf('github.token');
}

function askRepoDetails({ name }) {
    const questions = [
        {
            type: 'input',
            name: 'name',
            message: 'Enter a name for the repository:',
            default: name,
            validate: function (value) {
                if (value.length) {
                    return true;
                } else {
                    return 'Please enter a name for the repository.';
                }
            },
        },
        {
            type: 'input',
            name: 'description',
            message: 'Optionally enter a description of the repository:',
        },
        {
            type: 'list',
            name: 'visibility',
            message: 'Public or private:',
            choices: ['public', 'private'],
            default: 'public',
        },
    ];
    return inquirer.prompt(questions);
}

async function createRemoteRepo(name) {
    const answers = await askRepoDetails({ name });
    const spinner = ora('Creating Remote Repo...');
    spinner.start();

    try {
        const res = await octokit.repos.createForAuthenticatedUser({
            name: answers.name,
            description: answers.description,
            private: answers.visibility === 'private',
        });

        spinner.text = 'Remote Repo Created';
        spinner.succeed();

        return res.data.clone_url;
    } finally {
        spinner.stop();
    }
}

module.exports = {
    auth,
    getPersonalAccessToken,
    createRemoteRepo,
    getGitHubToken,
    clearStoredGitHubToken,
};
