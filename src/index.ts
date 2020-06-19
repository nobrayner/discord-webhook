import * as core from '@actions/core'
import * as GitHub from '@actions/github'

import executeWebhook from './helpers/discord'
import DiscordWebhook, { EmbedField } from './helpers/discordTypes'

type JobData = {
  name: string
  status: string | null
  url: string
}

const { GITHUB_RUN_ID, GITHUB_WORKFLOW } = process.env

function wordToUpperCase(word: string): string {
  return word[0].toUpperCase() + word.substring(1, word.length).toLowerCase()
}

function workflowStatusFromJobs(jobs: JobData[]): 'Success' | 'Failure' | 'Cancelled' {
  let statuses = jobs.map(j => j.status)

  if (statuses.includes('cancelled')) {
    return 'Cancelled'
  }

  if (statuses.includes('failure')) {
    return 'Failure'
  }

  return 'Success'
}

async function run(): Promise<void> {
  try {
    if (GITHUB_RUN_ID == undefined) {
      core.setFailed('Unable to locate the current run id... Something is very wrong')
    } else {
      const githubToken = core.getInput('github-token', { required: true })
      const discordWebhook = core.getInput('discord-webhook', { required: true })
      const username = core.getInput('username')
      const avatarURL = core.getInput('avatar-url')
      const includeDetails = core.getInput('include-details').trim().toLowerCase() === 'true' || true
      const colorSuccess = parseInt(core.getInput('color-success').trim().replace(/^#/g, ''), 16)
      const colorFailure = parseInt(core.getInput('color-failure').trim().replace(/^#/g, ''), 16)
      const colorCancelled = parseInt(core.getInput('color-cancelled').trim().replace(/^#/g, ''), 16)

      const inputTitle = core.getInput('title')
      const inputDescription = core.getInput('description')

      core.setSecret(githubToken)
      core.setSecret(discordWebhook)

      const octokit = GitHub.getOctokit(githubToken)
      const context = GitHub.context

      octokit.actions.listJobsForWorkflowRun({
        owner: context.repo.owner,
        repo: context.repo.repo,
        run_id: parseInt(GITHUB_RUN_ID, 10)
      })
      .then(response => {
        let workflowJobs = response.data.jobs

        let jobData: JobData[] = workflowJobs
                                  .filter(j => j.status === 'completed')
                                  .map(j => ({ name: j.name, status: j.conclusion, url: j.html_url }))

        let workflowStatus = workflowStatusFromJobs(jobData)

        let color = workflowStatus === 'Success' ? colorSuccess : (workflowStatus === 'Failure' ? colorFailure : colorCancelled)

        let payload: DiscordWebhook = {
          username: username,
          avatar_url: avatarURL,
          embeds: [
            {
              author: {
                name: context.actor,
                url: `https://github.com/${context.actor}`,
                icon_url: `https://github.com/${context.actor}.png`
              },
              title: inputTitle.replace('{{STATUS}}', workflowStatus) || `[${context.repo.owner}/${context.repo.repo}] ${GITHUB_WORKFLOW}: ${workflowStatus}`,
              url: `https://github.com/${context.repo.owner}/${context.repo.repo}/actions/runs/${GITHUB_RUN_ID}`,
              description: inputDescription.replace('{{STATUS}}', workflowStatus) || undefined,
              color: color
            }
          ]
        }

        if (includeDetails) {
          let fields: EmbedField[] = []

          jobData.forEach(jd => {
            fields.push({
              name: jd.name,
              value: `\`${jd.status}\``,
              inline: true
            })
          })

          payload.embeds[0].fields = fields
        }

        executeWebhook(payload, discordWebhook)
      })
      .catch(error => {
        core.setFailed(error.message)
      })
    }
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()