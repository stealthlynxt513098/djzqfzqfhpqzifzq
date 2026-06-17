const { EmbedBuilder } = require('discord.js');

const warnings = new Map();

const {
  WARN1_ROLE_ID,
  WARN2_ROLE_ID,
  WARN3_ROLE_ID,
} = process.env;

module.exports = {
  name: 'warn',
  description: 'Warn a user',
  warnings,
  async execute(message, args) {
    const target = message.mentions.members.first() || (args[0] ? await message.guild.members.fetch(args[0]).catch(() => null) : null);
    if (!target) return message.channel.send('❌ Provide a valid user.');

    const reason = args.slice(1).join(' ') || 'No reason provided';
    const key = `${message.guild.id}-${target.id}`;
    if (!warnings.has(key)) warnings.set(key, []);
    warnings.get(key).push({ reason, date: new Date().toISOString() });

    const count = warnings.get(key).length;

    // DM the user
    const dmEmbed = new EmbedBuilder()
      .setColor(0xFEE75C)
      .setTitle(`⚠️ You have been warned in ${message.guild.name}`)
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .addFields(
        { name: '📋 Reason', value: reason },
        { name: '👮 Warned by', value: message.author.tag },
        { name: '🔢 Total Warnings', value: `${count}` },
        { name: '🏠 Server', value: message.guild.name }
      )
      .setTimestamp()
      .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) });

    await target.send({ embeds: [dmEmbed] }).catch(() => null);

    // Warning 1 — give role
    if (count === 1 && WARN1_ROLE_ID) {
      const role = message.guild.roles.cache.get(WARN1_ROLE_ID);
      if (role) await target.roles.add(role).catch(() => null);
    }

    // Warning 2 — give role
    if (count === 2 && WARN2_ROLE_ID) {
      const role = message.guild.roles.cache.get(WARN2_ROLE_ID);
      if (role) await target.roles.add(role).catch(() => null);
    }

    // Warning 3 — give role
    if (count === 3 && WARN3_ROLE_ID) {
      const role = message.guild.roles.cache.get(WARN3_ROLE_ID);
      if (role) await target.roles.add(role).catch(() => null);
    }

    // Warning 4 — kick
    if (count >= 4) {
      const kickDm = new EmbedBuilder()
        .setColor(0xED4245)
        .setTitle(`👢 You have been kicked from ${message.guild.name}`)
        .setThumbnail(message.guild.iconURL({ dynamic: true }))
        .addFields(
          { name: '📋 Reason', value: 'You reached 4 warnings — final warning exceeded' },
          { name: '🏠 Server', value: message.guild.name }
        )
        .setTimestamp()
        .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) });

      await target.send({ embeds: [kickDm] }).catch(() => null);
      await target.kick('Kicked for reaching 4 warnings — final warning exceeded').catch(() => null);
    }

    const embed = new EmbedBuilder()
      .setColor(0xFEE75C)
      .setDescription(`⚠️ **${target.user.tag}** warned. They now have **${count}** warning(s).\n**Reason:** ${reason}${count >= 4 ? '\n\n👢 User has been **kicked** for reaching 4 warnings.' : ''}`);
    await message.channel.send({ embeds: [embed] });
  },
};
