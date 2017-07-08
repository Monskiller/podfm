const owners = config.prop.owners;

module.exports = {

	hasRole(member, rolename) {
		if (!member.guild) return false;
		let role = member.guild.roles.find(r => r.name === rolename);
		return (role && member.roles.has(role.id));
	},

	isAdmin(member) {
		return (owners.includes(member.id) || member.guild.ownerID === member.id || member.permissions.has('ADMINISTRATOR') || module.exports.hasRole(member, "Mod"));
	},

	isDJ(member, client) {
		return (module.exports.hasRole(member, "DJ") || client.queues[member.guild.id].dj == member.id);
	},

	isBlocked(member) {
		let hdb = require(`../src/config.json`).prop.blocked;
		delete require.cache[require.resolve(`../src/config.json`)];

		return ((module.exports.hasRole(member, "NoMusicPerms") || hdb.includes(member.id)) && !owners.includes(member.id) && member.guild.ownerID !== member.id);
	}

}
