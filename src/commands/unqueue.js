exports.run = function(client, msg, args) {

	if(permissions.isBlocked(msg.member)) return msg.channel.send({ embed: {
		color: config.options.embedColour,
		title: "Denied",
		description: `Your permissions to use ${client.user.username} on this server are revoked.`
	}});

	if (client.queues[msg.guild.id].queue.length <= 1) return msg.channel.send({ embed: {
		color: config.options.embedColour,
		title: "There's nothing queued"
	}});

	if (!parseInt(args[0]) || args[0] <= 0|| args[0] >= client.queues[msg.guild.id].queue.length) return msg.channel.send({ embed: {
		color: config.options.embedColour,
		title: `You need to specify a number higher than 0, and less than ${client.queues[msg.guild.id].queue.length}`
	}});

	if (client.queues[msg.guild.id].queue[Math.round(args[0])].req !== msg.author.id && !permissions.isAdmin(msg.member))
		return msg.channel.send({ embed: {
			color: config.options.embedColour,
			title: "You can't unqueue that"
		}});

	msg.channel.send({ embed: {
		color: config.options.embedColour,
		title: `Unqueued`,
		description: `${client.queues[msg.guild.id].queue[args[0]].title}`
	}});

	client.queues[msg.guild.id].queue.splice(args[0], 1);
};

exports.usage = {
	main: "{prefix}{command}",
	args: "<index>",
	description: "Unqueues the song at the specified position",
	adminOnly: false,
	DJ: false
};
