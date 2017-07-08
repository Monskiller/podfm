const timeParser = require("../../util/timeParser.js");

exports.run = function (client, msg, args) {

	if (client.queues[msg.guild.id].queue.length <= 1)
		return msg.channel.send({ embed: {
			color: config.options.embedColour,
			title: "There's nothing queued"
		}});


	let guild = client.queues[msg.guild.id];

	let page = parseInt(args[0]) ? parseInt(args[0]) : 1;
	let maxPage = Math.ceil(guild.queue.slice(1).length / 10);

	if (page < 1)       page = 1;
	if (page > maxPage) page = maxPage;

	let startQueue = ((page - 1) * 10) + 1;
	let endQueue   = startQueue + 10 > guild.queue.length ? guild.queue.length : startQueue + 10;

	let track = guild.queue[0];
	i=20,p=(client.voiceConnections.get(msg.guild.id).dispatcher.time / 1000)/track.duration,f=i-i*p,x=[''];for(;i--;){x.push(i<f?'▱':'▰');}

	let embed = {
		color       : config.options.embedColour,
		title       : track.title,
		url         : track.src !== "soundcloud" ? `https://youtu.be/${track.id}` : undefined,
		description : `${timeParser.formatSeconds(client.voiceConnections.get(msg.guild.id).dispatcher.time / 1000)}${track.src === "youtube" ? "/" + timeParser.formatSeconds(track.duration) : ""}\n${x.join('')}`,
		fields: [
			{
				name: "Queue",
				value: guild.queue.slice(startQueue, endQueue).map((item, i) => `${startQueue + i}. ${item.title} - ${client.users.get(item.req) ? `**${client.users.get(guild.queue[startQueue + i].req).username}#${client.users.get(guild.queue[startQueue + i].req).discriminator}**` : "**Unknown**"}`).join("\n")
			}
		],
		footer: {
			text: `Page ${page}/${maxPage}`
		}
	};

	msg.channel.send({ embed: embed }).catch(e => {});

}

exports.usage = {
	main: "{prefix}{command}",
	args: "[page number]",
	description: "View the specified queue page",
	adminOnly: false,
	DJ: false
};