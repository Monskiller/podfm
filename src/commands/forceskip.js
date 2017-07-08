exports.run = function (client, msg, args) {

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

}

exports.usage = {
	main: "{prefix}{command}",
	args: "",
	description: "Skips the current song by force (no voting)",
	adminOnly: true,
	DJ: true
};
