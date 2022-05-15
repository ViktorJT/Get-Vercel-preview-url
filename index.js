// TODO Clean up repository secrets

const core = require('@actions/core');
const fetch = require('node-fetch');
const github = require('@actions/github');

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

const main = async () => {
  console.log(github.context.payload.pull_request._links);

  const commit = github.context;

  if (commit.eventName !== 'pull_request' && commit.eventName !== 'push') {
    core.setFailed(`This action needs to be run on pull requests and/or push`);
  }

  try {
    const vercel_team_id = core.getInput('vercel_team_id', {required: true});
    const vercel_access_token = core.getInput('vercel_access_token', {required: true});
    const timeout = core.getInput('timeout');
    const limit = core.getInput('limit');

    if (limit > 100) core.setFailed('Maximum pagination limit is 100');

    const {deployments} = await fetch(
      `https://api.vercel.com/v6/deployments?teamId=${vercel_team_id}&limit=${limit}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${vercel_access_token}`,
        },
      }
    ).then((res) => res.json());

    if (!deployments) core.setFailed('Unable to fetch Vercel deployments');

    let sha;
    if (commit.eventName === 'pull_request') {
      sha = commit.payload.pull_request.merge_commit_sha;
    } else {
      sha = commit.sha;
    }

    let deployment = deployments.find((deployment) => deployment.meta.githubCommitSha === sha);

    if (!deployment) core.error(`Unable to find deployment with sha: ${sha}`);

    if (deployment.state === 'READY') core.setOutput('preview_url', deployment.url);

    while (deployment.readyState !== 'READY') {
      deployment = await fetch(
        `https://api.vercel.com/v13/deployments/${deployment.url}?teamId=${vercel_team_id}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${vercel_access_token}`,
          },
        }
      ).then((res) => res.json());

      if (deployment.readyState === 'ERROR')
        core.setFailed(`An error occurred while getting preview url`);
      if (deployment.readyState === 'CANCELED') core.setFailed(`Deployment was canceled`);

      await sleep(timeout);
    }

    core.setOutput('preview_url', deployment.url);
  } catch (error) {
    core.setFailed(error.message);
  }
};

main();
