const core = require('@actions/core');
const fetch = require('node-fetch');

const main = async () => {
  try {
    console.log('DOES THIS INCLUDE THE GITHUB_SHA?', process.env.GITHUB_SHA);

    const vercel_team_id = core.getInput('vercel_team_id', {required: true});
    const vercel_access_token = core.getInput('vercel_access_token', {required: true});

    // DEBUGGING!
    console.log({vercel_access_token, vercel_team_id});
    // DEBUGGING!

    const response = await fetch(`https://api.vercel.com/v6/deployments?teamId=${vercel_team_id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${vercel_access_token}`,
      },
    });

    console.log(response.json());
  } catch (error) {
    core.setFailed(error.message);
  }
};

// Call the main function to run the action
main();
