const core = require('@actions/core');

const main = async () => {
  try {
    // IF THIS CAN RETURN THE COMMIT SHA FROM GH- REMOVE NEED TO PASS IT TO FUNCTION!!
    console.log('–––');
    console.log('Can i find Github stuff here if on hosted gh runnerrrrrrrrrrr??', process.env);
    console.log('___');

    const vercel_team_id = core.getInput('vercel_team_id', {required: true});
    const vercel_access_token = core.getInput('vercel_access_token', {required: true});

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
