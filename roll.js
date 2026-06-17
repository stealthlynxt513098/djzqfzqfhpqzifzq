module.exports = {
  name: 'roll',
  description: 'Roll a dice',
  async execute(message, args) {
    const sides = parseInt(args[0]) || 6;
    if (sides < 2 || sides > 1000) return message.channel.send('❌ Sides must be between 2–1000.');
    const result = Math.floor(Math.random() * sides) + 1;
    await message.channel.send(`🎲 You rolled a **${result}** (d${sides})`);
  },
};
