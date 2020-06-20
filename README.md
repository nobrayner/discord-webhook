# Discord Webhook

A GitHub Action to call a Discord Webhook

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
- name: Notify
  uses: nobrayner/discord-webhook@v1
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
    discord-webhook: ${{ secrets.DISCORD_WEBHOOK }}
```



Overwrite everything

```yaml
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

