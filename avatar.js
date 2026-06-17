const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'avatar',
  description: 'Get avatar of a user',
  async execute(message, args) {
    const target = message.mentions.users.first()
      || (args[0] ? await message.client.users.fetch(args[0]).catch(() => null) : null)
      || message.author;

    const url = target.displayAvatarURL({ size: 512, extension: 'png' });
    const embed = new EmbedBuilder()
      .setColor(0x5865F2)
      .setTitle(`${target.tag}'s avatar`)
      .setImage(url)
      .setURL(url);

    await message.channel.send({ embeds: [embed] });
  },
};
