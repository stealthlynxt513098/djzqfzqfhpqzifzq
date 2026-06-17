const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  name: 'mute',
  description: 'Timeout a user',
  async execute(message, args) {
    if (!message.member.permissions.has(PermissionFlagsBits.ModerateMembers))
      return message.channel.send('❌ You don\'t have permission to timeout members.');

    const target = message.mentions.members.first() || (args[0] ? await message.guild.members.fetch(args[0]).catch(() => null) : null);
    if (!target) return message.channel.send('❌ Provide a valid user.');

    const durationArg = args[1] || '10m';
    const match = durationArg.match(/^(\d+)([smhd])$/);
    if (!match) return message.channel.send('❌ Invalid duration. Use: `10s`, `5m`, `1h`, `1d`');

    const units = { s: 1000, m: 60000, h: 3600000, d: 86400000 };
    const ms = parseInt(match[1]) * units[match[2]];
    const reason = args.slice(2).join(' ') || 'No reason provided';

    // DM the user (they stay in server so this works fine, but sending before just in case)
    const dmEmbed = new EmbedBuilder()
      .setColor(0xEB459E)
      .setTitle(`🔇 You have been muted in ${message.guild.name}`)
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .addFields(
        { name: '⏱️ Duration', value: durationArg },
        { name: '📋 Reason', value: reason },
        { name: '👮 Muted by', value: message.author.tag },
        { name: '🏠 Server', value: message.guild.name }
      )
      .setTimestamp()
      .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) });

    await target.send({ embeds: [dmEmbed] }).catch(() => null);

    // THEN mute
    try {
      await target.timeout(ms, reason);
      const embed = new EmbedBuilder()
        .setColor(0xEB459E)
        .setDescription(`🔇 **${target.user.tag}** has been muted for **${durationArg}**.\n**Reason:** ${reason}`);
      await message.channel.send({ embeds: [embed] });
    } catch {
      await message.channel.send('❌ Could not mute that user.');
    }
  },
};
