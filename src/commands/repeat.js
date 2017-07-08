exports.run = function (client, msg, args) {

	if (!(permissions.isDJ(msg.member, client) || permissions.isAdmin(msg.member)))
		return msg.channel.send({ embed: {
			color: config.options.embedColour,
			title: "Access Denied",
			description: "You need the DJ role to use this command."
		}});

	if (!args[0])
		return msg.channel.send({ embed: {
			color: config.options.embedColour,
			title: `Repeat mode: ${client.queues[msg.guild.id].repeat}`,
			description: `${client.prefixes[msg.guild.id]}repeat < a | c | n >\n\n[All, Current, None]`
		}});

	if (!(args[0] === "a" || args[0] === "c" || args[0] === "n"))
		return msg.channel.send({ embed: {
			color: config.options.embedColour,
			title: `Repeat mode can only be set to 'a', 'c' or 'n'`,
			description: `[All, Current, None]`
		}});

	if 		(args[0] === "a")  client.queues[msg.guild.id].repeat = "All";
	else if (args[0] === "c")  client.queues[msg.guild.id].repeat = "Current";
	else if	(args[0] === "n")  client.queues[msg.guild.id].repeat = "None";

	msg.channel.send({ embed: {
		color: config.options.embedColour,
		title: "Repeat Toggled",
		description: `Repeating ${client.queues[msg.guild.id].repeat}`
	}});

}

exports.usage = {
	main: "{prefix}{command}",
	args: "",
	description: "Toggles the repeat mode (All -> Current -> None)",
	adminOnly: true,
	DJ: true
};
