const { PermissionFlagsBits } = require('discord.js');

module.exports = {
  name: 'slowmode',
  description: 'Set channel slowmode',
  async execute(message, args) {
    if (!message.member.permissions.has(PermissionFlagsBits.ManageChannels))
      return message.channel.send('❌ You don\'t have permission to manage channels.');

    const seconds = parseInt(args[0]);
    if (isNaN(seconds) || seconds < 0 || seconds > 21600) return message.channel.send('❌ Provide seconds between 0–21600.');
    try {
      await message.channel.setRateLimitPerUser(seconds);
      await message.channel.send(seconds === 0 ? '✅ Slowmode disabled.' : `✅ Slowmode set to **${seconds}s**.`);
    } catch {
      await message.channel.send('❌ Could not set slowmode.');
    }
  },
};
