interface EmbedAuthor {
  name?: string
  url?: string
  icon_url?: string
}

interface EmbedMultimedia {
  url?: string
  height?: number
  width?: number
}

interface EmbedField {
  name: string
  value: string
  inline?: boolean
}

interface EmbedFooter {
  text: string
  icon_url?: string
}

interface Embed {
  title?: string
  description?: string
  url?: string
  timestamp?: Date
  color?: number
  footer?: EmbedFooter
  image?: EmbedMultimedia
  thumbnail?: EmbedMultimedia
  video?: EmbedMultimedia
  author?: EmbedAuthor
  fields?: EmbedField[]
}

interface WebhookBase {
  username?: string
  avatar_url?:string
  tts?: boolean
}

interface WebhookWithContent extends WebhookBase {
  content: string
}

interface WebhookWithEmbeds extends WebhookBase {
  embeds: Embed[]
}

interface WebhookWithFile extends WebhookBase {
  file: string
}

type DiscordWebhook = WebhookWithContent | WebhookWithEmbeds | WebhookWithFile | (WebhookWithContent & WebhookWithEmbeds & WebhookWithFile)

export default DiscordWebhook