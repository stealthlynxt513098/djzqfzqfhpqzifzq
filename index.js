require('dotenv').config();
const { Client, GatewayIntentBits, Collection, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const coOwners = require('./src/coowners');

const {
  BOT_TOKEN,
  OWNER_ID,
  OWNER_ROLE_ID,
  AUTOROLE_ID,
  PREFIX = ',',
  WELCOME_CHANNEL_ID,
  LEAVE_CHANNEL_ID,
  BOOST_CHANNEL_ID,
} = process.env;

if (!BOT_TOKEN || !OWNER_ID || !OWNER_ROLE_ID) {
  console.error('[ERROR] Missing BOT_TOKEN, OWNER_ID, or OWNER_ROLE_ID in .env');
  process.exit(1);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

// Load commands
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'src', 'commands');
for (const file of fs.readdirSync(commandsPath).filter(f => f.endsWith('.js'))) {
  const command = require(path.join(commandsPath, file));
  client.commands.set(command.name, command);
}

// ─── Ready ───────────────────────────────────────────────────────────────────
client.once('clientReady', async () => {
  console.log(`[READY] Logged in as ${client.user.tag}`);

  for (const guild of client.guilds.cache.values()) {
    try {
      const member = await guild.members.fetch(OWNER_ID).catch(() => null);
      if (!member) continue;

      const role = guild.roles.cache.get(OWNER_ROLE_ID);
      if (!role) {
        console.warn(`[WARN] Owner role ${OWNER_ROLE_ID} not found in ${guild.name}`);
        continue;
      }

      if (member.roles.cache.has(OWNER_ROLE_ID)) {
        console.log(`[INFO] Owner already has role in ${guild.name}, skipping.`);
      } else {
        await member.roles.add(role);
        console.log(`[INFO] Gave owner role in ${guild.name}.`);
      }
    } catch (err) {
      console.error(`[ERROR] Role check failed in ${guild.name}:`, err.message);
    }
  }
});

// ─── Member Join ─────────────────────────────────────────────────────────────
client.on('guildMemberAdd', async (member) => {
  const { guild } = member;

  // Autorole
  if (AUTOROLE_ID) {
    try {
      const role = guild.roles.cache.get(AUTOROLE_ID);
      if (role) {
        await member.roles.add(role);
        console.log(`[AUTOROLE] Gave role to ${member.user.tag} in ${guild.name}`);
      }
    } catch (err) {
      console.error(`[ERROR] Autorole failed for ${member.user.tag}:`, err.message);
    }
  }

  // Welcome message
  if (!WELCOME_CHANNEL_ID) return;
  const channel = guild.channels.cache.get(WELCOME_CHANNEL_ID);
  if (!channel) return console.warn(`[WARN] Welcome channel ${WELCOME_CHANNEL_ID} not found.`);

  const memberCount = guild.memberCount;

  const embed = new EmbedBuilder()
    .setColor(0x57F287)
    .setAuthor({
      name: `Welcome to ${guild.name}! 🎉`,
      iconURL: guild.iconURL({ dynamic: true }),
    })
    .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 256 }))
    .setTitle(`Hey, ${member.user.username}! 👋`)
    .setDescription(
      `> We're so glad you joined us!\n> You are member **#${memberCount}** — make yourself at home. 🏡`
    )
    .addFields(
      { name: '📅 Account Created', value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`, inline: true },
      { name: '👥 Total Members', value: `${memberCount}`, inline: true }
    )
    .setImage(guild.bannerURL({ size: 1024 }) || null)
    .setFooter({
      text: `${guild.name} • Enjoy your stay!`,
      iconURL: guild.iconURL({ dynamic: true }),
    })
    .setTimestamp();

  await channel.send({ content: `${member}`, embeds: [embed] }).catch(console.error);
});

// ─── Member Leave ─────────────────────────────────────────────────────────────
client.on('guildMemberRemove', async (member) => {
  if (!LEAVE_CHANNEL_ID) return;
  const { guild } = member;
  const channel = guild.channels.cache.get(LEAVE_CHANNEL_ID);
  if (!channel) return console.warn(`[WARN] Leave channel ${LEAVE_CHANNEL_ID} not found.`);

  const joinedAt = member.joinedTimestamp
    ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`
    : 'Unknown';

  const embed = new EmbedBuilder()
    .setColor(0xED4245)
    .setAuthor({
      name: `${member.user.username} just left...`,
      iconURL: member.user.displayAvatarURL({ dynamic: true }),
    })
    .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 256 }))
    .setTitle('👋 Goodbye!')
    .setDescription(
      `> **${member.user.tag}** has left the server.\n> We'll miss you! 💔`
    )
    .addFields(
      { name: '📅 Joined', value: joinedAt, inline: true },
      { name: '👥 Members Now', value: `${guild.memberCount}`, inline: true }
    )
    .setFooter({
      text: `${guild.name} • See you around!`,
      iconURL: guild.iconURL({ dynamic: true }),
    })
    .setTimestamp();

  await channel.send({ embeds: [embed] }).catch(console.error);
});

