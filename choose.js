module.exports = {
  name: 'choose',
  description: 'Choose between options',
  async execute(message, args) {
    const options = args.join(' ').split('|').map(o => o.trim()).filter(Boolean);
    if (options.length < 2) return message.channel.send('❌ Provide at least 2 options separated by `|`.');
    const pick = options[Math.floor(Math.random() * options.length)];
    await message.channel.send(`🤔 I choose: **${pick}**`);
  },
};
