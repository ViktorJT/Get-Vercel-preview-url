## `Get Vercel Preview Url`

> Github Action used to get the `preview url` of a vercel deployment for your continuous integration pipeline. Supports the `pull_request` workflow trigger.

### Basic usage

Inside your `.github/workflows/{your-workflow}.yml` file:

```yml
- name: Get Vercel Preview URL
  id: get-vercel-preview-url
  uses: ViktorJT/Get-vercel-preview-url@1.1.0
  with:
    vercel_access_token: ${{ secrets.VERCEL_ACCESS_TOKEN }}
    vercel_team_id: ${{ secrets.VERCEL_TEAM_ID }}
    gh_token: ${{ secrets.GITHUB_TOKEN }}

- name: Echo preview
  run: echo "Preview url is ready ${{ steps.get-vercel-preview-url.outputs.preview_url }}"
```

### Inputs

All inputs are added to the action's `with` property, see the basic example above for reference.

|          Key          |                                                                                                Description                                                                                                 | Required |
| :-------------------: | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :------: |
| `vercel_access_token` |                               Used to authenticate with Vercel [Read more](https://vercel.com/docs/rest-api#introduction/api-basics/authentication/creating-an-access-token)                               |  `true`  |
|   `vercel_team_id`    |                    Used to identify the correct team in Vercel [Read more](https://vercel.com/docs/rest-api#introduction/api-basics/authentication/accessing-resources-owned-by-a-team)                    |  `true`  |
|      `gh_token`       | Default Github Action `environment variable` used to authenticate with Github [Read more](https://docs.github.com/en/actions/security-guides/automatic-token-authentication#about-the-github_token-secret) |  `true`  |
|     `prefix_path`     |                                                                           Optional string to prefix the path of the preview URL                                                                            | `false`  |
|       `timeout`       |                                                      Time in milliseconds spent waiting between requests to the Vercel REST Api, defaults to `3000`ms                                                      | `false`  |
|        `limit`        |                                              Pagination limit of the initial request to the Vercel deployments endpoint, defaults to `20` with a max of `100`                                              | `false`  |

### Outputs

the `preview url` is accessed using the workflow stepId, like so:

`steps.{stepId}.outputs.preview_url`

### Example

This is an example using this action together with [Lighthouse Check Action](https://github.com/foo-software/lighthouse-check-action) to run analytics on web vitals whenever a push or pull request triggers a Vercel deployment:

```yml
name: Performance Audit

on: [push, pull_request]

jobs:
  audit:
    name: Lighthouse Audit
    runs-on: ubuntu-latest
    steps:
      - name: Get Vercel Preview URL
        id: vercel-deployment
        uses: ViktorJT/Get-Vercel-preview-url@1.0.0
        with:
          vercel_access_token: ${{ secrets.VERCEL_ACCESS_TOKEN }}
          vercel_team_id: ${{ secrets.VERCEL_TEAM_ID }}
          gh_token: ${{ secrets.GITHUB_TOKEN }}

      - name: Run Lighthouse audit on preview urls
        uses: foo-software/lighthouse-check-action@master
        with:
          device: 'all'
          gitHubAccessToken: ${{ secrets.GITHUB_TOKEN }}
          urls: 'https://${{ steps.vercel-deployment.outputs.preview_url }}'
```
