const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'help',
  description: 'Shows the help menu',
  async execute(message, args, client) {
    const prefix = process.env.PREFIX || ',';

    const embed = new EmbedBuilder()
      .setTitle('📋 Command List')
      .setColor(0x5865F2)
      .setDescription(`Prefix: \`${prefix}\` — all commands owner-only.`)
      .addFields(
        {
          name: '🛡️ Moderation',
          value: [
            `\`${prefix}ban <@user> [reason]\` — Ban a user`,
            `\`${prefix}kick <@user> [reason]\` — Kick a user`,
            `\`${prefix}mute <@user> <duration>\` — Timeout a user (e.g. \`10m\`, \`1h\`)`,
            `\`${prefix}unmute <@user>\` — Remove timeout`,
            `\`${prefix}warn <@user> [reason]\` — Warn a user`,
            `\`${prefix}warnings <@user>\` — View warnings`,
            `\`${prefix}clearwarns <@user>\` — Clear warnings`,
            `\`${prefix}purge <amount>\` — Bulk delete messages`,
            `\`${prefix}slowmode <seconds>\` — Set slowmode`,
            `\`${prefix}lock\` — Lock current channel`,
            `\`${prefix}unlock\` — Unlock current channel`,
            `\`${prefix}nick <@user> [name]\` — Change nickname`,
          ].join('\n'),
        },
        {
          name: '📊 Info / Utility',
          value: [
            `\`${prefix}userinfo [@user]\` — Info about a user`,
            `\`${prefix}serverinfo\` — Info about the server`,
            `\`${prefix}avatar [@user]\` — Get avatar`,
            `\`${prefix}ping\` — Bot latency`,
            `\`${prefix}uptime\` — Bot uptime`,
            `\`${prefix}roleinfo <@role>\` — Info about a role`,
          ].join('\n'),
        },
        {
          name: '🎲 Fun',
          value: [
            `\`${prefix}8ball <question>\` — Ask the magic 8ball`,
            `\`${prefix}coinflip\` — Heads or tails`,
            `\`${prefix}roll [sides]\` — Roll a dice`,
            `\`${prefix}choose <a | b | ...>\` — Pick a random option`,
            `\`${prefix}reverse <text>\` — Reverse text`,
          ].join('\n'),
        },
        {
          name: '😄 Emoji',
          value: [
            `\`${prefix}stealemoji <emoji> [name]\` — Add an emoji to this server`,
          ].join('\n'),
        },
        {
          name: '👑 Owner (main owner only)',
          value: [
            `\`${prefix}owner add <@user/id>\` — Grant co-owner command access`,
            `\`${prefix}owner remove <@user/id>\` — Revoke co-owner access`,
            `\`${prefix}owners\` — List main owner and co-owners`,
          ].join('\n'),
        },
      )
      .setTimestamp()
      .setFooter({ text: `${client.user.username}`, iconURL: client.user.displayAvatarURL() });

    await message.channel.send({ embeds: [embed] });
  },
};
