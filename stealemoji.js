module.exports = {
  name: 'stealemoji',
  description: 'Add one or more emojis to this server',
  async execute(message, args) {
    if (!args.length) return message.channel.send('❌ Provide at least one emoji.');

    const results = [];

    for (const arg of args) {
      const match = arg.match(/^<(a?):(\w+):(\d+)>$/);
      if (!match) {
        results.push(`⚠️ \`${arg}\` — not a custom emoji, skipped.`);
        continue;
      }

      const animated = match[1] === 'a';
      const name = match[2];
      const id = match[3];
      const url = `https://cdn.discordapp.com/emojis/${id}.${animated ? 'gif' : 'png'}`;

      try {
        const emoji = await message.guild.emojis.create({ attachment: url, name });
        results.push(`✅ ${emoji} \`${emoji.name}\` added.`);
      } catch (err) {
        results.push(`❌ \`${name}\` — ${err.message}`);
      }
    }

    await message.channel.send(results.join('\n'));
  },
};
