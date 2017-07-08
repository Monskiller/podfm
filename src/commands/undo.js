exports.run = async function(client, msg, args) {

	if(permissions.isBlocked(msg.member)) return msg.channel.send({ embed: {
		color: config.options.embedColour,
		title: "Denied",
		description: `Your permissions to use ${client.user.username} on this server are revoked.`
	}});

	if (client.queues[msg.guild.id].queue.length <= 1) return msg.channel.send({ embed: {
		color: config.options.embedColour,
		title: "There's nothing queued"
	}});
	console.log(args[0])
	if (!parseInt(args[0]) && args[0] !== undefined || args[0] === 0) return msg.channel.send({ embed: {
		color: config.options.embedColour,
		title: "You need to specify a number between 1 and 100"
	}});

	let queue = client.queues[msg.guild.id].queue.slice(1);

	let remove = parseInt(args[0]) ? parseInt(args[0]) : 1
	let removed = 0;
	let qi = queue.length - 1;

	let m = await msg.channel.send({ embed: {
		color: config.options.embedColour,
		title: `Removing up to ${remove} songs queued by you...`
	}});

	for (let i = qi; i > -1; i--) {
		if (removed === remove) break;

		if (queue[i].req === msg.author.id) {
			queue.splice(i, 1)
			removed++;
		}
	}

	queue.splice(0, 0, client.queues[msg.guild.id].queue[0])
	client.queues[msg.guild.id].queue = queue;

	m.edit({ embed: {
		color: config.options.embedColour,
		title: `${removed} songs unqueued`
	}});
}

exports.usage = {
	main: "{prefix}{command}",
	args: "[1-100]",
	description: "Removes the last `x` songs from the queue",
	adminOnly: false,
	DJ: false
};
