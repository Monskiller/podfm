config      	= require("./config.json");
if (!config.keys.discord || config.keys.discord.length <= 30)
	return log.warn("Invalid token specified. Please ensure you haven't specified the ClientID/ClientSecret");
permissions 	= require("../util/Permissions.js");
log 			= require('../util/Log.js')
const sf		= require("snekfetch");
const Discord	= require("discord.js");
const moment	= require('moment');
const fs 		= require('fs');

const client = new Discord.Client({
	disableEvents: [
		"GUILD_BAN_ADD",
		"GUILD_BAN_REMOVE",
		"MESSAGE_DELETE",
		"MESSAGE_DELETE_BULK",
		"MESSAGE_UPDATE",
		"PRESENCE_UPDATE",
		"TYPING_START",
		"USER_UPDATE"
	]
});

client.queues   	= {};
client.prefixes 	= require("./prefixes.json");
client.volume 		= require("./volume.json");
client.updated 		= false;

client.on("ready", async () => {
	log.info(`${client.user.username}#${client.user.discriminator} ready!`);
	client.user.setGame(`${config.options.prefix}help`);

	client.guilds.forEach(g => {
		if (!client.prefixes[g.id]) client.prefixes[g.id] = config.options.prefix;
		if (!client.queues[g.id]) client.queues[g.id] = { id: g.id, msgc: "", dj: "", vcid: "", queue: [], svotes: [], repeat: "None", auto: false };
	});
});

client.on('disconnect', (event) => {
    log.warn(`Disconnected with close event: ${event.code}\nOn reason: ${event.reason}`);
    process.exit();
});

client.on("guildCreate", g => {
	if ((g.members.filter(m => m.bot).length / g.members.size) >= 0.68) return g.leave();
	g.defaultChannel.send("Sup! This is **pod.fm**, thank you for inviting me. You can view my commands with `.help`. Please report any issues to Monskiller#8879");

	client.prefixes[g.id] = config.options.prefix;
	client.queues[g.id] = { id: g.id, msgc: "", dj: "", vcid: "", queue: [], svotes: [], repeat: "None", auto: false };
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

	let regex = new RegExp(`^\\${client.prefixes[msg.guild.id]}(\\w*[^0-9])?(\\d+)?`, 'i')

	let command = regex.exec(msg.content.split(" ")[0])[1].toLowerCase();
	const match = msg.content.slice(msg.content.split(" ")[0].length);

	const sel = regex.exec(msg.content.split(" ")[0])[2];
	const optrx = /(?:[^\w]-\w+|--\w+)|^(?:-\w+|--\w+)/gi;
	const args  = match.replace(optrx, '').trim();

	let options = new Array();
	if (match.match(optrx)) for (let opt of match.match(optrx)) {
		options.push(opt.replace(/-|--/gi, '').trim());
	}

	delete require.cache[require.resolve("./aliases.json")];
	let aliases = require("./aliases.json");
	if (aliases[command]) command = aliases[command];

	try {
		delete require.cache[require.resolve(`./commands/${command}`)];
		require(`./commands/${command}`).run(client, msg, args, options, sel);
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
	if (!client.voiceConnections.first() && client.updated && newM.id == client.user.id) {
		let usr = await client.fetchUser('174573919544672258')
			.catch(log.err);

		let dm = await usr.createDM()
			.catch(log.err);

		await dm.send(':gear: Now restarting and pushing update...')
			.catch(log.err);

		process.exit();
	} 

	if (!client.voiceConnections.get(oldM.guild.id) || !client.voiceConnections.get(newM.guild.id)) return;

	if (oldM.voiceChannelID == client.voiceConnections.get(oldM.guild.id).channel.id && client.voiceConnections.get(oldM.guild.id).channel.members.array().filter(m => !m.user.bot).length == 0 && client.queues[oldM.guild.id].auto) {

		setTimeout( () => {
			if (client.voiceConnections.get(oldM.guild.id).channel.members.array().filter(m => !m.user.bot).length == 0) {
				client.queues[oldM.guild.id].auto = false;
			}
		}, 4500)
	}

	if (oldM.voiceChannelID == client.voiceConnections.get(oldM.guild.id).channel.id && newM.voiceChannelID !== oldM.voiceChannelID && client.queues[oldM.guild.id].dj == oldM.id){
		let nextDJ = client.queues[oldM.guild.id].queue.find(q => q.req.id !== oldM.id);

		setTimeout( () => {
			if (client.voiceConnections.get(oldM.guild.id) && !client.voiceConnections.get(oldM.guild.id).channel.members.has(oldM.id)){
				if (nextDJ && !client.queues[oldM.guild.id].auto){
					client.queues[oldM.guild.id].dj = nextDJ.req.id;
					client.channels.get(client.queues[oldM.guild.id].msgc).send({ embed: {
					color: config.options.embedColour,
					title: "New Voice Chat DJ",
					description: `${nextDJ.req ? `<@!${nextDJ.req.id}>` : "Unknown"} now has access to DJ commands`,
				}});
				} else {
					let usr = oldM.voiceChannel.members.filter(u => !(permissions.isAdmin(u) || permissions.isDJ(u, client) || u.user.bot || permissions.isBlocked(u))).randomKey();
					client.queues[oldM.guild.id].dj = usr;
					client.channels.get(client.queues[oldM.guild.id].msgc).send({ embed: {
						color: config.options.embedColour,
						title: "New Voice Chat DJ",
						description: `${client.users.get(usr) ? `<@!${usr}>` : "Unknown"} now has access to DJ commands`,
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

fs.watchFile(__filename, (curr, prev) => {
	if (curr.mtime.getTime() !== prev.mtime.getTime()) client.updated = true;
})