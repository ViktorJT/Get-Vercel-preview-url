const core = require('@actions/core');

const main = async () => {
  try {
    // IF THIS CAN RETURN THE COMMIT SHA FROM GH- REMOVE NEED TO PASS IT TO FUNCTION!!
    console.log('DOES THIS INCLUDE THE GITHUB_SHA?', process.env);

    const vercel_team_id = core.getInput('vercel_team_id', {required: true});
    const vercel_access_token = core.getInput('vercel_access_token', {required: true});
    const commit_sha = core.getInput('commit_sha', {required: true});

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
