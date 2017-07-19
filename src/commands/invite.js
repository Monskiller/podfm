exports.run = function (client, msg, args, options, sel) {

	msg.channel.send({ embed: {
		color: config.options.embedColour,
		fields: [
			{ name: "Add me to your server!",  value: "[Click Here](https://discordapp.com/oauth2/authorize?client_id=296043723899273218&permissions=36727873&scope=bot)",      inline: true }
		]
	}});

}

exports.usage = {
	main: "{prefix}{command}",
	args: "",
	description: "Shows bot invite link",
	adminOnly: false,
	DJ: false
};
