module.exports = {
    name: 'playSample',
    description: 'play a sample',
    execute(client, req, voiceConnectionMap, fs) {
        connection = voiceConnectionMap.get(req.body.channelId);
        sample = req.body.sampleName;
        try{
            if (fs.existsSync(sample)){
                // create a dispatcher 
                const dispatcher = connection.play(req.body.sampleName, { volume: .5});
                dispatcher.on('start', () => {
                    console.log(`Now playing sample: ${req.body.sampleName}`);
                });
            }
        } catch(err) {
            // handle this, send back to server?
            console.log(err);
        }
    },
};