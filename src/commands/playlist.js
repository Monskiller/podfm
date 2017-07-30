const ytutil           = require("../../util/youtubeHandler.js");
const scutil           = require("../../util/soundcloudHandler.js");
const sthandle         = require("../../util/streamHandler.js");

const ytrx = /(?:youtube\.com.*(?:\?|&)(?:v|list)=|youtube\\.com.*embed\/|youtube\.com.*v\/|youtu\.be\/)((?!videoseries)[a-zA-Z0-9\_\-]*)/;
const optrx = /\d+/;

exports.run = async function (client, msg, args, options, sel) {
	
	if(permissions.isBlocked(msg.member)) return msg.channel.send({ embed: {
		color: config.options.embedColour,
		title: "Denied",
		description: `Your permissions to use ${client.user.username} on this server are revoked.`
	}});

	if (!args) return msg.channel.send({ embed: {
		color: config.options.embedColour,
		title: "You need to specify what to play",
		description: "YouTube: Search Term, URL or Playlist URL\nSoundCloud: URL"
	}});

	if (!client.voiceConnections.get(msg.guild.id)) {
		if (!msg.member.voiceChannelID)
			return msg.channel.send({ embed: {
				color: config.options.embedColour,
				title: "Join a voicechannel first",
			}});

		if (!msg.guild.channels.get(msg.member.voiceChannelID).permissionsFor(client.user).has("CONNECT") || !msg.guild.channels.get(msg.member.voiceChannelID).speakable)
			return msg.channel.send({ embed: {
				color: config.options.embedColour,
				title: "Unable to Connect",
				description: "This channel doesn't allow me to connect/speak."
			}});


		const voice = await msg.member.voiceChannel.join()
		.catch(e => {
			msg.channel.send({ embed: {
				color: config.options.embedColour,
				title: "Unable to Connect",
				description: e.message
			}});
		});

		voice.on("disconnect", () => {
			client.voiceConnections.forEach(vc => {
				if (vc.dispatcher) {
					if (!vc.dispatcher.paused) {
						setTimeout( function() {
							vc.dispatcher.pause();
							setTimeout( function() {
								vc.dispatcher.resume();
							}, 300);
						}, 100);
					}
				}
			})
		});

		if (!client.voiceConnections.get(msg.guild.id) || !client.voiceConnections.get(msg.guild.id).channel.id) return;

	} else if (msg.member.voiceChannelID !== client.voiceConnections.get(msg.guild.id).channel.id)
		return msg.channel.send({ embed: {
			color: config.options.embedColour,
			title: "Join my voicechannel to queue.",
		}});

	let guild = client.queues[msg.guild.id];
	let plQ;
	if (permissions.hasRole(msg.member, 'DJ')) plQ = options.some(tx => optrx.test(tx)) ? options.filter(tx => optrx.test(tx))[0] : options.includes('full') ? Infinity : '15';
	guild.msgc = msg.channel.id;
	guild.vcid = client.voiceConnections.get(msg.guild.id).channel.id;

	if (guild.queue.length >= 30) return msg.channel.send({ embed: {
		color: config.options.embedColour,
		title: "Queue Limit Reached",
		description: "You've hit the queue limit. Wait for the queue to deplete before queueing more songs."
	}})

	const query = args.replace(/<|>/g, "");
	const ytrxm = query.match(ytrx);

	let res = {};

	if (!config.keys.youtube) {
		if (client.voiceConnections.get(msg.guild.id).channel.id && guild.queue.length === 0) client.voiceConnections.get(msg.guild.id).disconnect();
		return msg.channel.send({ embed: {
			color: config.options.embedColour,
			title: "No YouTube key specified",
			description: "No YouTube key was configured in 'config.json'. YouTube not available."
		}});
	};

	if (!ytrxm || !ytrxm[1]) {

        res.src = "youtube";
		res.type = "search";
		res.items = await ytutil.search(query, "playlist");

	} else if (ytrxm && ytrxm[1]) {

        res.src = "youtube";
		res.type = "playlist";
		res.items = await ytutil.getPlaylist(ytrxm[1], plQ, (options.includes('sh') | options.includes('shuffle')));

	};

	if (res.items.length === 0) {
		if (client.voiceConnections.get(msg.guild.id).channel.id && guild.queue.length === 0) client.voiceConnections.get(msg.guild.id).disconnect();
		return msg.channel.send({ embed: {
			color: config.options.embedColour,
			title: "No results found",
		}});
	};

	if (res.type !== "search") {

		res.items.map(v => guild.queue.push({ id: v.id, title: v.title, req: { username: msg.author.username, discriminator: msg.author.discriminator, id: msg.author.id }, src: res.src, durl: (res.src === "soundcloud" ? scrxm[1] : undefined) }));
		let embed = {
			color: config.options.embedColour,
			title: `Enqueued`,
			description: `${res.items[0].title}`
		}
		if (res.type === "playlist") embed.footer = {text: `...and ${res.items.slice(1).length} songs.`};

		msg.channel.send({ embed: embed });

	} else {

		if (sel) {

			res.songs = await ytutil.getPlaylist(res.items[sel - 1].id.playlistId, plQ, (options.includes('sh') | options.includes('shuffle')));
			res.songs.map(v => guild.queue.push({ id: v.id, title: v.title, req: { username: msg.author.username, discriminator: msg.author.discriminator, id: msg.author.id }, src: res.src }));

			msg.channel.send({embed: {
				color: config.options.embedColour,
				title: `Enqueued`,
				description: `${res.items[sel - 1].snippet.title} - **Playlist**`,
				footer: {
					text: `Requested by ${msg.author.username}#${msg.author.discriminator}`
				}
			}});

		} else {

			let src = await msg.channel.send({ embed: {
				color: config.options.embedColour,
				title: "Select Playlist",
				description: res.items.map((v, i) => `**${i + 1}.** ${v.snippet.title}`).join("\n"),
				footer: {
					text: `1 to ${res.items.length} || c to cancel selection`
				}
			}});

			const collector = await msg.channel.awaitMessages(m => m.author.id === msg.author.id && msg.guild && ((parseInt(m.content) && m.content >= 1 && m.content <= res.items.length) || m.content.toLowerCase().startsWith(client.prefixes[msg.guild.id] + "p") || m.content === "c"), {
				maxMatches: 1,
				time: 10000,
				errors: ['time']
			}).catch(c => {
				src.edit({ embed: {
					color: config.options.embedColour,
					title: `Too slow`,
					description: `You took more than 10 seconds to select`,
				}});
			})

			if (collector == undefined) {
				if (client.voiceConnections.get(msg.guild.id).channel.id && guild.queue.length === 0) client.voiceConnections.get(msg.guild.id).disconnect();
				return;
			}

			if (!collector.first() || collector.first().content.toLowerCase().startsWith(client.prefixes[msg.guild.id] + "p") || collector.first().content === "c") {
				if ((!collector.first() || collector.first().content === "c") && client.voiceConnections.get(msg.guild.id).channel.id && guild.queue.length === 0) client.voiceConnections.get(msg.guild.id).disconnect();
				return src.delete();
			};

			if (msg.channel.permissionsFor(client.user).has('MANAGE_MESSAGES')) collector.first().delete();

			res.songs = await ytutil.getPlaylist(res.items[collector.first().content - 1].id.playlistId, plQ, (options.includes('sh') | options.includes('shuffle')));
			res.songs.map(v => guild.queue.push({ id: v.id, title: v.title, req: { username: msg.author.username, discriminator: msg.author.discriminator, id: msg.author.id }, src: res.src }));

			src.edit({embed: {
				color: config.options.embedColour,
				title: `Enqueued`,
				description: `${res.items[collector.first().content - 1].snippet.title} - **Playlist**`,
				footer: {
					text: `Requested by ${msg.author.username}#${msg.author.discriminator}`
				}
			}});

		}
	};

	if (!client.queues[msg.guild.id]){

		client.queues[msg.guild.id].dj = msg.author.id;

		msg.channel.send({ embed: {
			color: config.options.embedColour,
			title: "Voice Chat DJ",
			description: `<@!${msg.author.id}> now has access to DJ commands`
		}});
	}

	guild.auto = false
	sthandle.play(guild, client);

}

exports.usage = {
	main: "{prefix}{command}{select}",
	args: "[--shuffle | -sh] [-number | -full] <YouTube Playlist Search/Playlist URL>",
	description: `Queue a YT Playlist. Use \`--shuffle\` or \`-sh\` to shuffle before queuing\n
Use \`.playlist[number]\` to pre-select a playlist, skipping the list\ne.g. \`.playlist1 <playlist>\`\n
Use \`-number\` or \`-full\` to bypass limit as DJ\ne.g.\`.playlist -30 <playlist>\``,
	adminOnly: false,
	DJ: false
};
