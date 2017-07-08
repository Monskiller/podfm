exports.run = async function(client, msg, args) {

	if (!permissions.isAdmin(msg.member)) return msg.channel.send({ embed: {
		color: config.options.embedColour,
		title: "Access Denied",
		description: "You need the DJ role to use this command."
	}});

	if (msg.channel.permissionsFor(client.user).has('MANAGE_MESSAGES')) msg.delete();

	let messagecount = parseInt(args[0]) ? parseInt(args[0]) : 1;

	let msgs = await msg.channel.fetchMessages({limit: messagecount});
	msgs = msgs.filter(m => m.author.id === client.user.id)

	if (msg.channel.permissionsFor(client.user).has('MANAGE_MESSAGES'))
		msg.channel.bulkDelete(msgs);
}

exports.usage = {
	main: "{prefix}{command}",
	args: "<1-100>",
	description: "Removes the specified amount of messages sent by pod.fm",
	adminOnly: true,
	DJ: false
};
