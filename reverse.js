module.exports = {
  name: 'reverse',
  description: 'Reverse text',
  async execute(message, args) {
    const text = args.join(' ');
    if (!text) return message.channel.send('❌ Provide some text.');
    await message.channel.send(`🔄 ${text.split('').reverse().join('')}`);
  },
};
