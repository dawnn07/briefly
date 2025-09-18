import { Context } from 'telegraf'

export default (ctx: Context) => {
  ctx.reply('Hi! Send me some text and I’ll summarize it. ✨')
}
