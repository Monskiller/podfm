const ytutil           = require("../../util/youtubeHandler.js");
const scutil           = require("../../util/soundcloudHandler.js");
const sthandle         = require("../../util/streamHandler.js");

const ytrx = /(?:youtube\.com.*(?:\?|&)(?:v|list)=|youtube\\.com.*embed\/|youtube\.com.*v\/|youtu\.be\/)((?!videoseries)[a-zA-Z0-9\_\-]*)/;
//const ytrx = /(?:youtube\.com.*(?:\?|&)(?:v)=|youtube\\.com.*embed\/|youtube\.com.*v\/|youtu\.be\/)((?!videoseries)[a-zA-Z0-9\_\-]*)/;
const scrx = /((https:\/\/)|(http:\/\/)|(www.)|(s))+(soundcloud.com\/)+[a-zA-Z0-9-.]+(\/)+[a-zA-Z0-9-.]+/;

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
	guild.msgc = msg.channel.id;
	guild.vcid = client.voiceConnections.get(msg.guild.id).channel.id;

	if (guild.queue.length >= 30) return msg.channel.send({ embed: {
		color: config.options.embedColour,
		title: "Queue Limit Reached",
		description: "You've hit the queue limit. Wait for the queue to deplete before queueing more songs."
	}})

	const query = args.replace(/<|>/g, "");
	const ytrxm = query.match(ytrx);
	const scrxm = query.match(scrx);

	let res = {};

	if ((!ytrxm || !ytrxm[1]) && (!scrxm || !scrxm[1])) {

		if (!config.keys.youtube) {
			if (client.voiceConnections.get(msg.guild.id).channel.id && guild.queue.length === 0) client.voiceConnections.get(msg.guild.id).disconnect();
			return msg.channel.send({ embed: {
				color: config.options.embedColour,
				title: "No YouTube key specified",
				description: "No YouTube key was configured in 'config.json'. YouTube not available."
			}});
		};

		res.src = "youtube";
		res.type = "search";
		res.items = await ytutil.search(query, "video");

	} else {

		if (ytrxm && ytrxm[1]) {

			if (!config.keys.youtube) {
				if (client.voiceConnections.get(msg.guild.id).channel.id && guild.queue.length === 0) client.voiceConnections.get(msg.guild.id).disconnect();
				return msg.channel.send({ embed: {
					color: config.options.embedColour,
					title: "No YouTube key specified",
					description: "No YouTube key was configured in 'config.json'. YouTube not available."
				}});
			};

			res.src = "youtube";

			if (ytrxm[1].length >= 15) {
				res.type = "playlist";
				res.items = await ytutil.getPlaylist(ytrxm[1], options.includes('sh') | options.includes('shuffle') ? Infinity : "15");
				if (options.includes('sh') | options.includes('shuffle')) res.items = ytutil.shuffle(res.items);
			} else {
				res.type = "url";
				res.items = await ytutil.videoInfo(ytrxm[1]);
			}

		} else {

			if (!config.keys.soundcloud) {
				if (client.voiceConnections.get(msg.guild.id).channel.id && guild.queue.length === 0) client.voiceConnections.get(msg.guild.id).disconnect();
				return msg.channel.send({ embed: {
					color: config.options.embedColour,
					title: "No SoundCloud key specified",
					description: "No SoundCloud key was configured in 'config.json'. SoundCloud not available."
				}});
			};

			res.src = "soundcloud";
			res.type = "soundcloud";
			res.items = await scutil.getTrack(query);

		};

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
			description: `${res.items[0].title}${res.type === "playlist" ? '\n\nQueueing playlists with `.play` is deprecated and will get removed in a future update. Use `.playlist` instead' : ''}`
		}
		if (res.type === "playlist") embed.footer = {text: `...and ${res.items.slice(1).length} songs.`};

		msg.channel.send({ embed: embed });

	} else {

		if (sel) {

			guild.queue.push({ id: res.items[sel - 1].id.videoId, title: res.items[sel - 1].snippet.title, req: { username: msg.author.username, discriminator: msg.author.discriminator, id: msg.author.id }, src: "youtube" });

			msg.channel.send({ embed: {
				color: config.options.embedColour,
				title: `Enqueued`,
				description: `${res.items[sel - 1].snippet.title}`,
				footer: {
					text: `Requested by ${msg.author.username}#${msg.author.discriminator}`
				}
			}});

		} else {

			let src = await msg.channel.send({ embed: {
				color: config.options.embedColour,
				title: "Select Song",
				description: res.items.map((v, i) => `**${i + 1}.** ${v.snippet.title}`).join("\n"),
				footer: {
					text: "1 to 9 || c to cancel selection"
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
				if (client.voiceConnections.has(msg.guild.id) && guild.queue.length === 0) client.voiceConnections.get(msg.guild.id).disconnect();
				return;
			}

			if (!collector.first() || collector.first().content.toLowerCase().startsWith(client.prefixes[msg.guild.id] + "p") || collector.first().content === "c") {
				if ((!collector.first() || collector.first().content === "c") && client.voiceConnections.has(msg.guild.id) && guild.queue.length === 0) client.voiceConnections.get(msg.guild.id).disconnect();
				return src.delete();
			};

			if (msg.channel.permissionsFor(client.user).has('MANAGE_MESSAGES')) collector.first().delete();
			
			guild.queue.push({ id: res.items[collector.first().content - 1].id.videoId, title: res.items[collector.first().content - 1].snippet.title, req: { username: msg.author.username, discriminator: msg.author.discriminator, id: msg.author.id }, src: "youtube" });

			src.edit({embed: {
				color: config.options.embedColour,
				title: `Enqueued`,
				description: `${res.items[collector.first().content - 1].snippet.title}`,
				footer: {
					text: `Requested by ${msg.author.username}#${msg.author.discriminator}`
				}
			}});

		}
	};

	if (!client.queues[msg.guild.id].dj){

		client.queues[msg.guild.id].dj = msg.author.id;

		msg.channel.send({ embed: {
			color: config.options.embedColour,
			title: "Voice Chat DJ",
			description: `${msg.author.username}#${msg.author.discriminator} now has access to DJ commands`
		}});
	}

	guild.auto = false;
	if ((options.includes('ap') | options.includes('auto') | options.includes('autoplay')) && res.type != "playlist") guild.auto = true;
	
	sthandle.play(guild, client);
}

exports.usage = {
	args: "[--autoplay | -auto] <YouTube URL/Playlist/Search | Soundcloud URL>",
	main: "{prefix}{command}{select}",
	description: "Play the specified song. Use `--autoplay` or `-auto` for a continuous play from relevant YT videos\n\nUse `.play[number]` to pre-select a song, skipping the list\ne.g. `.play1 <song>`",
	adminOnly: false,
	DJ: false
};
