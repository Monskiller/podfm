exports.run = function (client, msg, args, options, sel) {

	if(permissions.isBlocked(msg.member)) return msg.channel.send({ embed: {
		color: config.options.embedColour,
		title: "Denied",
		description: `Your permissions to use ${client.user.username} on this server are revoked.`
	}});

	if (!client.voiceConnections.get(msg.guild.id) || !client.voiceConnections.get(msg.guild.id).channel.id) return msg.channel.send({ embed: {
		color: config.options.embedColour,
		title: "There's no music playing"
	}});

	if (msg.member.voiceChannelID !== client.voiceConnections.get(msg.guild.id).channel.id)
		return msg.channel.send({ embed: {
			color: config.options.embedColour,
			title: "You need to be in my voicechannel to skip"
		}});

	if (client.queues[msg.guild.id].svotes.includes(msg.author.id))
		return msg.channel.send({ embed: {
			color: config.options.embedColour,
			title: "You've already voted"
		}});

	client.queues[msg.guild.id].svotes.push(msg.author.id);

	let voiceMembers = Math.round(msg.guild.channels.get(msg.member.voiceChannelID).members.filter(m => !m.user.bot).array().length / 2);
	let guild = client.queues[msg.guild.id];
	
	if (client.queues[msg.guild.id].svotes.length >= voiceMembers || guild.queue[0].req === msg.author.id)
		return client.voiceConnections.get(msg.guild.id).dispatcher.end();

	msg.channel.send({ embed: {
		color: config.options.embedColour,
		title: "Voted to skip",
		description: `${client.queues[msg.guild.id].svotes.length}/${voiceMembers} vote(s) needed.`
	}});
}

exports.usage = {
	main: "{prefix}{command}",
	args: "",
	description: "Vote skip the currently playing song",
	adminOnly: false,
	DJ: false
};
