const moment = require('moment');

module.exports = {

    info(message){
        console.log(`\x1b[1m\x1b[36m[>] \x1b[0m${message}\n\x1b[90m> ${moment().format('YYYYMMDD HH:mm:ss')}\x1b[0m`);
    },

    warn(message){
        console.log(`\x1b[1m\x1b[33m[!] \x1b[0m${message}\n\x1b[90m> ${moment().format('YYYYMMDD HH:mm:ss')}\x1b[0m`);
    },

    err(message){
        console.log(`\x1b[1m\x1b[31m[ERROR] \x1b[0m${message}\n\x1b[90m> ${moment().format('YYYYMMDD HH:mm:ss')}\x1b[0m`);
    },

    debug(message){
        console.log(`\x1b[1m\x1b[32m[?] \x1b[0m${message}\n\x1b[90m> ${moment().format('YYYYMMDD HH:mm:ss')}\x1b[0m`);
    },

    cmd(msg, command){
        console.log(`\x1b[1m\x1b[36m[»] \x1b[0m${msg.author.username}#${msg.author.discriminator} (${msg.author.id})\n\x1b[36m> \x1b[0m${command} >> ${msg.cleanContent}\n\x1b[36m> \x1b[0m${msg.guild !== null ? `${msg.channel.guild.name} >> #${msg.channel.name}` : 'DM' }\n\x1b[90m> ${moment().format('YYYYMMDD HH:mm:ss')}\x1b[0m`);
    }
}