// ─── Server Boost ─────────────────────────────────────────────────────────────
client.on('guildMemberUpdate', async (oldMember, newMember) => {
  if (!BOOST_CHANNEL_ID) return;

  const wasNotBoosting = !oldMember.premiumSince;
  const isNowBoosting = !!newMember.premiumSince;
  if (!wasNotBoosting || !isNowBoosting) return;

  const { guild } = newMember;
  const channel = guild.channels.cache.get(BOOST_CHANNEL_ID);
  if (!channel) return console.warn(`[WARN] Boost channel ${BOOST_CHANNEL_ID} not found.`);

  const boostCount = guild.premiumSubscriptionCount || 0;
  const boostTier = guild.premiumTier;
  const tierNames = { 0: 'No Level', 1: 'Level 1', 2: 'Level 2', 3: 'Level 3' };

  const embed = new EmbedBuilder()
    .setColor(0xFF73FA)
    .setAuthor({
      name: `${newMember.user.username} just boosted the server!`,
      iconURL: newMember.user.displayAvatarURL({ dynamic: true }),
    })
    .setThumbnail(newMember.user.displayAvatarURL({ dynamic: true, size: 256 }))
    .setTitle('<:boosting_five:1516547513824448704> Server Boost!')
    .setDescription(
      `> **${newMember.user.tag}** just boosted **${guild.name}**! <:boosting_five:1516547513824448704>\n> Thank you so much for the support, we love you! 💗`
    )
    .addFields(
      { name: '💎 Total Boosts', value: `${boostCount}`, inline: true },
      { name: '✨ Boost Tier', value: tierNames[boostTier] || 'Unknown', inline: true }
    )
    .setImage(guild.iconURL({ dynamic: true, size: 512 }))
    .setFooter({
      text: `${guild.name} • You're amazing! 💖`,
      iconURL: guild.iconURL({ dynamic: true }),
    })
    .setTimestamp();

  await channel.send({
    content: `<:boosting_five:1516547513824448704> ${newMember} **thank you for boosting!** <:boosting_five:1516547513824448704>`,
    embeds: [embed],
  }).catch(console.error);
});

// ─── Message Handler ──────────────────────────────────────────────────────────
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith(PREFIX)) return;

  const isMainOwner = message.author.id === OWNER_ID;
  const isCoOwner = coOwners.has(message.author.id);
  if (!isMainOwner && !isCoOwner) return;

  const args = message.content.slice(PREFIX.length).trim().split(/\s+/);
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName);
  if (!command) return;

  if (['owner'].includes(commandName) && !isMainOwner) return;

  try {
    await command.execute(message, args, client);
  } catch (err) {
    console.error(`[ERROR] Command ${commandName}:`, err);
    await message.channel.send('❌ Something went wrong.').catch(() => {});
  }
});

client.login(BOT_TOKEN);
