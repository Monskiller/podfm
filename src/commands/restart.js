const fs = require("fs");

exports.run = function(client, msg, args) {
	if (msg.author.id !== "174573919544672258") return false;
	fs.writeFile("./prefixes.json", JSON.stringify(client.prefixes, "", "\t"), (err) => {
		if (err) console.log("Failed to update prefixes.");

		msg.channel.send(":gear: Now restarting...").then(() => {
			process.exit();
		})
	});
}

exports.usage = {
	main: "{prefix}{command}",
	args: "",
	description: "Developer command"
}
