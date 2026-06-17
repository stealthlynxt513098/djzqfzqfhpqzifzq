const { EmbedBuilder } = require('discord.js');
const { warnings } = require('./warn');

module.exports = {
  name: 'warnings',
  description: 'View warnings for a user',
  async execute(message, args) {
    const target = message.mentions.members.first() || (args[0] ? await message.guild.members.fetch(args[0]).catch(() => null) : null);
    if (!target) return message.channel.send('❌ Provide a valid user.');

    const key = `${message.guild.id}-${target.id}`;
    const list = warnings.get(key) || [];
    if (!list.length) return message.channel.send(`✅ **${target.user.tag}** has no warnings.`);

    const embed = new EmbedBuilder().setColor(0xFEE75C)
      .setTitle(`Warnings for ${target.user.tag}`)
      .setDescription(list.map((w, i) => `**${i + 1}.** ${w.reason} — <t:${Math.floor(new Date(w.date).getTime()/1000)}:R>`).join('\n'));
    await message.channel.send({ embeds: [embed] });
  },
};
