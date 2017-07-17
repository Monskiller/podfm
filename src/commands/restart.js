exports.run = async function(client, msg, args) {

	if (msg.author.id !== "174573919544672258") return false;

	await msg.channel.send(":gear: Now restarting...")
		.catch(log.err)

	process.exit();
}

exports.usage = {
	main: "{prefix}{command}",
	args: "",
	description: "Developer command"
}
