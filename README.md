# retarget_prs

![Master to Main](docs/master_to_main.gif)

This utility will change the base of all the pull requests in your GitHub repository that are currently targeting a different branch.  This is useful if you want to [change the name of your default branch](https://www.hanselman.com/blog/EasilyRenameYourGitDefaultBranchFromMasterToMain.aspx), but you have pull requests open.

For example, if you use the _default_ default branch of `master`, but you want to change that to a name like `main`, by default the pull requests that you already have open in your repository will continue to target the old default branch (`master`).

Fortunately, you can [change the base of an existing pull request](https://github.blog/2016-08-15-change-the-base-branch-of-a-pull-request/), but this is a one-at-a-time, manual operation.

This utility will automate that, and make this change en masse.

## Setup

1. Ensure that you have [Node.js](https://nodejs.org/en/download/) installed.
2. Create a [personal access token](https://help.github.com/en/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line) to use to authenticate.

## How to

If you want to change the name of the default branch on GitHub:

1. Go to your project and make sure that you are on the current default branch (`master`).  Open the branch picker, and type the name of the new branch (`main`).  Select `Create branch: main from 'master'`.

   ![Create new branch](docs/newbranch.png)

2. Set this as the new default branch.  Go to your project's settings, then select "Branches".  Under "Default branch", open the branch picker and select the new default branch (`main`).

   ![Set the new default](docs/newdefault.png)

3. Update the existing pull requests.  Specify your PAT with `--token`, your repository URL and the old and new branch names:

   ```
   npx retarget_prs --token your_pat https://github.com/your/repo master main
   ```

## Questions?

Need help?  [Open a GitHub issue](https://github.com/ethomson/retarget_prs).

## License

Copyright (c), Edward Thomson.  All rights reserved.

Available under the MIT license, see the included [LICENSE.txt](LICENSE.txt) for details.
