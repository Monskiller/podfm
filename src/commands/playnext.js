exports.run = function (client, msg, args, options, sel) {

	if (!(permissions.isDJ(msg.member, client) || permissions.isAdmin(msg.member)))
		return msg.channel.send({ embed: {
			color: config.options.embedColour,
			title: "Access Denied",
			description: "You need the DJ role to use this command."
        }});

    if (!client.voiceConnections.get(msg.guild.id) || client.queues[msg.guild.id].queue.length === 0) 
        return msg.channel.send({ embed: {
            color: config.options.embedColour,
            title: "There's no music playing"
	    }});
        
    if (!args && !sel)
		return msg.channel.send({ embed: {
			color: config.options.embedColour,
			title: `Please specify which song to play next`
        }});

        let queue = client.queues[msg.guild.id].queue;

    if ((sel >= queue.length || sel < 2) || !/^\d+$/.test(args) || (args >= queue.length || args < 2))
        return msg.channel.send({ embed: {
			color: config.options.embedColour,
            title: `Error`,
            description: `Please specify a value from 2 to ${queue.length-1}`
        }});

    let move = /^\d+$/.test(args) ? args : sel;

    msg.channel.send({ embed: {
		color: config.options.embedColour,
        title: `Song moved up the queue`,
        description: `${queue.move(move).title}`
    }});

}

Array.prototype.move = function (index){
    let item = this[index];

    this.splice(index, 1);
    this.splice(1, 0, item);

    return item;
}

exports.usage = {
	main: "{prefix}{command}",
	args: "[number]",
	description: "Moves a song up the queue to play next",
	adminOnly: false,
	DJ: true
};
