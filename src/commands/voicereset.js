exports.run = async function (client, msg, args, options, sel) {

	if (!(permissions.isDJ(msg.member, client) || permissions.isAdmin(msg.member))) return msg.channel.send({ embed: {
		color: config.options.embedColour,
		title: "Access Denied",
		description: "You need the DJ role to use this command."
	}});

	let m = await msg.channel.send({ embed: {
		color: config.options.embedColour,
		title: "Resetting voice..."
	}});

	if (client.voiceConnections.get(msg.guild.id)){

		client.voiceConnections.get(msg.guild.id).on("disconnect", () => {
			client.voiceConnections.forEach(vc => {
				if (vc.dispatcher) {
					if (!vc.dispatcher.paused) {
						setTimeout( function() {
							vc.dispatcher.pause();
							setTimeout( function() {
								vc.dispatcher.resume();
							}, 250);
						}, 100);
					}
				}
			})
		});

		client.voiceConnections.get(msg.guild.id).disconnect();
	}

	client.queues[msg.guild.id].queue = [];

	m.edit({ embed: {
		color: config.options.embedColour,
		title: "Voice Reset"
	}});

}

exports.usage = {
	main: "{prefix}{command}",
	args: "",
	description: "Resets the voiceconnection if the bot is stuck",
	adminOnly: true,
	DJ: true
};
