module.exports = {
  name: 'ping',
  description: 'Bot latency',
  async execute(message, args, client) {
    const sent = await message.channel.send('🏓 Pinging...');
    const latency = sent.createdTimestamp - message.createdTimestamp;
    await sent.edit(`🏓 Pong! Latency: **${latency}ms** | API: **${Math.round(client.ws.ping)}ms**`);
  },
};
