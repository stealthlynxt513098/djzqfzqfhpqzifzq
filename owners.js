const { EmbedBuilder } = require('discord.js');
const coOwners = require('../coowners');

module.exports = {
  name: 'owners',
  description: 'List main owner and co-owners',
  async execute(message, args, client) {
    const mainOwner = await client.users.fetch(process.env.OWNER_ID).catch(() => null);

    let coOwnerList = 'None';
    if (coOwners.size > 0) {
      const resolved = await Promise.all(
        [...coOwners].map(id => client.users.fetch(id).catch(() => ({ tag: `Unknown (${id})` })))
      );
      coOwnerList = resolved.map((u, i) => `\`${i + 1}.\` ${u.tag} (\`${[...coOwners][i]}\`)`).join('\n');
    }

    const embed = new EmbedBuilder()
      .setColor(0x5865F2)
      .setTitle('👑 Bot Owners')
      .addFields(
        { name: '👑 Main Owner', value: mainOwner ? `${mainOwner.tag} (\`${mainOwner.id}\`)` : `\`${process.env.OWNER_ID}\`` },
        { name: `🔑 Co-Owners (${coOwners.size})`, value: coOwnerList },
      )
      .setFooter({ text: 'Co-owners can use all commands but have no special role.' })
      .setTimestamp();

    await message.channel.send({ embeds: [embed] });
  },
};
