module.exports = {
    name: 'getChannels',
    description: 'get all channels',
    execute(client) {
        return(client.channels);
    },
};