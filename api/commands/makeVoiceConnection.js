/** make a voice connection */
module.exports = {
    name: 'makeVoiceConnection',
    description: 'make a voice connection',
    execute(client, req, voiceConnectionMap){
        return makeVoiceConnection(client, req, voiceConnectionMap);
    }
}

async function makeVoiceConnection(client, req, voiceConnectionMap){
    try{
        channel = await client.channels.fetch(req.body.channelId);
        const connection = await channel.join();
        voiceConnectionMap.set(req.body.channelId, connection);
        return false;
    } catch (err) {
        console.log(`inside catch block: ${err}`);
        return err;
    }
}