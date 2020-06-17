import * as core from '@actions/core'
import * as GitHub from '@actions/github'

const context = GitHub.context

const { GITHUB_RUN_ID } = process.env

async function run(): Promise<void> {
  try {
    if (GITHUB_RUN_ID == undefined) {
      core.setFailed('Unable to locate the current run id... Something is very wrong')
    } else {
      const githubToken = core.getInput('github-token', { required: true })
      core.setSecret(githubToken)

      const octokit = GitHub.getOctokit(githubToken)

      let workflowJobs = octokit.actions.listJobsForWorkflowRun({
        owner: context.repo.owner,
        repo: context.repo.repo,
        run_id: parseInt(GITHUB_RUN_ID, 10)
      })

      core.info(JSON.stringify(workflowJobs))
    }
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()