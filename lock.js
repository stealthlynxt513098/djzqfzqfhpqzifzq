const { PermissionFlagsBits } = require('discord.js');

module.exports = {
  name: 'lock',
  description: 'Lock the current channel',
  async execute(message) {
    if (!message.member.permissions.has(PermissionFlagsBits.ManageChannels))
      return message.channel.send('❌ You don\'t have permission to manage channels.');

    try {
      await message.channel.permissionOverwrites.edit(message.guild.roles.everyone, { SendMessages: false });
      await message.channel.send('🔒 Channel locked.');
    } catch {
      await message.channel.send('❌ Could not lock channel.');
    }
  },
};
