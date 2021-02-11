module.exports = {
    name: 'getVoiceChannels',
    description: 'get voice channels',
    execute(client) {
        return client.channels.cache.filter(current => current.type === "voice");
    },
};