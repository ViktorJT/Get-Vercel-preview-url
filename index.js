// TODO Make 'limit' into an input? controlling how many deployments should be fetched from the vercel api
// https://vercel.com/docs/rest-api#introduction/api-basics/pagination
// TODO Add input control for sleep function

const core = require('@actions/core');
const fetch = require('node-fetch');

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

const main = async () => {
  if (
    process.env.GITHUB_EVENT_NAME !== 'pull_request' ||
    process.env.GITHUB_EVENT_NAME !== 'push'
  ) {
    core.setFailed(`This action needs to be run on pull requests and/or push`);
  }

  try {
    const vercel_team_id = core.getInput('vercel_team_id', {required: true});
    const vercel_access_token = core.getInput('vercel_access_token', {required: true});
    const timeout = core.getInput('timeout');

    const {deployments} = await fetch(
      `https://api.vercel.com/v6/deployments?teamId=${vercel_team_id}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${vercel_access_token}`,
        },
      }
    ).then((res) => res.json());

    let deployment = deployments.find(
      (deployment) => deployment.meta.githubCommitSha === process.env.GITHUB_SHA
    );

    if (!deployment) core.error(`Unable to find deployment using sha: ${process.env.GITHUB_SHA}`);

    if (deployment.state === 'READY') core.setOutput('preview_url', deployment.url);

    while (
      deployment.readyState !== 'READY' ||
      deployment.readyState !== 'ERROR' ||
      deployment.readyState !== 'CANCELED'
    ) {
      deployment = await fetch(
        `https://api.vercel.com/v13/deployments/${deployment.url}?teamId=${vercel_team_id}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${vercel_access_token}`,
          },
        }
      ).then((res) => res.json());

      await sleep(timeout);
    }

    if (deployment.readyState === 'ERROR')
      core.setFailed(`An error occurred while getting preview url`);
    if (deployment.readyState === 'CANCELED') core.setFailed(`Deployment was canceled`);

    core.setOutput('preview_url', deployment.url);
  } catch (error) {
    core.setFailed(error.message);
  }
};

main();
