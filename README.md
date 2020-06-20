# Discord Workflow Status Notifier

A GitHub action to report workflow and job status to a Discord Webhook

## Inputs

- **Required** `github-token`: GitHub Token
- **Required** `discord-webhook`: The Webhook URL to call. Should be stored in Secrets on the Repository
- **Optional** `username`: Overrides the current username of the webhook
- **Optional** `avatar-url`: Overrides the current avatar of the webhook
- **Optional** `title`: Overrides the default title. Include the status in the title by adding the {{STATUS}} placeholder.
- **Optional** `description`: The message to display. Include the status in the description by adding the {{STATUS}} placeholder.
- **Optional** `include-details`: Whether or not to include the individual job status breakdown of the Workflow run
- **Optional** `color-success`: Overrides the default success color. Any valid hex-color-code. E.g. #17cf48, 17cf48, 0x17cf48
- **Optional** `color-failure`: Overrides the default failure color. Any valid hex-color-code. E.g. #17cf48, 17cf48, 0x17cf48
- **Optional** `color-cancelled`: Overrides the default cancelled color. Any valid hex-color-code. E.g. #17cf48, 17cf48, 0x17cf48

## Example usage

Use the defaults

```yaml
name: Build and Test
on: [ pull_request ]

jobs:
  build:
    name: Build the Code
    # build job
  test:
    name: Test the Code
    # test job
  notify:
    name: Discord Notification
    runs-on: ubuntu-latest
    needs: # make sure the notification is sent AFTER the jobs you want included have completed
      - build
      - test
    if: ${{ always() }} # You always want to be notified: success, failure, or cancelled
    
    steps:
      - name: Notify
        uses: nobrayner/discord-webhook@v1
        with:
          github-token: ${{ secrets.github_token }}
          discord-webhook: ${{ secrets.DISCORD_WEBHOOK }}
```

![defaults](https://raw.githubusercontent.com/nobrayner/discord-webhook/master/docs/defaults.png?raw=true)

Overwrite everything

```yaml
name: Build and Test
on: [ pull_request ]

jobs:
  build:
    name: Build the Code
    # build job
  test:
    name: Test the Code
    # test job
  notify:
    name: Discord Notification
    runs-on: ubuntu-latest
    needs: # make sure the notification is sent AFTER the jobs you want included have completed
      - build
      - test
    if: ${{ always() }} # You always want to be notified: success, failure, or cancelled

    steps:
      - name: Notify
        uses: nobrayner/discord-webhook@v1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          discord-webhook: ${{ secrets.DISCORD_WEBHOOK }}
          username: 'Bob'
          avatar-url: 'https://octodex.github.com/images/Terracottocat_Single.png'
          title: '${{ github.workflow }}: {{STATUS}}'
          description: '${{ github.event_name }} trigged this {{STATUS}}!'
          include-details: 'false'
          color-success: '#4287f5'
          color-failure: 'eb4034'
          color-cancelled: '0x42daf5'
```

![overwrite-everything](https://raw.githubusercontent.com/nobrayner/discord-webhook/master/docs/overwrite-everything.png?raw=true)
