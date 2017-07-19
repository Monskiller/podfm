exports.run = function (client, msg, args, options, sel) {

	if (!(permissions.isDJ(msg.member, client) || permissions.isAdmin(msg.member)))
		return msg.channel.send({ embed: {
			color: config.options.embedColour,
			title: "Access Denied",
			description: "You need the DJ role to use this command."
		}});

	if (!client.voiceConnections.get(msg.guild.id))
		return msg.channel.send({ embed: {
			color: config.options.embedColour,
			title: "There's no music playing"
		}});

	if (client.queues[msg.guild.id].queue.length < 3)
		return msg.channel.send({ embed: {
			color: config.options.embedColour,
			title: "There's not enough songs in the queue to shuffle",
		}});

	let tempqueue = client.queues[msg.guild.id].queue.slice(1);
	let curInd = tempqueue.length, tempVal, randInd;

	while (curInd !== 0) {

		randInd = Math.floor(Math.random() * curInd);
		curInd --;
		tempVal = tempqueue[curInd];
		tempqueue[curInd] = tempqueue[randInd];
		tempqueue[randInd] = tempVal;

	};

	tempqueue.splice(0, 0, client.queues[msg.guild.id].queue[0])
	client.queues[msg.guild.id].queue = tempqueue;
	client.queues[msg.guild.id].auto = false;

	msg.channel.send({ embed: {
		color: config.options.embedColour,
		title: "Queue Shuffled"
	}});

}

exports.usage = {
	main: "{prefix}{command}",
	args: "",
	description: "Randomizes the queue",
	adminOnly: true,
	DJ: true
};
