const { warnings } = require('./warn');

module.exports = {
  name: 'clearwarns',
  description: 'Clear warnings for a user',
  async execute(message, args) {
    const target = message.mentions.members.first() || (args[0] ? await message.guild.members.fetch(args[0]).catch(() => null) : null);
    if (!target) return message.channel.send('❌ Provide a valid user.');

    const key = `${message.guild.id}-${target.id}`;
    warnings.delete(key);
    await message.channel.send(`✅ Cleared all warnings for **${target.user.tag}**.`);
  },
};
