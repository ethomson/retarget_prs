#!/usr/bin/env node
#
# Batch update the base of all the pull requests in your GitHub repository
# that are currently targeting a different branch.  This is useful if you
# want to change the name of your default branch, but you have pull
# requests open.
#
# See also:
# https://www.hanselman.com/blog/EasilyRenameYourGitDefaultBranchFromMasterToMain.aspx

const { Octokit } = require('@octokit/rest');
const minimist = require('minimist');
const pkginfo = require('pkginfo');

pkginfo(module, 'name', 'version');

const args = minimist(process.argv.slice(2), {
    alias: {
        t: 'token',
        v: 'verbose',
        h: 'help'
    },
    string: [ 'token' ],
    boolean: [ 'dry-run', 'closed', 'verbose', 'debug', 'help' ],
    unknown: (arg) => {
        if (arg.startsWith('-')) {
            console.error(`${module.exports.name}: unknown option: ${arg}`);
            usage(console.error);
            process.exit(1);
        }
    },
});

(async function() {
    try {
        const token = args.token || process.env.GITHUB_TOKEN;

        const url = args._.shift();
        const oldBranch = args._.shift();
        const newBranch = args._.shift();

        if (args.help) {
            help();
            process.exit(0);
        }

        if (!url || !oldBranch || !newBranch)
        {
            console.log(`${module.exports.name}: repository, old branch and new branch must be specified.`);
            usage(console.error);
            process.exit(1);
        }

        if (!token) {
            console.error(`${module.exports.name}: no token was provided, specify --token or GITHUB_TOKEN`);
            usage(console.error);
            process.exit(1);
        }

        // I'm sorry; I used to write a lot of perl.
        if ((nwo = url.match(/^([^/]+)\/([^/]+)$/))) {
            owner = nwo[1];
            repo = nwo[2];
        }
        else if ((nwo = url.match(/^http(?:s)?:\/\/(?:www\.)?github\.com\/([^/]+)\/([^/]+)(?:\/)?$/i))) {
            owner = nwo[1];
            repo = nwo[2];
        }
        else {
            console.error(`${module.exports.name}: repository must be user/name format or a github.com URL`);
            console.error(`              (example: 'https://github.com/foo/bar' or 'foo/bar')`);
            usage(console.error);
            process.exit(1);
        }

        if (args.debug) {
            args.verbose = true
        }

        const github = new Octokit({
            auth: token.toString(),
            userAgent: `${module.exports.name}/${module.exports.version}`,
            log: args.debug ? console : undefined
        });

        verbose(`Verifying that target branch '${newBranch}' exists...`);
        try {
            await github.repos.getBranch({
                owner: owner,
                repo: repo,
                branch: newBranch
            });
        }
        catch (e) {
            handle(e, `cannot retarget to '${newBranch}'`);
        }

        verbose(`Querying pull requests for ${repo}...`);
        let pulls = await queryPullRequests(github, owner, repo, oldBranch, args.closed);

        if (args.closed) {
            debug(`Filtering merged pull requests...`);
            pulls = pulls.filter((p) => p.state === 'open' || p.merged_at == undefined);
        }

        for (const pull of pulls) {
            verbose(`Updating pull request ${pull.number} from base '${oldBranch}' to '${newBranch}'...`);

            if (!args['dry-run']) {
                try {
                    await github.pulls.update({
                        owner: owner,
                        repo: repo,
                        pull_number: pull.number,
                        base: newBranch
                    });
                }
                catch (e) {
                    handle(e, `could not update pull request ${pull.number}`);
                }
            }
        }
    }
    catch (e) {
        handle(e);
    }
}());

async function queryPullRequests(github, owner, repo, base, closed) {
    const all = new Array();
    let page = 1;

    try {
        while (true) {
            debug(`Querying page ${page} of pull requests...`);

            let results = await github.pulls.list({
                owner: owner,
                repo: repo,
                state: closed ? 'all' : 'open',
                base: base,
                page: page
            });

            if (results.data.length === 0) {
                break;
            }

            all.push(...results.data);
            page++;
        }
    }
    catch (e) {
        handle(e, 'could not query pull requests');
    }

    return all;
}

function verbose(msg) {
    if (args.verbose) {
        console.log(msg);
    }
}

function debug(msg) {
    if (args.debug) {
        console.log(msg);
    }
}

function handle(e, msg) {
    console.error(`error: ${msg ? msg + ': ' : ''}${e.message}`);
    debug(e);
    process.exit(1);
}

function usage(dest = console.log) {
    dest(`usage: ${module.exports.name} [--token <token>] [--dry-run] [--closed] [--verbose]`);
    dest(`                    [--help] <repo> <old_branch> <new_branch>`);
}

function help(dest = console.log) {
    usage(dest);
    dest(``);
    dest(`OPTIONS`);
    dest(``);
    dest(`    <repo>:          The URL of the GitHub repository`);
    dest(`    <old_branch>:    The name of the old branch; pull requests targeting this`);
    dest(`                     base branch will be updated to refer to the <new_branch>.`);
    dest(`    <old_branch>:    The name of the new branch; pull requests will now be`);
    dest(`                     based on this branch.  This branch must already exist.`);
    dest(`    --token <token>: The authentication token (PAT) to use when authenticating`);
    dest(`                     to the GitHub repository.  If not specified, the`);
    dest(`                     environment variable GITHUB_TOKEN will be used.`);
    dest(`    --dry-run:       Do not make changes in the remote repository, only show`);
    dest(`                     the actions that would be taken.`);
    dest(`    --closed:        Also update closed (but unmerged) pull requests.  By`);
    dest(`                     default, only open pull requests are updated.`);
    dest(`    --verbose:       Show verbose output.`);
    dest(`    --help:          Shows additional help.`);
}
