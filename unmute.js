const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  name: 'unmute',
  description: 'Remove timeout from a user',
  async execute(message, args) {
    if (!message.member.permissions.has(PermissionFlagsBits.ModerateMembers))
      return message.channel.send('❌ You don\'t have permission to timeout members.');

    const target = message.mentions.members.first() || (args[0] ? await message.guild.members.fetch(args[0]).catch(() => null) : null);
    if (!target) return message.channel.send('❌ Provide a valid user.');
    try {
      await target.timeout(null);
      const embed = new EmbedBuilder().setColor(0x57F287).setDescription(`🔊 **${target.user.tag}** has been unmuted.`);
      await message.channel.send({ embeds: [embed] });
    } catch {
      await message.channel.send('❌ Could not unmute that user.');
    }
  },
};
