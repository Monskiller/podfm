exports.run = function (client, msg, args, options, sel) {

	if (!client.voiceConnections.get(msg.guild.id) || !client.queues[msg.guild.id].queue[0]) return msg.channel.send({ embed: {
		color: config.options.embedColour,
		title: "There's no music playing"
	}});

	if (!(permissions.isDJ(msg.member, client) || permissions.isAdmin(msg.member)) && client.queues[msg.guild.id].queue[0].req !== msg.author.id) return msg.channel.send({ embed: {
		color: config.options.embedColour,
		title: "Access Denied",
		description: "You need the DJ role to use this command."
	}});

	client.voiceConnections.get(msg.guild.id).dispatcher.end();
	let skip = /^\d+$/.test(args) ? args : sel;
	if (skip) {
		client.queues[msg.guild.id].queue.splice(0, skip-1)
		msg.channel.send({ embed: {
			color: config.options.embedColour,
			title: `Skipped ${skip} songs`
		}})
	}

}

exports.usage = {
	main: "{prefix}{command}",
	args: "[number]",
	description: "Skips the current song by force (no voting)\nCan also skip multiple songs by adding [number]. e.g. `.forceskip 5`",
	adminOnly: true,
	DJ: true
};
