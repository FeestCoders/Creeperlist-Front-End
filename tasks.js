const Server = require('./schemas/server');
const pinger = require('minecraft-pinger')

setInterval(function () {
    Server.find({}, function (err, servers) {
        if (err) return;

        servers.forEach(function (server) {
            pinger.ping(server.ip, server.port, (error, result) => {
                Server.update({_id: server._id}, {
                    $set: {lastcheck: new Date()}, $inc: {times: 1}
                }, function (err) {
                    if (err) console.error(err);
                });
                if (error) return;
                Server.update({_id: server._id}, {
                    $set: {
                        players: result.players.online,
                        max: result.players.max,
                        ping: result.ping,
                        icon: result.favicon,
                        motd: result.description.text || JSON.stringify(result.description.extra),
                        version: result.version.name.replace(/§[0-9a-fA-F]/g, "")
                    }, $inc: {success: 1}
                }, function (err) {
                    if (err) console.error(err);
                });
            })
        });
    });
}, 30000);