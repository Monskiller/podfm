const markdown = require('keepachangelog');
const pr = require("../../util/changelogParser.js");

exports.run = async function(client, msg, args, options, sel) {

    args = args.split(' ');
	let changelog = await markdown.read('CHANGELOG.md');
    
    if (options.includes('versions') | options.includes('v')) {

        let list = new Array();
        for (let v of changelog.releases) {
            list.push(v.version);
        }

        msg.channel.send({ embed: {
            color: config.options.embedColour,
            title: `${client.user.username} Versions`,
            description: list.join(', ')
        }})

    } else if (/[0-9\.]+/.test(args[0])) {

        let cl = changelog.releases.find(rel => rel.version == args[0])

        if (cl) {

            let check = cl.version.replace(/\./g, '') > config.version.replace(/\./g, '') ? ' - Unreleased' : ''

            msg.channel.send({ embed: {
                color: config.options.embedColour,
                title: `${cl.version}${check}`,
                fields: pr(cl),
				footer: {
					text: `Released on ${cl.date}`
				}
            }})
        } else {
            return msg.channel.send({ embed: {
                color: config.options.embedColour,
                title: `Specified version doesn't exist`
            }})
        }

    } else {

        let cl = changelog.releases.find(rel => rel.version == config.version)

        msg.channel.send({ embed: {
            color: config.options.embedColour,
            title: cl.version,
			fields: pr(cl),
			footer: {
				text: `Released on ${cl.date}`
			}
        }})
    }
}

exports.usage = {
	main: "{prefix}{command}",
	args: "[--versions | -v | release]",
	description: "Check pod.fm changelog. Use `--version` or `-v` to list released versions, or [release] to see changes in that specific version. e.g. `.changelog 1.5.0`"
};
