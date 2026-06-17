const { EmbedBuilder } = require('discord.js');
const coOwners = require('../coowners');

module.exports = {
  name: 'owner',
  description: 'Add or remove a co-owner (main owner only)',
  async execute(message, args, client) {
    // ,owner with no args → show usage
    if (!args[0]) {
      return message.channel.send(`**Usage:**\n\`,owner add <@user/id>\` — grant command access\n\`,owner remove <@user/id>\` — revoke command access`);
    }

    const sub = args[0].toLowerCase();
    if (!['add', 'remove'].includes(sub)) {
      return message.channel.send('❌ Use `add` or `remove`.');
    }

    // Resolve user from mention or ID
    const targetId = message.mentions.users.first()?.id || args[1];
    if (!targetId || !/^\d+$/.test(targetId)) return message.channel.send('❌ Provide a valid @user or user ID.');

    // Can't add/remove main owner
    if (targetId === process.env.OWNER_ID) return message.channel.send('❌ That\'s the main owner.');

    const target = await client.users.fetch(targetId).catch(() => null);
    if (!target) return message.channel.send('❌ Could not find that user.');

    if (sub === 'add') {
      if (coOwners.has(targetId)) return message.channel.send(`⚠️ **${target.tag}** is already a co-owner.`);
      coOwners.add(targetId);
      const embed = new EmbedBuilder().setColor(0x57F287)
        .setDescription(`✅ **${target.tag}** is now a co-owner and can use all bot commands.`);
      return message.channel.send({ embeds: [embed] });
    }

    if (sub === 'remove') {
      if (!coOwners.has(targetId)) return message.channel.send(`⚠️ **${target.tag}** is not a co-owner.`);
      coOwners.delete(targetId);
      const embed = new EmbedBuilder().setColor(0xED4245)
        .setDescription(`✅ **${target.tag}** has been removed as co-owner.`);
      return message.channel.send({ embeds: [embed] });
    }
  },
};
