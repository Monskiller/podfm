const fs = require("fs");

exports.run = async function (client, msg, args, options, sel) {

	if (client.queues[msg.guild.id].queue.length === 0)
		return msg.channel.send({ embed: {
			color: config.options.embedColour,
			title: "There's nothing queued"
		}});

	let dmc = await msg.author.createDM()
	.catch(err => {
		return undefined
	});

	if (!dmc) return msg.channel.send({ embed: {
		color: config.options.embedColour,
		title: "There was an error fetching a DM channel"
	}});

	if (options && options.includes('q')) {
		let m = await msg.channel.send({ embed: {
			color: config.options.embedColour,
			title: "Compiling queue..."
		}});

		let queue = client.queues[msg.guild.id].queue.map(s => `${s.title} (${s.src === "youtube" ? `https://youtu.be/${s.id}` : s.durl})`).join("\r\n");

		dmc.send({ files: [{
				name: "queue.txt",
				attachment: Buffer.from(queue, "utf8")
			}]
		})
		.then(() => {
			m.edit({ embed: {
				color: config.options.embedColour,
				title: "You have been DM'd the queue"
			}})
		})
		.catch(err => {
			m.edit({ embed: {
				color: config.options.embedColour,
				title: err.message
			}})
		});
	} else {
		let song = client.queues[msg.guild.id].queue[0];

		dmc.send({ embed: {
			color: config.options.embedColour,
			title: song.title,
			url  : song.src === "youtube" ? `https://youtu.be/${song.id}` : song.durl
		}});
	}
}

exports.usage = {
	main: "{prefix}{command}",
	args: "[-q]",
	description: "DMs you info about the currently playing song. Use `-q` to get the queue",
	adminOnly: false,
	DJ: false
};
