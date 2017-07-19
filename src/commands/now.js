const timeParser = require("../../util/timeParser.js");

exports.run = function (client, msg, args, options, sel) {

	if (client.queues[msg.guild.id].queue.length === 0)
		return msg.channel.send({ embed: {
			color: config.options.embedColour,
			title: "There's no music playing"
		}});

	let guild = client.queues[msg.guild.id];
	let track = guild.queue[0];


	i=20,p=(client.voiceConnections.get(msg.guild.id).dispatcher.time / 1000)/track.duration,f=i-i*p,x=[''];for(;i--;){x.push(i<f?'▱':'▰');}
	let embed = {
		color       : config.options.embedColour,
		title       : track.title,
		url         : track.src !== "soundcloud" ? `https://youtu.be/${track.id}` : undefined,
		description : `${timeParser.formatSeconds(client.voiceConnections.get(msg.guild.id).dispatcher.time / 1000)}${track.src === "youtube" ? "/" + timeParser.formatSeconds(track.duration) : ""} ${guild.repeat == 'None' ? '' : guild.repeat == 'All' ? '⟳ᴬ' : '⟳¹'} ${guild.auto ? '↯' : ''}\n${x.join('')}`,
		footer: {
			text: `Requested by ${guild.queue[0].req ? `${guild.queue[0].req.username}#${guild.queue[0].req.discriminator}` : "Unknown"}`
		}
	};

	msg.channel.send({ embed: embed });

}

exports.usage = {
	main: "{prefix}{command}",
	args: "",
	description: "Shows info about the currently playing song",
	adminOnly: false,
	DJ: false
};
