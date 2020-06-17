import * as core from '@actions/core'

async function run(): Promise<void> {
  try {
    core.info('This action has been run!')
  } catch(error) {
    core.setFailed(error.message)
  }
}

run()