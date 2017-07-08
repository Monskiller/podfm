exports.run = function (client, msg, args) {

	if (msg.author.id !== "174573919544672258" && msg.author.id !==  "140986021100650497") return false;

	let rx = /((?:\d*)d(?:\d+))/gi;
	let rx2 = /^(?:(\d*)d(\d+))/i
	let r = rx.test(args.join(' ')) ? args.join(' ').match(rx) : ['d6'];
	let result = new Array();
	let sum;

	r.forEach(d => {
		let data = d.match(rx2);
		let rolls = (/\d+/).test(data[1]) ? data[1] : 1;

		for (i = 0;i < rolls;i++){
			let res = Math.ceil(Math.random() * data[2]);
			result.push(res);
		}

	});
	sum = result.reduce((a, b) => a + b, 0);

	msg.channel.send({ embed: {
		color: config.options.embedColour,
		title: "Dice Roll",
		description: `Your rolls: ${result.join(', ')}.\nTotal sum: ${sum}.`
	}})

}

exports.usage = {
	main: "{prefix}{command}",
	args: "[dices]",
	description: "Rolls x ammount of times a dice with x ammount of sides. Ex: 1d6"
};