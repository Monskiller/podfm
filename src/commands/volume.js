const ytutil = require("../../util/youtubeHandler.js");

exports.run = async function (client, msg, args) {
	
	if ( !(permissions.isDJ(msg.member, client) || permissions.isAdmin(msg.member)) ) return msg.channel.send({ embed: {
		color: config.options.embedColour,
		title: "Access Denied",
		description: "You need the DJ role to use this command."
	}});
	
	if (!client.voiceConnections.get(msg.guild.id) || client.queues[msg.guild.id].queue.length === 0) return msg.channel.send({ embed: {
		color: config.options.embedColour,
		title: "There's no music playing"
	}});

	if (!/^\d+$/.test(args[0])) {

		let vol = client.voiceConnections.get(msg.guild.id).dispatcher.volume * 50;
		i=20,p=vol/100,f=i-i*p,x=[''];for(;i--;){x.push(i<f?'▱':'▰');}

		msg.channel.send({ embed: {
			color: config.options.embedColour,
			title: "Current volume",
			description: `${x.join('')} ${vol}%\nIf you're the DJ, specify a value to change it`
		}});

		return;
	}

	if (args[0] < 0 || args[0] > 100) return msg.channel.send({ embed: {
		color: config.options.embedColour,
		title: "Invalid volume range",
		description: "Please specify a number from 0 to 100"
	}});

	client.voiceConnections.get(msg.guild.id).dispatcher.setVolume(args[0]/50);
	client.volume[msg.guild.id] = args[0]/50;

	await ytutil.fsWriteFile(__dirname + '/../volume.json', JSON.stringify(client.volume, "", "\t"))
		.catch(log.err);
		
	i=20,p=args[0]/100,f=i-i*p,x=[''];for(;i--;){x.push(i<f?'▱':'▰');}
	msg.channel.send({ embed: {
		color: config.options.embedColour,
		title: "Volume set",
		description: `${x.join('')} ${args[0]}%`
	}});
}

exports.usage = {
	main: "{prefix}{command}",
	args: "",
	description: "Set volume on this server between 0 or 100",
	adminOnly: true,
	DJ: true
};