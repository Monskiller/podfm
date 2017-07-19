const timeParser = require("../../util/timeParser.js")

exports.run = async function(client, msg, args, options, sel) {
	if(permissions.isBlocked(msg.member)) return msg.channel.send({ embed: {
		color: config.options.embedColour,
		title: "Denied",
		description: `Your permissions to use ${client.user.username} on this server are revoked.`
	}});

	let data = await client.fetchUser('174573919544672258');
	msg.channel.send({embed: {
		color: config.options.embedColour,
		description: 'Developer',
		author: {
		  name: `${data.username}#${data.discriminator}`,
		  icon_url: data.avatarURL,
		},
		fields: [
			{ name: `Uptime`,		  value: timeParser.formatSeconds(process.uptime()),						inline: true },
			{ name: `RAM Usage`,	  value: `${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB`,      inline: true },
			{ name: `Node.js`,		  value: process.version,													inline: true },
			{ name: `Streams`,        value: `► ${client.voiceConnections.array().filter(vc => vc.speaking).length}, ❚❚ ${client.voiceConnections.array().filter(vc => !vc.speaking).length}`, inline: true },
			{ name: `Servers`,		  value: client.guilds.size,												inline: true },
			{ name: "Latency",		  value: `${Math.floor(client.ping)}ms`,									inline: true },
			{ name: "Version",		  value: config.version,													inline: true }
		]
	}});

}

exports.usage = {
	main: "{prefix}{command}",
	args: "",
	description: "View statistics of the bot",
	adminOnly: false,
	DJ: false
};