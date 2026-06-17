const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'userinfo',
  description: 'Get info about a user',
  async execute(message, args) {
    const target = message.mentions.members.first()
      || (args[0] ? await message.guild.members.fetch(args[0]).catch(() => null) : null)
      || message.member;

    const user = target.user;
    const roles = target.roles.cache.filter(r => r.id !== message.guild.id).map(r => `<@&${r.id}>`).join(', ') || 'None';

    const embed = new EmbedBuilder()
      .setColor(target.displayHexColor || 0x5865F2)
      .setThumbnail(user.displayAvatarURL({ size: 256 }))
      .setTitle(`${user.tag}`)
      .addFields(
        { name: 'ID', value: user.id, inline: true },
        { name: 'Nickname', value: target.nickname || 'None', inline: true },
        { name: 'Bot', value: user.bot ? 'Yes' : 'No', inline: true },
        { name: 'Account Created', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`, inline: true },
        { name: 'Joined Server', value: `<t:${Math.floor(target.joinedTimestamp / 1000)}:R>`, inline: true },
        { name: `Roles (${target.roles.cache.size - 1})`, value: roles.length > 1024 ? roles.slice(0, 1020) + '...' : roles },
      )
      .setTimestamp();

    await message.channel.send({ embeds: [embed] });
  },
};
