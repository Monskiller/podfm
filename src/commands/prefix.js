const ytutil = require("../../util/youtubeHandler.js");

exports.run = async function (client, msg, args) {

	if (!permissions.isAdmin(msg.member))
		return msg.channel.send({ embed: {
			color: config.options.embedColour,
			title: "Access Denied",
			description: "You need the DJ role to use this command."
		}});

	if (!args[0])
		return msg.channel.send({ embed: {
			color: config.options.embedColour,
			title: "Invalid character"
		}});

	if (args[0].length > 3)
		return msg.channel.send({ embed: {
			color: config.options.embedColour,
			title: "The new prefix cannot exceed 3 characters",
		}});

	client.prefixes[msg.guild.id] = args[0];
	await ytutil.fsWriteFile(__dirname + '/../prefixes.json', JSON.stringify(client.prefixes, "", "\t"))
		.catch(log.err)

	msg.channel.send({ embed: {
		color: config.options.embedColour,
		title: `Prefix updated`,
		description: `Use \`${args[0]}\` as prefix for commands in this server`
	}})

}

exports.usage = {
	main: "{prefix}{command}",
	args: "<prefix>",
	description: "Sets the prefix for this server",
	adminOnly: true,
	DJ: false
};
