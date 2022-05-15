// TODO Make 'limit' into an input? controlling how many deployments should be fetched from the vercel api
// https://vercel.com/docs/rest-api#introduction/api-basics/pagination

const core = require('@actions/core');
const fetch = require('node-fetch');

const main = async () => {
  try {
    console.log('DOES THIS INCLUDE THE GITHUB_SHA?', process.env.GITHUB_SHA);

    const vercel_team_id = core.getInput('vercel_team_id', {required: true});
    const vercel_access_token = core.getInput('vercel_access_token', {required: true});

    const {deployments} = await fetch(
      `https://api.vercel.com/v6/deployments?teamId=${vercel_team_id}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${vercel_access_token}`,
        },
      }
    ).then((res) => res.json());

    console.log(deployments);

    const deployment = deployments.find((deployment) => {
      return deployment.meta.githubCommitSha === process.env.GITHUB_SHA;
    });

    if (!deployment)
      core.error(`Unable to find deployment with github.sha: ${process.env.GITHUB_SHA}`);
  } catch (error) {
    core.setFailed(error.message);
  }
};

// Call the main function to run the action
main();
