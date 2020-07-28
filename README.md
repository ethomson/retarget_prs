# retarget_prs

![Master to Main](docs/master_to_main.gif)

Normally, [changing the base of an existing pull request](https://github.blog/2016-08-15-change-the-base-branch-of-a-pull-request/) is a one-at-a-time, manual operation.

This utility changes the base of all open pull requests in your GitHub repository from one branch to another. This is useful if you want to [change the name of your default branch](https://www.hanselman.com/blog/EasilyRenameYourGitDefaultBranchFromMasterToMain.aspx) and you have open pull requests in your repository.

For example, if you change your default branch from `master` to `main`, open pull requests in your repository still target `master`. This utility automates changing the base of open pull requests.

## Setup

1. Install [Node.js](https://nodejs.org/en/download/).

2. Create a [GitHub personal access token](https://help.github.com/en/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line).

## How to

## Change the default branch name

To change the name of the default branch on GitHub:

1. Go to your project.

   Make sure that you are on the current default branch (`master`).
   
2. Open the branch picker and enter the name of the new branch (`main`).  

3. Select `Create branch: main from 'master'`.

   ![Create new branch](docs/newbranch.png)

### Set the new branch as the default

1. Open your project settings.

2. Select "Branches" in the left nav. 

   Under "Default branch", open the branch picker and select the new default branch (`main`).

   ![Set the new default](docs/newdefault.png)

## Update existing pull requests

Specify your personal access token (pat) with `--token`, your repository URL, and the old and new branch names:

   ```
   npx retarget_prs --token your_pat https://github.com/your/repo master main
   ```

## Need help?

Open a [GitHub issue](https://github.com/ethomson/retarget_prs).

## License

Copyright (c), Edward Thomson.  All rights reserved.

Available under the MIT license, see the included [LICENSE.txt](LICENSE.txt) for details.
