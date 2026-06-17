module.exports = {
  name: 'coinflip',
  description: 'Flip a coin',
  async execute(message) {
    const result = Math.random() < 0.5 ? '🪙 Heads!' : '🪙 Tails!';
    await message.channel.send(result);
  },
};
