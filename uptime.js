module.exports = {
  name: 'uptime',
  description: 'Bot uptime',
  async execute(message, args, client) {
    const ms = client.uptime;
    const d = Math.floor(ms / 86400000);
    const h = Math.floor((ms % 86400000) / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    await message.channel.send(`⏱️ Uptime: **${d}d ${h}h ${m}m ${s}s**`);
  },
};
