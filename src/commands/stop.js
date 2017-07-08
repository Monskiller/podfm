exports.run = function (client, msg, args) {

	if (!(permissions.isDJ(msg.member, client) || permissions.isAdmin(msg.member))) return msg.channel.send({ embed: {
		color: config.options.embedColour,
		title: "Access Denied",
		description: "You need the DJ role to use this command."
	}});

	if (!client.voiceConnections.get(msg.guild.id)) return msg.channel.send({ embed: {
		color: config.options.embedColour,
		title: "There's no music playing"
	}});

	client.queues[msg.guild.id].repeat = "None";
	client.queues[msg.guild.id].queue.splice(1, client.queues[msg.channel.guild.id].queue.length);
	client.voiceConnections.get(msg.guild.id).dispatcher.end();

}

exports.usage = {
	main: "{prefix}{command}",
	args: "",
	description: "Clears the queue and halts playback",
	adminOnly: true,
	DJ: true
};
