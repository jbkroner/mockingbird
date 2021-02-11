module.exports = {
    name: 'closeVoiceConnection',
    description: 'close a voice connection',
    execute(req, connection, voiceConnectionMap) {
        connection.disconnect();
        voiceConnectionMap.delete(req.body.channelId);
        return;
    },
};