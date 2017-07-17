exports.run = function (client, msg, args) {

	if (!permissions.isAdmin(msg.member)) return msg.channel.send({ embed: {
		color: config.options.embedColour,
		title: "Access Denied",
		description: "You need the DJ role to use this command."
	}});

	if (!msg.member.voiceChannelID) return msg.channel.send({ embed: {
		color: config.options.embedColour,
		title: "You need to be in a voicechannel"
	}});
	
	/*
	if (client.voiceConnections.find(vc => vc.id = msg.member.voiceChannelID)) return msg.channel.send({ embed: {
		color: config.options.embedColour,
		title: "I'm already in this voice channel"
	}});
	*/
	if (!msg.guild.channels.get(msg.member.voiceChannelID).permissionsFor(client.user).has("CONNECT") ||
		!msg.guild.channels.get(msg.member.voiceChannelID).speakable)
		return msg.channel.send({ embed: {
			color: config.options.embedColour,
			title: "Unable to Connect",
			description: "This channel doesn't allow me to connect/speak."
		}});

	msg.member.voiceChannel.join();

}

exports.usage = {
	main: "{prefix}{command}",
	args: "",
	description: "Moves the bot to the sender's voicechannel",
	adminOnly: true,
	DJ: false
};
