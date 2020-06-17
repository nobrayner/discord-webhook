import * as core from '@actions/core'
import * as GitHub from '@actions/github'

const { GITHUB_RUN_ID } = process.env

async function run(): Promise<void> {
  try {
    if (GITHUB_RUN_ID == undefined) {
      core.setFailed('Unable to locate the current run id... Something is very wrong')
    } else {
      const githubToken = core.getInput('github-token', { required: true })
      core.setSecret(githubToken)

      core.info('Gathered input!')

      const octokit = GitHub.getOctokit(githubToken)

      core.info('Acquired octokit!')

      const context = GitHub.context

      core.info(`${context.repo.owner}`)
      core.info(`${context.repo.repo}`)
      core.info(`${GITHUB_RUN_ID}`)

      let workflowJobs = octokit.actions.listJobsForWorkflowRun({
        owner: context.repo.owner,
        repo: context.repo.repo,
        run_id: parseInt(GITHUB_RUN_ID, 10)
      }).catch(error => {
        core.setFailed(error.message)
      })

      core.info('Listing this workflows Jobs:')

      core.info(JSON.stringify(workflowJobs))
    }
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()