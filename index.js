// TODO Make 'limit' into an input? controlling how many deployments should be fetched from the vercel api
// https://vercel.com/docs/rest-api#introduction/api-basics/pagination

const core = require('@actions/core');
const fetch = require('node-fetch');

const main = async () => {
  try {
    // IF THIS CAN RETURN THE COMMIT SHA FROM GH- REMOVE NEED TO PASS IT TO FUNCTION!!
    console.log('–––');
    console.log('Can i find Github stuff here if on hosted gh runnerrrrrrrrrrrrrrr??', process.env);
    console.log('___');

    const vercel_team_id = core.getInput('vercel_team_id', {required: true});
    const vercel_access_token = core.getInput('vercel_access_token', {required: true});

    // DEBUGGING!
    console.log({vercel_access_token, vercel_team_id});
    // DEBUGGING!

    const {deployments} = await fetch(
      `https://api.vercel.com/v6/deployments?teamId=${vercel_team_id}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${vercel_access_token}`,
        },
      }
    ).then((res) => res.json());

    // console.log(deployments);
    const deployment = deployments.find((deployment) => {
      console.log(deployment.meta);
    });

    console.log(deployment);
  } catch (error) {
    core.setFailed(error.message);
  }
};

// Call the main function to run the action
main();
