const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'roleinfo',
  description: 'Get info about a role',
  async execute(message, args) {
    const role = message.mentions.roles.first()
      || (args[0] ? message.guild.roles.cache.get(args[0]) : null);
    if (!role) return message.channel.send('❌ Provide a valid role.');

    const embed = new EmbedBuilder()
      .setColor(role.hexColor)
      .setTitle(role.name)
      .addFields(
        { name: 'ID', value: role.id, inline: true },
        { name: 'Color', value: role.hexColor, inline: true },
        { name: 'Members', value: `${role.members.size}`, inline: true },
        { name: 'Mentionable', value: role.mentionable ? 'Yes' : 'No', inline: true },
        { name: 'Hoisted', value: role.hoist ? 'Yes' : 'No', inline: true },
        { name: 'Position', value: `${role.position}`, inline: true },
        { name: 'Created', value: `<t:${Math.floor(role.createdTimestamp / 1000)}:R>`, inline: true },
      )
      .setTimestamp();

    await message.channel.send({ embeds: [embed] });
  },
};
