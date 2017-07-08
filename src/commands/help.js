const fs = require("fs");

exports.run = async function (client, msg, args) {

	if (!args[0]) {

		let commands = await fs.readdirSync(__dirname);
		let cmdList = new Array();
		let adminCmds = new Array();
		let djCmds = new Array();
		commands.forEach(c => {
			let cmd = require(`./${c}`).usage;
			delete require.cache[require.resolve(`./${c}`)];
			if (permissions.isAdmin(msg.member) && cmd.adminOnly && !cmd.DJ){
				adminCmds.push(`**${c.substring(0, c.length - 3)}**: ${cmd.description}`);
			}
			if ((permissions.isDJ(msg.member, client) || permissions.isAdmin(msg.member)) && cmd.DJ){
				djCmds.push(`**${c.substring(0, c.length - 3)}**: ${cmd.description}`);
			}
			if (!cmd.adminOnly && !cmd.DJ && cmd.adminOnly !== undefined){
				cmdList.push(`**${c.substring(0, c.length - 3)}**: ${cmd.description}`);
			}
		})

		let aliases  = require(`../aliases.json`);
		delete require.cache[require.resolve(`../aliases.json`)];
		aliases = Object.keys(aliases).map(a => `${a}${pad(10, a)}${aliases[a]}`).join("\n")
		//let cmds = `${cmdList.join('\n')}${adminCmds.length == 0 ? "" : `\n\n**__Admin Commands:__**\n${adminCmds.join('\n')}`}`
		let fields = [
			{ name: "Aliases", value: `\`\`\`\n${aliases}\n\`\`\``, inline: true },
			{ name: "Support", value: `**Getting Started**\n1. Join a voicechannel\n2. ${client.prefixes[msg.channel.guild.id]}play <YouTube URL/Query | Soundcloud URL>\n3. If prompted, select a song (1-9)\n\n` },
			{ name: "Use/Create the following roles", value: `**NoMusicPerms**: Revokes permission to use this bot.\n**DJ**: Allows the use of admin commands.` }
		]
		adminCmds.length > 0 && fields.unshift({ name: "Admin Commands", value: `${adminCmds.join('\n')}`})
		djCmds.length > 0 && fields.unshift({ name: "DJ Commands", value: `${djCmds.join('\n')}`})

		let dmc = await msg.author.createDM()
		.catch(err => {
			return undefined
		});
		dmc.send({ embed: {
			color: config.options.embedColour,
			title: "Commands",
			description: cmdList.join('\n'), //commands.map(c => c.replace(".js", "")).sort().join(", ")
			fields: fields,
			footer: {
				text: `View command info with ${client.prefixes[msg.channel.guild.id]}help <command>`
			}
		}});

	} else {

		try {
			let cmd = require(`./${args[0]}.js`).usage;
			delete require.cache[require.resolve(`./${args[0]}.js`)];
			msg.channel.createMessage({ embed: {
				color: config.options.embedColour,
				title: `${cmd.main.replace("{command}", args[0].toLowerCase()).replace("{prefix}", prefixes[msg.channel.guild.id])} ${cmd.args}`,
				description: cmd.description
			}});
		} catch (err) {
			msg.channel.createMessage({ embed: {
				color: config.options.embedColour,
				title: "Invalid command",
				description: "Did you type the command correctly?"
			}});
		}

	}
	//msg.addReaction('\uD83C\uDFB6');

}

function pad(ln, str) {
	return Array(ln - str.length).join(" ")
}

exports.usage = {
	main: "{prefix}{command}",
	args: "[command]",
	description: "Shows commands and aliases.",
	adminOnly: false,
	DJ: false
};
