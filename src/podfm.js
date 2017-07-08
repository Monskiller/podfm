config      	= require("./config.json");
if (!config.keys.discord || config.keys.discord.length <= 30)
	return log.warn("Invalid token specified. Please ensure you haven't specified the ClientID/ClientSecret");
permissions 	= require("../util/Permissions.js");
log 			= require('../util/Log.js')
const sf		= require("snekfetch");
const Discord	= require("discord.js");
const moment	= require('moment');

const client = new Discord.Client({
	disableEvents: {
		"GUILD_BAN_ADD"  : true,
		"GUILD_BAN_REMOVE" : true,
		"MESSAGE_DELETE" : true,
		"MESSAGE_DELETE_BULK" : true,
		"MESSAGE_UPDATE" : true,
		"PRESENCE_UPDATE" : true,
		"TYPING_START" : true,
		"USER_UPDATE" : true
	},
	messageLimit: 0
});

client.queues   	= {};
client.prefixes 	= require("./prefixes.json");
client.volume 		= require("./volume.json");

client.on("ready", async () => {
	log.info(`${client.user.username}#${client.user.discriminator} ready!`);
	client.user.setGame(`${config.options.prefix}help`);

	client.guilds.forEach(g => {
		if (!client.prefixes[g.id]) client.prefixes[g.id] = config.options.prefix;
		if (!client.queues[g.id]) client.queues[g.id] = { id: g.id, msgc: "", dj: "", queue: [], svotes: [], repeat: "None" };
	});
});

client.on("guildCreate", g => {
	if ((g.members.filter(m => m.bot).length / g.members.size) >= 0.68) return g.leave();
	g.defaultChannel.send("Sup! This is **pod.fm**, thank you for inviting me. You can view my commands with `.help`. Please report any issues to Monskiller#8879");

	client.prefixes[g.id] = config.options.prefix;
	client.queues[g.id] = { id: g.id, msgc: "", queue: [], svotes: [], repeat: "None" };
});

client.on("guildDelete", g => {
	delete client.prefixes[g.id];
	delete client.queues[g.id];
});

client.on("message", async msg => {
	if (!msg.guild || msg.author.bot || !client.queues[msg.guild.id]) return;

	if (msg.mentions.users.find(u => u.id === client.user.id) && msg.content.toLowerCase().includes("help"))
		return msg.channel.send({ embed: {
			color: config.options.embedColour,
			title: `Use ${client.prefixes[msg.guild.id]}help for commands`
		}});

	if (!msg.content.startsWith(client.prefixes[msg.guild.id]) || !msg.channel.permissionsFor(client.user).has('SEND_MESSAGES') || !msg.channel.permissionsFor(client.user).has('EMBED_LINKS')) return;

	let command = msg.content.slice(client.prefixes[msg.guild.id].length).toLowerCase().split(" ")[0];
	const args  = msg.content.split(" ").slice(1);

	delete require.cache[require.resolve("./aliases.json")];
	let aliases = require("./aliases.json");
	if (aliases[command]) command = aliases[command];

	try {
		delete require.cache[require.resolve(`./commands/${command}`)];
		require(`./commands/${command}`).run(client, msg, args);
		log.cmd(msg, command);
	} catch(e) {
		if (e.message.includes("Cannot find module") || e.message.includes("ENOENT")) return;
		msg.channel.send({ embed: {
			color: config.options.embedColour,
			title: `${command} failed`,
			description: `The command failed to run. The error has been logged.`
		}});
		log.err(`${e.message}\n${e.stack.split("\n")[0]}\n${e.stack.split("\n")[1]}`);
	} 
});


client.on("voiceStateUpdate", async (oldM, newM) => {
	if (!client.voiceConnections.get(oldM.guild.id) || !client.voiceConnections.get(newM.guild.id)) return;

	if (oldM.voiceChannelID == client.voiceConnections.get(oldM.guild.id).channel.id && newM.voiceChannelID !== oldM.voiceChannelID && client.queues[oldM.guild.id].dj == oldM.id){
		let nextDJ = client.queues[oldM.guild.id].queue.find(q => q.req !== oldM.id);

		setTimeout( () => {
			if (!client.voiceConnections.get(oldM.guild.id).channel.members.has(oldM.id)){
				if (nextDJ){
					client.queues[oldM.guild.id].dj = nextDJ.req;
					client.channels.get(client.queues[oldM.guild.id].msgc).send({ embed: {
					color: config.options.embedColour,
					title: "New Voice Chat DJ",
					description: `${client.users.get(nextDJ.req) ? `${client.users.get(nextDJ.req).username}#${client.users.get(nextDJ.req).discriminator}` : "Unknown"} Can now use DJ commands`,
				}});
				} else {
					let usr = oldM.voiceChannel.members.filter(u => !u.user.bot).randomKey();
					client.queues[oldM.guild.id].dj = usr;
					client.channels.get(client.queues[oldM.guild.id].msgc).send({ embed: {
						color: config.options.embedColour,
						title: "New Voice Chat DJ",
						description: `${client.users.get(usr) ? `${client.users.get(usr).username}#${client.users.get(usr).discriminator}` : "Unknown"} Can now use DJ commands`,
					}});
				}
			}
		}, 5000)
	}
});

client.login(config.keys.discord);

process.on("uncaughtException", err => {
	log.err(err.message)
});
