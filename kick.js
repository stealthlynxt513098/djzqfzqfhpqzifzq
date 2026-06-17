const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  name: 'kick',
  description: 'Kick a user',
  async execute(message, args) {
    if (!message.member.permissions.has(PermissionFlagsBits.KickMembers))
      return message.channel.send('❌ You don\'t have permission to kick members.');

    const target = message.mentions.members.first() || (args[0] ? await message.guild.members.fetch(args[0]).catch(() => null) : null);
    if (!target) return message.channel.send('❌ Provide a valid user.');

    const reason = args.slice(1).join(' ') || 'No reason provided';

    // DM FIRST before kicking so they can still receive it
    const dmEmbed = new EmbedBuilder()
      .setColor(0xFEE75C)
      .setTitle(`👢 You have been kicked from ${message.guild.name}`)
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .addFields(
        { name: '📋 Reason', value: reason },
        { name: '👮 Kicked by', value: message.author.tag },
        { name: '🏠 Server', value: message.guild.name }
      )
      .setTimestamp()
      .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) });

    await target.send({ embeds: [dmEmbed] }).catch(() => null);

    // THEN kick
    try {
      await target.kick(reason);
      const embed = new EmbedBuilder()
        .setColor(0xFEE75C)
        .setDescription(`👢 **${target.user.tag}** has been kicked.\n**Reason:** ${reason}`);
      await message.channel.send({ embeds: [embed] });
    } catch {
      await message.channel.send('❌ Could not kick that user.');
    }
  },
};
