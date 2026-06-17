const { PermissionFlagsBits } = require('discord.js');

module.exports = {
  name: 'purge',
  description: 'Bulk delete messages',
  async execute(message, args) {
    if (!message.member.permissions.has(PermissionFlagsBits.ManageMessages))
      return message.channel.send('❌ You don\'t have permission to manage messages.');

    const amount = parseInt(args[0]);
    if (isNaN(amount) || amount < 1 || amount > 100) return message.channel.send('❌ Provide a number between 1–100.');
    try {
      await message.delete().catch(() => {});
      const deleted = await message.channel.bulkDelete(amount, true);
      const msg = await message.channel.send(`🗑️ Deleted **${deleted.size}** message(s).`);
      setTimeout(() => msg.delete().catch(() => {}), 3000);
    } catch {
      await message.channel.send('❌ Could not purge messages (they may be older than 14 days).');
    }
  },
};
