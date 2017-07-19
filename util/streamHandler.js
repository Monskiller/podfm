const ytutil = require("../util/youtubeHandler.js");
const ytdl   = require("ytdl-core");
const buffer = require("buffered2").BufferedStream;

exports.play = async function play(guild, client) {

	if (!client.guilds.has(guild.id) ||	!client.voiceConnections.has(guild.id) || !client.voiceConnections.get(guild.id).channel.id || client.voiceConnections.get(guild.id).dispatcher) return;

	if (guild.queue.length === 0) {
		if (client.voiceConnections.get(guild.id) && client.voiceConnections.get(guild.id).channel.id) client.voiceConnections.get(guild.id).disconnect(); 
		guild.dj = "";
		
		return client.channels.get(guild.msgc).send({ embed: {
			color: config.options.embedColour,
			title: "Playback finished",
			description: `Use ${client.prefixes[guild.id]}play or ${client.prefixes[guild.id]}p to queue some music`,
		}});

	}

	let song;

	if (guild.queue[0].src === "youtube") {
		guild.queue[0].duration = await ytutil.getDuration(guild.queue[0].id);

		let res = await ytutil.getFormats(guild.queue[0].id);
		if (!res.url) {
			guild.queue.shift();
			client.channels.get(guild.msgc).send({ embed: {
				color: config.options.embedColour,
				title: "This song is unplayable"
			}});
			return exports.play(guild, client);
		} else {
			song = new buffer();
			ytdl(guild.queue[0].id, { filter: "audioonly" }).pipe(song);
		}
	} else {
		song = guild.queue[0].id
	}

	client.channels.get(guild.msgc).send({embed: {
		color: config.options.embedColour,
		title: "Now Playing",
		description: `${guild.queue[0].title} [Link](https://youtu.be/${guild.queue[0].id})`, //(https://youtu.be/${guild.queue[0].id})`
		footer: {
			text: `Requested by ${client.users.get(guild.queue[0].req) ? `${client.users.get(guild.queue[0].req).username}#${client.users.get(guild.queue[0].req).discriminator}` : "Unknown"}`
		}
	}});

	client.voiceConnections.get(guild.id).playStream(song);
	setTimeout( function() {
		if (client.voiceConnections.get(guild.id).dispatcher && client.volume[guild.id]) client.voiceConnections.get(guild.id).dispatcher.setVolume(client.volume[guild.id]);
	}, 500);

	if (!client.voiceConnections.get(guild.id).dispatcher) return client.voiceConnections.get(guild.id).disconnect();
	
	client.voiceConnections.get(guild.id).dispatcher.on("end", () => {
		if (guild.repeat === "All") guild.queue.push(guild.queue[0]);
		if (guild.repeat !== "Current") guild.queue.shift();
		guild.svotes = [];
		setTimeout( function() {
			exports.play(guild, client);
		}, 1000);
	});

	client.voiceConnections.get(guild.id).on("disconnect", () => {
		client.voiceConnections.forEach(vc => {
			if (vc.dispatcher) {
				if (!vc.dispatcher.paused) {
					setTimeout( function() {
						vc.dispatcher.pause();
						setTimeout( function() {
							vc.dispatcher.resume();
						}, 250);
					}, 100);
				}
			}
		})
	})
};
