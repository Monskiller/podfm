exports.run = function (client, msg, args) {

	if (!(permissions.isDJ(msg.member, client) || permissions.isAdmin(msg.member))) return msg.channel.send({ embed: {
		color: config.options.embedColour,
		title: "Access Denied",
		description: "You need the DJ role to use this command."
	}});

	if (!client.voiceConnections.get(msg.guild.id) || client.queues[msg.guild.id].queue.length === 0) return msg.channel.send({ embed: {
		color: config.options.embedColour,
		title: "There's no music playing"
	}});

	client.voiceConnections.get(msg.guild.id).dispatcher.pause();

}

exports.usage = {
	main: "{prefix}{command}",
	args: "",
	description: "Pause playback",
	adminOnly: true,
	DJ: true
};
