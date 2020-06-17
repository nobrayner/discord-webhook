import DiscordWebhook from './discordTypes'
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest

function executeWebhook(payload: DiscordWebhook, webhookURL: string): void {
  let stringifiedPayload = JSON.stringify(payload)

  var xhr = new XMLHttpRequest()
  xhr.open('POST', webhookURL, true)
  xhr.setRequestHeader('Content-Type', 'application/json')
  xhr.send(stringifiedPayload)
}

export default executeWebhook