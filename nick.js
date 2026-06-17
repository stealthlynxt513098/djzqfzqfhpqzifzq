const { PermissionFlagsBits } = require('discord.js');

module.exports = {
  name: 'nick',
  description: 'Change nickname of a user',
  async execute(message, args) {
    if (!message.member.permissions.has(PermissionFlagsBits.ManageNicknames))
      return message.channel.send('❌ You don\'t have permission to manage nicknames.');

    const target = message.mentions.members.first() || (args[0] ? await message.guild.members.fetch(args[0]).catch(() => null) : null);
    if (!target) return message.channel.send('❌ Provide a valid user.');
    const nick = args.slice(1).join(' ') || null;
    try {
      await target.setNickname(nick);
      await message.channel.send(nick ? `✅ Nickname set to **${nick}**.` : `✅ Nickname reset for **${target.user.tag}**.`);
    } catch {
      await message.channel.send('❌ Could not change nickname.');
    }
  },
};
