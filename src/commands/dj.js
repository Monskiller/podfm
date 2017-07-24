exports.run = async function(client, msg, args, options, sel) {

	if(permissions.isBlocked(msg.member)) return msg.channel.send({ embed: {
		color: config.options.embedColour,
		title: "Denied",
		description: `Your permissions to use ${client.user.username} on this server are revoked.`
	}});

	if (!client.voiceConnections.get(msg.guild.id) || client.queues[msg.guild.id].queue.length === 0) return msg.channel.send({ embed: {
		color: config.options.embedColour,
		title: "There's no music playing"
	}});

    let dj = client.queues[msg.guild.id].dj;
    
    if (dj == msg.author.id || permissions.isDJ(msg.member, client) || permissions.isAdmin(msg.member)) {

        let mention = msg.mentions.members.filter(u => !(permissions.isAdmin(u) || permissions.isDJ(u, client) || u.user.bot || permissions.isBlocked(u)))
        if (mention.first()) client.queues[msg.guild.id].dj = mention.first().id;
        dj = client.queues[msg.guild.id].dj;

        msg.channel.send({ embed: {
            color: config.options.embedColour,
            title: "Current Voice Chat DJ",
            description: `${client.users.get(dj) ? `${client.users.get(dj).username}#${client.users.get(dj).discriminator}` : 'Unknown'}`
        }});

    } else {

        msg.channel.send({ embed: {
            color: config.options.embedColour,
            title: "Current Voice Chat DJ",
            description: `${client.users.get(dj) ? `${client.users.get(dj).username}#${client.users.get(dj).discriminator}` : 'Unknown'}`
        }});
    }
}

exports.usage = {
	main: "{prefix}{command}",
	args: "[Mention]",
	description: "Check current DJ or assign a new one if DJ",
	adminOnly: false,
	DJ: false
};
