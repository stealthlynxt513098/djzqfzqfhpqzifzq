const { PermissionFlagsBits } = require('discord.js');

module.exports = {
  name: 'unlock',
  description: 'Unlock the current channel',
  async execute(message) {
    if (!message.member.permissions.has(PermissionFlagsBits.ManageChannels))
      return message.channel.send('❌ You don\'t have permission to manage channels.');

    try {
      await message.channel.permissionOverwrites.edit(message.guild.roles.everyone, { SendMessages: null });
      await message.channel.send('🔓 Channel unlocked.');
    } catch {
      await message.channel.send('❌ Could not unlock channel.');
    }
  },
};
