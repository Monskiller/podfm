exports.run = function (client, msg, args) {

	if(permissions.isBlocked(msg.member)) return msg.channel.send({ embed: {
		color: config.options.embedColour,
		title: "Denied",
		description: `Your permissions to use ${client.user.username} on this server are revoked.`
	}});

	if (!client.voiceConnections.get(msg.guild.id) || client.queues[msg.guild.id].queue.length === 0) return msg.channel.send({ embed: {
		color: config.options.embedColour,
		title: "There's no music playing"
	}});

	client.voiceConnections.get(msg.guild.id).dispatcher.resume();

}

exports.usage = {
	main: "{prefix}{command}",
	args: "",
	description: "Resume playback of the current song if it was paused",
	adminOnly: false,
	DJ: false
};
