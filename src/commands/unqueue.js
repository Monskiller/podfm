exports.run = function(client, msg, args, options, sel) {

	if(permissions.isBlocked(msg.member)) return msg.channel.send({ embed: {
		color: config.options.embedColour,
		title: "Denied",
		description: `Your permissions to use ${client.user.username} on this server are revoked.`
	}});

	if (client.queues[msg.guild.id].queue.length <= 1) return msg.channel.send({ embed: {
		color: config.options.embedColour,
		title: "There's nothing queued"
	}});

	if (!parseInt(args) || args <= 0|| args >= client.queues[msg.guild.id].queue.length) return msg.channel.send({ embed: {
		color: config.options.embedColour,
		title: `You need to specify a number higher than 0, and less than ${client.queues[msg.guild.id].queue.length}`
	}});

	if (client.queues[msg.guild.id].queue[Math.round(args)].req !== msg.author.id && !permissions.isAdmin(msg.member))
		return msg.channel.send({ embed: {
			color: config.options.embedColour,
			title: "You can't unqueue that"
		}});

	msg.channel.send({ embed: {
		color: config.options.embedColour,
		title: `Unqueued`,
		description: `${client.queues[msg.guild.id].queue[args].title}`
	}});

	client.queues[msg.guild.id].queue.splice(args, 1);
};

exports.usage = {
	main: "{prefix}{command}",
	args: "<index>",
	description: "Unqueues the song at the specified position",
	adminOnly: false,
	DJ: false
};
